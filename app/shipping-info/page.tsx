import React from "react";

export default function ShippingInfoPage() {
  return (
    <div className="container mx-auto px-4 py-12 min-h-screen bg-white">
      <h1 className="text-3xl font-bold mb-6 text-amber-700">Shipping Information</h1>
      <div className="prose max-w-2xl">
        <h2>Delivery Times</h2>
        <p>We strive to deliver your jewelry as quickly and safely as possible. Most orders are processed within 1-2 business days. Delivery times typically range from 3-7 business days depending on your location.</p>
        <h2>Shipping Partners</h2>
        <p>We use trusted shipping partners to ensure your order arrives securely and on time. You will receive a tracking number as soon as your order is shipped.</p>
        <h2>Shipping Charges</h2>
        <p>Shipping is free for orders above ₹50,000. For orders below this amount, a nominal shipping fee will be applied at checkout.</p>
        <h2>Support</h2>
        <p>If you have any questions about your shipment, please contact us at <a href="mailto:alankarikaa@gmail.com">alankarikaa@gmail.com</a> or WhatsApp us at <a href="https://wa.me/9769432565" target="_blank" rel="noopener noreferrer">+91 9769432565</a>.</p>
      </div>
    </div>
  );
} 