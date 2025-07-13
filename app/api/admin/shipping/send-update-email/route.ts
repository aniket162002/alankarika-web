import { NextRequest, NextResponse } from 'next/server';
import { sendShippingUpdate } from '@/lib/email/service';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    await sendShippingUpdate(data);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 