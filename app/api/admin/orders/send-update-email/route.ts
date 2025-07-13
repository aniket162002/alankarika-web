import { NextRequest } from 'next/server';
import { sendOrderUpdate } from '@/lib/email/service';

export async function POST(req: NextRequest) {
  try {
    const { orderData, status } = await req.json();
    await sendOrderUpdate(orderData, status);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 500 });
  }
} 