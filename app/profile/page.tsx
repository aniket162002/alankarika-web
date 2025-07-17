"use client";
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useState, useEffect } from 'react';
import LoginRegisterModal from '@/components/ui/LoginRegisterModal';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { LogOut, User as UserIcon, ShoppingCart, Truck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, logout, loading } = useUser();
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
  }, [user, loading]);

  if (!user && !loading) return null;

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
      {/* This block is removed as per the edit hint */}
      {/* Main profile UI, only if user is logged in */}
      {user && (
        <motion.div
          className="w-full max-w-2xl z-10"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-white/95 rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center relative border border-orange-100 animate-fade-in mb-8">
            <div className="mb-4">
              <Image
                src="/alankarika-logo.png"
                alt="Alankarika Logo"
                width={64}
                height={64}
                className="rounded-full drop-shadow-lg border-2 border-amber-200 bg-white"
                priority
              />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2 font-playfair animate-fade-in">My Profile</h1>
            <div className="mb-6 w-full max-w-sm bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg shadow p-4 flex flex-col items-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-2xl uppercase mb-2">
                {user.full_name?.charAt(0) || user.email?.charAt(0) || <UserIcon className="w-8 h-8" />}
              </div>
              <div className="mb-1 text-lg font-semibold text-amber-700">{user.full_name}</div>
              <div className="mb-1 text-gray-700">{user.email}</div>
              <div className="mb-1 text-gray-700">{user.mobile}</div>
              <Badge className="bg-green-100 text-green-800 mt-2">Customer</Badge>
              <Button onClick={handleLogout} className="mt-4 w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow rounded-lg flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Logout
              </Button>
            </div>
            <div className="mt-4 text-center animate-fade-in">
              <span className="inline-block bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-4 py-2 rounded-full shadow-sm font-medium">
                Where Tradition Meets Elegance
              </span>
              <p className="text-xs text-gray-400 mt-2">Thank you for being a part of our jewelry family!</p>
            </div>
          </div>
          <motion.div
            id="orders"
            className="w-full bg-white/95 rounded-2xl shadow-xl px-8 py-8 border border-orange-100 animate-fade-in"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-700">
              <ShoppingCart className="w-6 h-6 text-orange-500" /> Order History
            </h2>
            {orders && orders.length === 0 ? (
              <div className="text-gray-500">No orders found.</div>
            ) : (
              <div className="space-y-6">
                {orders && orders.map((order: any, idx: number) => (
                  <motion.div
                    key={order.id}
                    className="relative bg-gradient-to-br from-yellow-50 via-amber-100 to-orange-50 rounded-2xl shadow-xl p-6 border border-amber-100 animate-fade-in overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                  >
                    {/* Logo watermark */}
                    <img src="/alankarika-logo.png" alt="Logo" className="absolute top-4 right-4 w-12 opacity-10 pointer-events-none select-none" />
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow">Order ID: {order.id.slice(0, 8)}</Badge>
                      <span className="font-semibold text-gray-900">Order No:</span> <span className="text-xs text-gray-700">{order.order_number}</span>
                      <span className="font-semibold text-gray-900">Status:</span>
                      <Badge className="bg-gradient-to-r from-green-400 to-green-600 text-white font-bold px-3 py-1 rounded-full shadow">{order.status || 'Pending'}</Badge>
                      <span className="font-semibold text-gray-900">Payment:</span>
                      <Badge className="bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold px-3 py-1 rounded-full shadow">{order.payment_status}</Badge>
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
                      <Button asChild variant="outline" className="bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow">
                        <Link href={`/payment/receipt/${order.id}`}>View Receipt</Link>
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
          {/* Shipping Tracking Section */}
          <motion.div
            className="w-full bg-white/95 rounded-2xl shadow-xl px-8 py-8 border border-orange-100 animate-fade-in mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-amber-700"><Truck className="w-6 h-6 text-orange-500" /> Shipping Tracking</h2>
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