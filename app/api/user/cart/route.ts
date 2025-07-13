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
    .from('cart_items')
    .select('*')
    .eq('simple_user_id', userId);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true, cart: data });
}

export async function POST(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }
  const { product_id, quantity } = await request.json();
  if (!product_id || !quantity) {
    return NextResponse.json({ success: false, error: 'Product and quantity required' }, { status: 400 });
  }
  // Upsert cart item for this user and product
  const { error } = await supabase
    .from('cart_items')
    .upsert({ product_id, quantity, simple_user_id: userId }, { onConflict: 'simple_user_id,product_id' });
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const userId = request.cookies.get('user_id')?.value;
  if (!userId) {
    return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
  }
  const { product_id } = await request.json();
  if (!product_id) {
    return NextResponse.json({ success: false, error: 'Product required' }, { status: 400 });
  }
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('simple_user_id', userId)
    .eq('product_id', product_id);
  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 