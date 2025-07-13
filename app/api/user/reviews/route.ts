import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('simple_user_id', userId)
    .order('created_at', { ascending: false });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, reviews: data });
}

export async function POST(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }
  const { product_id, rating, comment } = await request.json();
  if (!product_id || !rating || !comment) {
    return NextResponse.json({ success: false, error: 'All fields required' }, { status: 400 });
  }
  const { error } = await supabase
    .from('reviews')
    .insert({ product_id, rating, comment, simple_user_id: userId });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 