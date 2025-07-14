import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/utils';

// GET: List wishlist, POST: Add, DELETE: Remove
export async function GET(req: NextRequest) {
  const supabase = createClient();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { data, error } = await supabase
    .from('wishlist')
    .select('product_id, created_at')
    .eq('user_id', user.id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, wishlist: data });
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { product_id } = await req.json();
  if (!product_id) return NextResponse.json({ success: false, error: 'Missing product_id' }, { status: 400 });
  const { error } = await supabase
    .from('wishlist')
    .insert({ user_id: user.id, product_id });
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = createClient();
  const user = await getUserFromRequest(req);
  if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  const { product_id } = await req.json();
  if (!product_id) return NextResponse.json({ success: false, error: 'Missing product_id' }, { status: 400 });
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', product_id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
} 