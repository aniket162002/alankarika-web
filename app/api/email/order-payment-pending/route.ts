
import { NextRequest, NextResponse } from 'next/server';
import { sendOrderUpdate } from '@/lib/email/service';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { orderId, payment_screenshot } = await req.json();
    // Fetch full order details from DB
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (error || !order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    // Compose full orderData for email
    const orderData = {
      orderId: order.id,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone,
      shippingAddress: order.customer_address,
      items: order.items,
      totalAmount: order.total_amount,
      paymentMethod: order.payment_method,
      orderDate: order.created_at,
      payment_screenshot: payment_screenshot || order.payment_screenshot,
    };
    // Send user notification for payment pending
    await sendOrderUpdate(orderData, 'pending');
    // Only send admin notification for new payment (not for status updates)
    const { sendAdminOrderNotification } = await import('@/lib/email/service');
    await sendAdminOrderNotification(orderData);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
