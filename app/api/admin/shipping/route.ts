import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expect shipping fields in body
    const { order_id, tracking_number, shipping_provider, status, shipped_at, estimated_delivery, delivered_at, shipping_address, notes, simple_user_id } = body;
    if (!order_id || !status || !shipping_address) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('shipping')
      .insert({ order_id, tracking_number, shipping_provider, status, shipped_at, estimated_delivery, delivered_at, shipping_address, notes, simple_user_id })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, shipping: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Shipping id required' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('shipping')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, shipping: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Shipping id required' }, { status: 400 });
    }
    const { error } = await supabase
      .from('shipping')
      .delete()
      .eq('id', id);
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 