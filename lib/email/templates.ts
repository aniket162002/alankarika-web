import { companyName } from './config';

export const getEmailTemplate = (type: string, data: any) => {
  const DEPLOY_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://alankarika-web.vercel.app';
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
                <div class="product-card" style="display: flex; align-items: center; gap: 16px;">
                  <img src="${item.image_url || item.image || '/alankarika-logo.png'}" alt="${item.name}" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid #f59e0b; background: #fff;" />
                  <div>
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: ₹${item.price.toLocaleString()}</p>
                    ${(item.category || '').trim().toLowerCase() === 'मंगळसूत्र' && item.size ? `<p>Size: <b>${item.size}"</b></p>` : ''}
                    ${(item.category || '').trim().toLowerCase() === 'हेरबँड' && item.customName ? `<p>Name: <b>${item.customName}</b></p>` : ''}
                    ${item.name?.startsWith('पारिजात') && item.selectedColor ? `<p>Color: <b>${item.selectedColor}</b></p>` : ''}
                  </div>
                </div>
              `).join('')}

              <div style="margin: 30px 0;">
                <h3>Shipping Address:</h3>
                <p>${data.shippingAddress}</p>
              </div>

              <p>We'll send you another email when your order is confirmed and being prepared.</p>
              <p>For any questions, feel free to reach out to us!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${DEPLOY_URL}/profile#orders" class="button">Track Your Order</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
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
                <a href="${DEPLOY_URL}/profile#orders" class="button">Track Your Order</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'order_tracking_added':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Track Your Order - ${companyName}</title>
          ${baseStyle}
          <style>
            .tracking-card { background: linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 50%, #81d4fa 100%); padding: 25px; border-radius: 15px; margin: 25px 0; border: 3px solid #0288d1; box-shadow: 0 8px 25px rgba(2, 136, 209, 0.15); position: relative; overflow: hidden; }
            .tracking-card::before { content: '📦'; position: absolute; top: 10px; right: 15px; font-size: 24px; opacity: 0.3; }
            .tracking-button { display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #0288d1 0%, #0277bd 50%, #01579b 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: bold; margin: 20px 0; font-size: 18px; box-shadow: 0 6px 20px rgba(2, 136, 209, 0.4); transition: all 0.3s ease; text-transform: uppercase; letter-spacing: 1px; }
            .tracking-number { font-family: 'Courier New', monospace; background: #fff; padding: 8px 12px; border-radius: 6px; border: 2px dashed #0288d1; display: inline-block; font-weight: bold; color: #01579b; font-size: 16px; }
            .steps { display: flex; justify-content: space-between; margin: 30px 0; flex-wrap: wrap; }
            .step { text-align: center; flex: 1; min-width: 80px; margin: 5px; }
            .step-icon { width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; font-weight: bold; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }
            .step-active { background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); animation: pulse 2s infinite; }
            .step-pending { background: #e0e0e0; color: #757575; }
            @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }
            .delivery-info { background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%); padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 5px solid #9c27b0; }
            .sparkle-border { position: relative; }
            .sparkle-border::before { content: '✨'; position: absolute; top: -10px; left: -10px; font-size: 20px; animation: sparkle 3s infinite; }
            .sparkle-border::after { content: '✨'; position: absolute; bottom: -10px; right: -10px; font-size: 20px; animation: sparkle 3s infinite 1.5s; }
            @keyframes sparkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>🚚 Track Your Precious Order! 💎</h2>
            </div>
            <div class="content">
              <div class="sparkle-border">
                <p>Dear <strong>${data.customerName}</strong>,</p>
                <p>Great news! Your order now has tracking information available. You can monitor your jewelry's journey from our workshop to your doorstep!</p>
              </div>
              
              <div class="tracking-card">
                <h3 style="margin-top: 0; color: #01579b; font-size: 22px;">📦 Tracking Information</h3>
                <p><strong>Order ID:</strong> <span class="tracking-number">${data.orderId}</span></p>
                <p><strong>Status:</strong> <span class="status-badge status-shipped">Ready to Track</span></p>
                ${data.estimatedDelivery ? `<p><strong>Estimated Delivery:</strong> <span style="color: #2e7d32; font-weight: bold;">${new Date(data.estimatedDelivery).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>` : ''}
                <p style="margin-top: 15px; font-size: 14px; color: #0277bd;">💡 <em>Tip: Bookmark this tracking link for easy access!</em></p>
              </div>

              <div class="steps">
                <div class="step">
                  <div class="step-icon">✓</div>
                  <small>Order Confirmed</small>
                </div>
                <div class="step">
                  <div class="step-icon step-active">🔨</div>
                  <small>In Production</small>
                </div>
                <div class="step">
                  <div class="step-icon step-pending">📦</div>
                  <small>Packaging</small>
                </div>
                <div class="step">
                  <div class="step-icon step-pending">🚚</div>
                  <small>Shipped</small>
                </div>
                <div class="step">
                  <div class="step-icon step-pending">🏠</div>
                  <small>Delivered</small>
                </div>
              </div>

              <div class="delivery-info">
                <h4 style="margin-top: 0; color: #7b1fa2;">🏺 About Your Jewelry</h4>
                <p>Your exquisite pieces are being crafted with the utmost care by our master artisans. Each item represents centuries of traditional Indian craftsmanship and will be carefully packaged to ensure safe delivery.</p>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="${data.trackingUrl}" class="tracking-button">🔍 Track Your Package Now</a>
                <p style="font-size: 12px; color: #666; margin-top: 10px;">Click the button above to view real-time tracking updates</p>
              </div>

              <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); padding: 20px; border-radius: 12px; margin: 25px 0; border: 2px solid #ff9800;">
                <h4 style="margin-top: 0; color: #f57c00;">📞 Need Help?</h4>
                <p style="margin-bottom: 0;">Our customer support team is here to help! Contact us at <strong>📧 alankarikaa@gmail.com</strong> or <strong>📞 +91 9167261572</strong> for any questions about your order.</p>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 600; background: linear-gradient(135deg, #f59e0b, #ea580c); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">✨ Akrix Solutions ✨</a>
                </p>
              </div>
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
                <p><strong>Tracking Number:</strong> <span class="highlight">${data.trackingNumber || 'To be assigned'}</span></p>
                <p><strong>Shipping Provider:</strong> Alankarika</p>
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
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
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
                <a href="${DEPLOY_URL}/reviews/new?order=${data.orderId}" class="button">Leave a Review</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
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
                  ${(item.category || '').trim().toLowerCase() === 'मंगळसूत्र' && item.size ? `<p>Size: <b>${item.size}"</b></p>` : ''}
                  ${(item.category || '').trim().toLowerCase() === 'हेरबँड' && item.customName ? `<p>Name: <b>${item.customName}</b></p>` : ''}
                  ${item.name?.startsWith('पारिजात') && item.selectedColor ? `<p>Color: <b>${item.selectedColor}</b></p>` : ''}
                </div>
              `).join('')}

              <div style="margin: 30px 0;">
                <h3>Shipping Address:</h3>
                <p>${data.shippingAddress}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${DEPLOY_URL}/admin/orders/${data.orderId}" class="button">Manage Order</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Admin Dashboard.</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
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
                <a href="${DEPLOY_URL}/products/${data.productId}" class="button">View Product</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;

    case 'order_payment_pending':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Your Payment is Pending Approval - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Your Payment is Pending Approval</h2>
            </div>
            <div class="content">
              <p>Thank you for submitting your payment for Order #${data.orderId}. Your payment is under review. You can track your order status below.</p>
              <a href="${DEPLOY_URL}/profile#orders" class="button">Track Your Order</a>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    case 'order_payment_confirmed':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Your Order is Confirmed! - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Your Order is Confirmed!</h2>
            </div>
            <div class="content">
              <p>Your payment for Order #${data.orderId} has been approved and your order is now confirmed.</p>
              ${data.payment_screenshot ? `<p>Payment Receipt: <a href="https://ljvrtryayjlwtankpfrm.supabase.co/storage/v1/object/public/payment_screenshots/${data.payment_screenshot}">View Screenshot</a></p>` : ''}
              <a href="${DEPLOY_URL}/profile#orders" class="button">Track Your Order</a>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
    case 'order_payment_failed':
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Payment Rejected for Your Order - ${companyName}</title>
          ${baseStyle}
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="/alankarika-logo.png" alt="Alankarika Logo" class="logo" />
              <h1>✨ ${companyName} ✨</h1>
              <h2>Payment Rejected for Your Order</h2>
            </div>
            <div class="content">
              <p>Unfortunately, your payment for Order #${data.orderId} was not approved. Please contact support or try again.</p>
              <a href="${DEPLOY_URL}/profile#orders" class="button">Track Your Order</a>
            </div>
            <div class="footer">
              <p>© 2025 ${companyName}. Where Tradition Meets Elegance.</p>
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
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
              <p>📧 alankarikaa@gmail.com | 📞 +91 9167261572</p>
              <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb; text-align: center;">
                <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                  Powered by <a href="https://akrixsolutions.in" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 500;">Akrix Solutions</a>
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `;
  }
};
