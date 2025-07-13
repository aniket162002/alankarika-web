import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmation } from '@/lib/email/service';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    const result = await sendOrderConfirmation(orderData);
    if (result && result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result?.error || 'Unknown error' }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 