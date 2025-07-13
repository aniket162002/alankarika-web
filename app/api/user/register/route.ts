import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, email, mobile } = await request.json();
    if (!name || !email || !mobile) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    // Check if mobile already exists
    const { data: existingUser, error: findError } = await supabase
      .from('simple_users')
      .select('*')
      .eq('mobile', mobile)
      .single();
    if (existingUser) {
      return NextResponse.json({ success: false, error: 'Mobile number already registered. Please login.' }, { status: 409 });
    }
    // 1. Insert into simple_users
    const { data: userData, error: userError } = await supabase
      .from('simple_users')
      .insert({ name, email, mobile })
      .select()
      .single();
    if (userError) {
      return NextResponse.json({ success: false, error: userError.message }, { status: 500 });
    }
    // 2. Insert/update profile with simple_user_id
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userData.id, // Fix: set id to userData.id
        simple_user_id: userData.id,
        full_name: name,
        email,
        mobile,
        role: 'customer'
      }, { onConflict: 'mobile' })
      .select()
      .single();
    if (profileError) {
      return NextResponse.json({ success: false, error: profileError.message }, { status: 500 });
    }
    // 3. Generate a mock session token
    const sessionToken = 'user_session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const response = NextResponse.json({ success: true, user: profileData, session_token: sessionToken });
    response.cookies.set('user_session_token', sessionToken, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('user_id', profileData.simple_user_id, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
} 