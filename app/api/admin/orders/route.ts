import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // Expect order fields in body
    const { user_id, customer_name, customer_email, customer_phone, customer_address, items, total_amount, payment_status, payment_method, razorpay_order_id, razorpay_payment_id, status, order_number, notes, estimated_delivery, simple_user_id } = body;
    if (!customer_name || !items || !total_amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('orders')
      .insert({ user_id, customer_name, customer_email, customer_phone, customer_address, items, total_amount, payment_status, payment_method, razorpay_order_id, razorpay_payment_id, status, order_number, notes, estimated_delivery, simple_user_id })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, notes, status, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order id required' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('orders')
      .update({ ...updates, status, notes })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
    // Insert order tracking entry
    await supabase.from('order_tracking').insert({
      order_id: id,
      status: status,
      message: notes || `Order status updated to ${status}`,
      created_at: new Date().toISOString()
    });
    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: 'Order id required' }, { status: 400 });
    }
    const { error } = await supabase
      .from('orders')
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