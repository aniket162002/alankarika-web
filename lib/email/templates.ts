import { companyName } from './config';

export const getEmailTemplate = (type: string, data: any) => {
  const baseStyle = `
    <style>
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f5f5f5; }
      .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 18px; border: 3px solid #D97706; box-shadow: 0 8px 32px rgba(139,0,0,0.08); position: relative; overflow: hidden; }
      .header { background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; padding: 32px 20px 20px 20px; text-align: center; position: relative; }
      .header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 12px; background: repeating-linear-gradient(90deg, #fffbe6, #fffbe6 12px, #f59e0b 12px, #f59e0b 24px); border-top-left-radius: 18px; border-top-right-radius: 18px; }
      .logo { width: 80px; height: 80px; margin: 0 auto 16px; display: block; border-radius: 50%; box-shadow: 0 2px 12px #fffbe6; border: 3px solid #fffbe6; background: #fff; }
      .content { padding: 30px; background: repeating-linear-gradient(135deg, #fffbe6 0px, #fffbe6 24px, #f3f4f6 24px, #f3f4f6 48px); }
      .footer { background-color: #1f2937; color: white; padding: 24px 20px; text-align: center; font-size: 15px; border-bottom-left-radius: 18px; border-bottom-right-radius: 18px; }
      .button { display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 16px 0; font-size: 16px; box-shadow: 0 2px 8px #f59e0b33; }
      .highlight { color: #ea580c; font-weight: bold; }
      .product-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 15px; margin: 10px 0; background: #fff; }
      .status-badge { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 13px; font-weight: bold; letter-spacing: 0.5px; }
      .status-pending { background-color: #fef3c7; color: #92400e; }
      .status-confirmed { background-color: #dbeafe; color: #1e40af; }
      .status-shipped { background-color: #dcfce7; color: #166534; }
      .status-delivered { background-color: #d1fae5; color: #065f46; }
      .sparkle { color: #f59e0b; font-size: 18px; }
      .thankyou { color: #b91c1c; font-size: 20px; font-weight: bold; margin: 32px 0 0 0; letter-spacing: 1px; }
    </style>
  `;

  switch (type) {
    case 'order_placed':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmation - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Order Confirmation</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${data.customerName}</strong>,</p>
              <p>Thank you for your order! We're excited to craft your beautiful jewelry pieces.</p>
              
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleDateString()}</p>
                <p><strong>Total Amount:</strong> ₹${data.totalAmount.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                <p><strong>Status:</strong> <span class="status-badge status-pending">Order Placed</span></p>
              </div>

              <h3>Items Ordered:</h3>
              ${data.items.map((item: any) => `
                <div class="product-card">
                  <h4>${item.name}</h4>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Price: ₹${item.price.toLocaleString()}</p>
                </div>
              `).join('')}

              <div style="margin: 30px 0;">
                <h3>Shipping Address:</h3>
                <p>${data.shippingAddress}</p>
              </div>

              <p>We'll send you another email when your order is confirmed and being prepared.</p>
              <p>For any questions, feel free to reach out to us!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}" class="button">Track Your Order</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 akrutiutekar@gmail.com | 📞 +91 9769432565</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'order_confirmed':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Confirmed - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Order Confirmed! 🎉</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${data.customerName}</strong>,</p>
              <p>Great news! Your order has been confirmed and is now being prepared by our master craftsmen.</p>
              
              <div style="background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Update</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Status:</strong> <span class="status-badge status-confirmed">Confirmed & In Production</span></p>
                <p><strong>Estimated Completion:</strong> ${data.estimatedCompletion || '3-5 business days'}</p>
              </div>

              <p>Your exquisite jewelry pieces are being crafted with the utmost care and attention to detail. Each piece is a work of art that carries the legacy of traditional Indian craftsmanship.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/orders/${data.orderId}" class="button">Track Your Order</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 akrutiutekar@gmail.com | 📞 +91 9769432565</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'order_shipped':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Shipped - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Your Order is On Its Way! 🚚</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${data.customerName}</strong>,</p>
              <p>Your beautiful jewelry pieces are now on their way to you!</p>
              
              <div style="background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Shipping Details</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Tracking Number:</strong> <span class="highlight">${data.trackingNumber}</span></p>
                <p><strong>Shipping Provider:</strong> ${data.shippingProvider}</p>
                <p><strong>Status:</strong> <span class="status-badge status-shipped">Shipped</span></p>
                <p><strong>Estimated Delivery:</strong> ${new Date(data.estimatedDelivery).toLocaleDateString()}</p>
              </div>

              <p>You can track your package using the tracking number above. We'll send you another update when your order is delivered.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${data.trackingUrl || '#'}" class="button">Track Package</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 akrutiutekar@gmail.com | 📞 +91 9769432565</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'order_delivered':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Order Delivered - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Your Order Has Been Delivered! 🎁</h2>
            </div>
            <div class="content">
              <p>Dear <strong>${data.customerName}</strong>,</p>
              <p>We're delighted to inform you that your jewelry order has been successfully delivered!</p>
              
              <div style="background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Delivery Confirmation</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Delivered On:</strong> ${new Date(data.deliveredAt).toLocaleDateString()}</p>
                <p><strong>Status:</strong> <span class="status-badge status-delivered">Delivered</span></p>
              </div>

              <p>We hope you love your new jewelry pieces! Each item has been crafted with love and represents the finest traditions of Indian artistry.</p>
              
              <p>Please take a moment to share your experience with us. Your feedback helps us continue to provide exceptional service.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/reviews/new?order=${data.orderId}" class="button">Leave a Review</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 akrutiutekar@gmail.com | 📞 +91 9769432565</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'admin_order_notification':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Order - ${companyName} Admin</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} Admin ✨</h1>
              <h2>New Order Received! 🛍️</h2>
            </div>
            <div class="content">
              <p>A new order has been placed and requires your attention.</p>
              
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> ${data.orderId}</p>
                <p><strong>Customer:</strong> ${data.customerName}</p>
                <p><strong>Email:</strong> ${data.customerEmail}</p>
                <p><strong>Phone:</strong> ${data.customerPhone}</p>
                <p><strong>Total Amount:</strong> ₹${data.totalAmount.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${data.paymentMethod}</p>
                <p><strong>Order Date:</strong> ${new Date(data.orderDate).toLocaleDateString()}</p>
              </div>

              <h3>Items Ordered:</h3>
              ${data.items.map((item: any) => `
                <div class="product-card">
                  <h4>${item.name}</h4>
                  <p>Quantity: ${item.quantity}</p>
                  <p>Price: ₹${item.price.toLocaleString()}</p>
                </div>
              `).join('')}

              <div style="margin: 30px 0;">
                <h3>Shipping Address:</h3>
                <p>${data.shippingAddress}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${data.orderId}" class="button">Manage Order</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Admin Dashboard.</p>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'product_added':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>New Product Alert - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>New Jewelry Collection Alert! 💎</h2>
            </div>
            <div class="content">
              <p>Dear Jewelry Lover,</p>
              <p>We're excited to introduce our latest addition to the ${companyName} collection!</p>
              
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%); padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>New Product</h3>
                <p><strong>Name:</strong> ${data.productName}</p>
                <p><strong>Category:</strong> ${data.category}</p>
                <p><strong>Material:</strong> ${data.material}</p>
                <p><strong>Price:</strong> ₹${data.price.toLocaleString()}</p>
              </div>

              <p>${data.description}</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/products/${data.productId}" class="button">View Product</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 akrutiutekar@gmail.com | 📞 +91 9769432565</p>
            </div>
          </div>
        </body>
        </html>
      `;

    default:
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Notification - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Notification</h2>
            </div>
            <div class="content">
              <p>${data.message}</p>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 akrutiutekar@gmail.com | 📞 +91 9769432565</p>
            </div>
          </div>
        </body>
        </html>
      `;
  }
};
