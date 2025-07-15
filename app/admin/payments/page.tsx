'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createClient } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PaymentReview() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch only online payment requests with pending status
  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('payment_method', 'online')
      .eq('payment_status', 'pending')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  // Real-time updates
  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const data = await fetchPayments();
      if (isMounted) setOrders(data || []);
    };
    load();
    const channel = supabase.channel('realtime-payments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (order: any) => {
    setLoading(true);
    try {
      // Update order status
      await supabase.from('orders').update({ payment_status: 'paid', status: 'confirmed', updated_at: new Date().toISOString() }).eq('id', order.id);
      // Send confirmation email (implement API call as needed)
      await fetch('/api/email/order-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          customerPhone: order.customer_phone,
          shippingAddress: order.customer_address,
          items: order.items,
          totalAmount: order.total_amount,
          paymentMethod: 'online',
          orderDate: order.created_at,
          paymentReceipt: order.payment_screenshot
        })
      });
      toast.success('Payment approved and user notified!');
      setIsDialogOpen(false);
    } catch (e) {
      toast.error('Failed to approve payment.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (order: any) => {
    setLoading(true);
    try {
      await supabase.from('orders').update({ payment_status: 'failed', status: 'cancelled', updated_at: new Date().toISOString() }).eq('id', order.id);
      // Send rejection email (implement API call as needed)
      await fetch('/api/email/order-rejected', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.id,
          customerName: order.customer_name,
          customerEmail: order.customer_email,
        })
      });
      toast.success('Payment rejected and user notified!');
      setIsDialogOpen(false);
    } catch (e) {
      toast.error('Failed to reject payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Online Payment Review</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>UTR</TableHead>
                <TableHead>App</TableHead>
                <TableHead>Screenshot</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-gray-500">No pending online payments.</TableCell></TableRow>
              )}
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell>{order.id.slice(0, 8)}</TableCell>
                  <TableCell>{order.customer_name}<br /><span className="text-xs text-gray-500">{order.customer_email}</span></TableCell>
                  <TableCell>₹{order.total_amount?.toLocaleString()}</TableCell>
                  <TableCell>{order.payment_utr}</TableCell>
                  <TableCell>{order.payment_app}</TableCell>
                  <TableCell>
                    {order.payment_screenshot && (
                      <a href={`https://ljvrtryayjlwtankpfrm.supabase.co/storage/v1/object/public/payment_screenshots/${order.payment_screenshot}`} target="_blank" rel="noopener noreferrer">
                        <img src={`https://ljvrtryayjlwtankpfrm.supabase.co/storage/v1/object/public/payment_screenshots/${order.payment_screenshot}`} alt="Screenshot" className="w-16 h-16 object-cover rounded border" />
                      </a>
                    )}
                  </TableCell>
                  <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => { setSelectedOrder(order); setIsDialogOpen(true); }}>Review</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for payment review */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Payment</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div><b>Order ID:</b> {selectedOrder.id}</div>
              <div><b>Customer:</b> {selectedOrder.customer_name} ({selectedOrder.customer_email})</div>
              <div><b>Amount:</b> ₹{selectedOrder.total_amount?.toLocaleString()}</div>
              <div><b>UTR/Txn ID:</b> {selectedOrder.payment_utr}</div>
              <div><b>Payment App:</b> {selectedOrder.payment_app}</div>
              {selectedOrder.payment_screenshot && (
                <div>
                  <b>Screenshot:</b><br />
                  <a href={`https://ljvrtryayjlwtankpfrm.supabase.co/storage/v1/object/public/payment_screenshots/${selectedOrder.payment_screenshot}`} target="_blank" rel="noopener noreferrer">
                    <img src={`https://ljvrtryayjlwtankpfrm.supabase.co/storage/v1/object/public/payment_screenshots/${selectedOrder.payment_screenshot}`} alt="Screenshot" className="w-40 border rounded mt-2" />
                  </a>
                </div>
              )}
              <div className="flex gap-4 mt-4">
                <Button className="bg-green-600 hover:bg-green-700 text-white" disabled={loading} onClick={() => handleApprove(selectedOrder)}>Approve</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={loading} onClick={() => handleReject(selectedOrder)}>Reject</Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 