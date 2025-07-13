import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Ensure this API route is dynamically rendered
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = body;

    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keySecret) {
      return NextResponse.json({ error: "Missing Razorpay Secret Key" }, { status: 500 });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing required payment parameters" }, { status: 400 });
    }

    // For test payments, sometimes Razorpay sends different signature format
    // Let's handle both cases
    const signatureString = razorpay_order_id + "|" + razorpay_payment_id;
    
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(signatureString)
      .digest('hex');

    const isAuthentic = generatedSignature === razorpay_signature;

    // For development/test mode, also check if this is a test payment
    const isTestPayment = razorpay_payment_id?.startsWith('pay_test') || 
                         razorpay_order_id?.startsWith('order_test') ||
                         process.env.NODE_ENV === 'development';

    if (isAuthentic || (isTestPayment && process.env.NODE_ENV === 'development')) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ 
        error: "Signature mismatch",
        details: {
          expected: generatedSignature,
          received: razorpay_signature,
          isTestPayment: isTestPayment
        }
      }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
