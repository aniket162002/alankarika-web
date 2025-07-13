import Razorpay from 'razorpay';
import { NextResponse } from 'next/server';

// Ensure this API route is dynamically rendered
export const dynamic = 'force-dynamic';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerInfo, cartItems } = body;

    // Create Razorpay order
    const options = {
      amount: amount, // in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // For now, return the order with a temporary orderId
    // TODO: Save to database after fixing the service role key
    return NextResponse.json({ 
      ...razorpayOrder, 
      orderId: `temp_${Date.now()}`,
      customerInfo,
      cartItems
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
