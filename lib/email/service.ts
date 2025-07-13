import { transporter, adminEmail, companyEmail } from './config';
import { getEmailTemplate } from './templates';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface EmailData {
  type: string;
  recipient: string;
  recipientName?: string;
  subject: string;
  data: any;
}

export const sendEmail = async (emailData: EmailData) => {
  try {
    const htmlContent = getEmailTemplate(emailData.type, emailData.data);
    
    const mailOptions = {
      from: `"${emailData.data.companyName || 'अलंकारिका'}" <${companyEmail}>`,
      to: emailData.recipient,
      subject: emailData.subject,
      html: htmlContent,
    };

    const result = await transporter.sendMail(mailOptions);
    
    // Log notification to database
    await supabase.from('notifications').insert({
      type: emailData.type,
      title: emailData.subject,
      message: emailData.subject,
      recipient_email: emailData.recipient,
      recipient_name: emailData.recipientName,
      data: emailData.data,
      status: 'sent',
      sent_at: new Date().toISOString()
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    
    // Log failed notification to database
    await supabase.from('notifications').insert({
      type: emailData.type,
      title: emailData.subject,
      message: emailData.subject,
      recipient_email: emailData.recipient,
      recipient_name: emailData.recipientName,
      data: emailData.data,
      status: 'failed'
    });

    return { success: false, error: (error as Error).message };
  }
};

// Specific email functions
export const sendOrderConfirmation = async (orderData: any) => {
  try {
    // Compose email data
    const emailData = {
      type: 'order_placed',
      recipient: orderData.customerEmail || orderData.customer_email,
      recipientName: orderData.customerName || orderData.customer_name,
      subject: `Order Confirmation - अलंकारिका` ,
      data: {
        orderId: orderData.id || orderData.orderId,
        orderDate: orderData.created_at || orderData.orderDate || new Date().toISOString(),
        totalAmount: orderData.total_amount || orderData.totalAmount,
        paymentMethod: orderData.payment_method || orderData.paymentMethod,
        items: orderData.items,
        shippingAddress: orderData.customer_address || orderData.shippingAddress,
        customerName: orderData.customer_name || orderData.customerName,
      },
    };
    const result = await sendEmail(emailData);
    if (result && result.success) {
      return { success: true };
    } else {
      return { success: false, error: result };
    }
  } catch (error: any) {
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else {
      errorMessage = (error as any)?.message || String(error);
    }
    return { success: false, error: errorMessage };
  }
};

export const sendOrderUpdate = async (orderData: any, status: string) => {
  const emailType = status === 'confirmed' ? 'order_confirmed' :
                   status === 'shipped' ? 'order_shipped' :
                   status === 'delivered' ? 'order_delivered' : 'order_update';
  
  const subjects = {
    order_confirmed: 'Order Confirmed & In Production',
    order_shipped: 'Order Shipped - Tracking Details',
    order_delivered: 'Order Delivered Successfully',
    order_update: 'Order Status Update'
  };

  return sendEmail({
    type: emailType,
    recipient: orderData.customerEmail,
    recipientName: orderData.customerName,
    subject: `${subjects[emailType]} - ${orderData.orderId} | अलंकारिका`,
    data: orderData
  });
};

export const sendAdminOrderNotification = async (orderData: any) => {
  return sendEmail({
    type: 'admin_order_notification',
    recipient: adminEmail,
    recipientName: 'Admin',
    subject: `New Order Alert - ${orderData.orderId} | अलंकारिका Admin`,
    data: orderData
  });
};

export const sendProductAddedNotification = async (productData: any, subscriberEmails: string[]) => {
  const promises = subscriberEmails.map(email => 
    sendEmail({
      type: 'product_added',
      recipient: email,
      subject: `New Product Alert: ${productData.productName} | अलंकारिका`,
      data: productData
    })
  );

  return Promise.allSettled(promises);
};

export const sendShippingUpdate = async (shippingData: any) => {
  return sendEmail({
    type: 'order_shipped',
    recipient: shippingData.customerEmail,
    recipientName: shippingData.customerName,
    subject: `Shipping Update - ${shippingData.orderId} | अलंकारिका`,
    data: shippingData
  });
};
