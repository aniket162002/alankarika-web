import { NextRequest } from 'next/server';
import { sendTrackingNotification } from '@/lib/email/service';

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    if (!orderData.customerEmail || !orderData.trackingUrl) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Customer email and tracking URL are required' 
        }), 
        { status: 400 }
      );
    }

    const result = await sendTrackingNotification(orderData);
    
    if (result.success) {
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Tracking email sent successfully' 
      }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ 
        success: false, 
        error: result.error 
      }), { status: 500 });
    }
  } catch (error: any) {
    console.error('Error sending tracking email:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), { status: 500 });
  }
} 