"use client";
import { useUser } from '@/hooks/useUser';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useState, useEffect } from 'react';
import LoginRegisterModal from '@/components/ui/LoginRegisterModal';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ShippingTrackingPage() {
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

  // Real-time shipping records for user's orders
  const [shippingRecords, setShippingRecords] = useState([]);
  useEffect(() => {
    if (!orders || orders.length === 0) {
      setShippingRecords([]);
      return;
    }
    let isMounted = true;
    const fetchShipping = async () => {
      const orderIds = orders.map((o: any) => o.id);
      if (orderIds.length === 0) return setShippingRecords([]);
      // Fetch all shipping records for these order IDs
      const res = await fetch('/api/user/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderIds }),
      });
      const data = await res.json();
      if (isMounted) setShippingRecords(data.success ? data.shipping : []);
    };
    fetchShipping();
    return () => { isMounted = false; };
  }, [orders]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-100 to-yellow-50 relative overflow-hidden">
      {/* Go Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 mr-1"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Go Back Home
          </Button>
        </Link>
      </div>
      {/* Animated festive background sparkles */}
      <motion.div
        className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-amber-300 to-orange-400 rounded-full blur-2xl opacity-30 animate-fade-in"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 1.2 }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tr from-yellow-200 to-orange-300 rounded-full blur-2xl opacity-20 animate-fade-in"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.2, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {/* Show login modal only if not logged in AND showAuthModal is true */}
      {!user && showAuthModal && (
        <LoginRegisterModal 
          open={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          onSuccess={() => setShowAuthModal(false)} 
        />
      )}
      {/* Main shipping tracking UI, only if user is logged in */}
      {user && (
        <motion.div
          className="w-full max-w-2xl z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center relative border border-orange-100 animate-fade-in mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 font-playfair animate-fade-in flex items-center gap-2"><Truck className="w-8 h-8 text-orange-500" /> Shipping Tracking</h1>
            <div className="mt-4 text-center animate-fade-in">
              <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full shadow-sm font-medium">
                Track your orders in real-time
              </span>
              <p className="text-xs text-gray-400 mt-2">Get the latest updates on your shipments!</p>
            </div>
          </div>
          <motion.div
            className="w-full bg-white/95 rounded-2xl shadow-xl px-8 py-8 border border-orange-100 animate-fade-in"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {(!shippingRecords || shippingRecords.length === 0) ? (
              <div className="text-gray-500">No shipping records found.</div>
            ) : (
              <div className="space-y-4">
                {shippingRecords.map((ship: any, idx: number) => (
                  <motion.div
                    key={ship.id}
                    className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow p-4 animate-fade-in"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Order ID:</span> <span className="font-mono text-xs text-gray-700">{ship.order_id}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Tracking Number:</span> <span className="text-gray-700">{ship.tracking_number || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Provider:</span> <span className="text-gray-700">{ship.shipping_provider || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Status:</span> <span className="text-orange-700 font-bold">{ship.status}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">Estimated Delivery:</span> <span className="text-gray-700">{ship.estimated_delivery ? new Date(ship.estimated_delivery).toLocaleDateString() : 'Not set'}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
