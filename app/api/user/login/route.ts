import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();
    if (!mobile) {
      return NextResponse.json({ success: false, error: 'Mobile number is required.' }, { status: 400 });
    }
    // 1. Find user in simple_users
    const { data: userData, error: userError } = await supabase
      .from('simple_users')
      .select('*')
      .eq('mobile', mobile)
      .single();
    if (!userData) {
      return NextResponse.json({ success: false, error: 'User not found. Please register.' }, { status: 404 });
    }
    // 2. Get profile by simple_user_id
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('simple_user_id', userData.id)
      .single();
    if (!profileData) {
      return NextResponse.json({ success: false, error: 'Profile not found.' }, { status: 404 });
    }
    // 3. Generate a mock session token
    const sessionToken = 'user_session_' + Date.now() + '_' + Math.random().toString(36).slice(2);
    const response = NextResponse.json({ success: true, user: profileData, session_token: sessionToken });
    response.cookies.set('user_session_token', sessionToken, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('user_id', userData.id, { path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 