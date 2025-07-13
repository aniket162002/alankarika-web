"use client";
import { useUser } from '@/hooks/useUser';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useState, useEffect } from 'react';
import LoginRegisterModal from '@/components/ui/LoginRegisterModal';

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
    <>
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
        <div className="max-w-2xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">Order Tracking</h1>
          {orders && orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <div className="space-y-4">
              {orders && orders.map((order: any) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-4">
                  <div><strong>Order ID:</strong> {order.id}</div>
                  <div><strong>Status:</strong> {order.status}</div>
                  <div><strong>Total:</strong> ₹{order.total_amount?.toLocaleString()}</div>
                  <div><strong>Date:</strong> {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</div>
                  <div><strong>Items:</strong>
                    <ul className="list-disc ml-6">
                      {order.items?.map((item: any, idx: number) => (
                        <li key={idx}>{item.name} x {item.quantity}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
} 