"use client";
import { useUser } from '@/hooks/useUser';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useState, useEffect } from 'react';
import LoginRegisterModal from '@/components/ui/LoginRegisterModal';
import Link from 'next/link';

export default function OrdersPage() {
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!user && !loading) setShowAuthModal(true);
    else setShowAuthModal(false);
  }, [user, loading]);

  // Real-time orders
  const orders = useSupabaseRealtime(
    async () => {
      const res = await fetch('/api/user/orders');
      const data = await res.json();
      return data.success ? data.orders : [];
    },
    'orders',
    [user]
  );

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 relative overflow-hidden">
      {/* Go Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow hover:bg-amber-50">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Go Back Home
          </button>
        </Link>
      </div>
      {/* Animated festive background sparkles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-2xl opacity-30 animate-fade-in" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-orange-300 rounded-full blur-2xl opacity-20 animate-fade-in" />
      {/* Show login modal only if not logged in AND showAuthModal is true */}
      {!user && showAuthModal && (
        <LoginRegisterModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={() => setShowAuthModal(false)} 
        />
      )}
      {/* Main orders UI, only if user is logged in */}
      {user && (
        <div className="w-full max-w-2xl z-10">
          <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center relative border border-orange-100 animate-fade-in mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 font-playfair animate-fade-in flex items-center gap-2">Order History</h1>
            <div className="mt-4 text-center animate-fade-in">
              <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full shadow-sm font-medium">
                Your complete order history
              </span>
              <p className="text-xs text-gray-400 mt-2">Track all your purchases and receipts!</p>
            </div>
          </div>
          <div className="w-full bg-white/95 rounded-2xl shadow-xl px-8 py-8 border border-orange-100 animate-fade-in">
            {orders && orders.length === 0 ? (
              <div className="text-gray-500">No orders found.</div>
            ) : (
              <div className="space-y-6">
                {orders && orders.map((order: any, idx: number) => (
                  <div
                    key={order.id}
                    className="relative bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50 rounded-2xl shadow-xl p-6 border border-amber-100 animate-fade-in overflow-hidden"
                  >
                    {/* Logo watermark */}
                    <img src="/alankarika-logo.png" alt="Logo" className="absolute top-4 right-4 w-12 opacity-10 pointer-events-none select-none" />
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-semibold text-gray-900">Order No:</span> <span className="text-xs text-gray-700">{order.order_number}</span>
                      <span className="font-semibold text-gray-900">Status:</span>
                      <span className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-3 py-1 rounded-full shadow">{order.status || 'Pending'}</span>
                      <span className="font-semibold text-gray-900">Payment:</span>
                      <span className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold px-3 py-1 rounded-full shadow">{order.payment_status}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-orange-600">₹{order.total_amount?.toLocaleString()}</span>
                      <span className="font-semibold text-gray-900">Date:</span>
                      <span className="text-gray-700">{order.created_at ? new Date(order.created_at).toLocaleString() : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-semibold text-gray-900">Items:</span>
                      <ul className="list-disc ml-6 text-gray-700">
                        {order.items?.map((item: any, idx: number) => (
                          <li key={idx}>{item.name} x {item.quantity}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-semibold text-gray-900">Shipping:</span>
                      <span className="text-gray-700">{order.shipping_address ? (typeof order.shipping_address === 'string' ? order.shipping_address : JSON.stringify(order.shipping_address)) : 'N/A'}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="font-semibold text-gray-900">Notes:</span>
                      <span className="text-gray-700">{order.notes || 'N/A'}</span>
                    </div>
                    <div className="flex gap-4 mt-4">
                      <button className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow px-4 py-2 rounded-lg">
                        <Link href={`/payment/receipt/${order.id}`}>View Receipt</Link>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 