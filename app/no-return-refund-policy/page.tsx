'use client';

import React from "react";
import Header from '@/components/ui/Header';

export default function NoReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-amber-700">No Return & No Refund Policy</h1>
        <div className="prose bg-white rounded-xl shadow p-6 text-center">
          <p><strong>All sales are final. No returns or refunds will be accepted under any circumstances.</strong></p>
        </div>
      </div>
    </div>
  );
} 