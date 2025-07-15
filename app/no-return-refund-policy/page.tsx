'use client';

import React from "react";
import Header from '@/components/ui/Header';

export default function NoReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-amber-700">No Return & Refund Policy</h1>
        <div className="prose bg-white rounded-xl shadow p-6">
          <p><strong>Thank you for shopping with अलंकारिका!</strong></p>
          <p>All sales are final. We do not accept returns or offer refunds for any products purchased through our website or in-store, except in the case of damaged or defective items received.</p>
          <h2>Exceptions</h2>
          <ul>
            <li>If you receive a damaged or defective product, please contact us within 48 hours of delivery with photos and order details.</li>
            <li>We will review your request and, if approved, arrange for a replacement or store credit at our discretion.</li>
          </ul>
          <h2>Contact Us</h2>
          <p>If you have any questions about this policy, please contact us at <a href="mailto:alankarikaa@gmail.com">alankarikaa@gmail.com</a> or WhatsApp us at <a href="https://wa.me/9769432565" target="_blank" rel="noopener noreferrer">+91 9769432565</a>.</p>
        </div>
      </div>
    </div>
  );
} 