import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { id, name, email, mobile } = await request.json();
    if (!id || !name || !email || !mobile) {
      return NextResponse.json({ success: false, error: 'All fields are required.' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('profiles')
      .insert({ id, full_name: name, email, mobile, role: 'customer' })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, user: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || String(error) }, { status: 500 });
  }
} 