'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@supabase/supabase-js';
import { useUser } from '@/hooks/useUser';

// Add a type for formData
interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function PaymentQRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [paymentData, setPaymentData] = useState({
    utr: '',
    app: '',
    screenshot: null as File | null,
    notes: ''
  });

  // Parse checkout data from query
  let checkoutData: { formData: CheckoutFormData; cartItems: any[]; total: number } = { formData: { name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' }, cartItems: [], total: 0 };
  try {
    if (searchParams.get('data')) {
      checkoutData = JSON.parse(decodeURIComponent(searchParams.get('data')!));
    }
  } catch {}

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPaymentData({ ...paymentData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentData({ ...paymentData, screenshot: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // 1. Upload screenshot to Supabase Storage (optional, or use base64 for demo)
      let screenshotUrl = '';
      if (paymentData.screenshot) {
        const { data, error: uploadError } = await supabase.storage
          .from('payment_screenshots')
          .upload(`screenshots/${Date.now()}_${paymentData.screenshot.name}`, paymentData.screenshot);
        if (uploadError) throw new Error('Failed to upload screenshot');
        screenshotUrl = data?.path ? data.path : '';
      }
      // 2. Insert payment request/order into Supabase
      const { formData, cartItems, total } = checkoutData;
      const { utr, app, notes } = paymentData;
      const { error: insertError, data: insertedOrder } = await supabase.from('orders').insert([
        {
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          items: cartItems,
          total_amount: total,
          payment_method: 'online',
          payment_status: 'pending',
          status: 'pending',
          payment_utr: utr,
          payment_app: app,
          payment_screenshot: screenshotUrl,
          notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          simple_user_id: user?.id || null, // <-- Ensure user id is set
        }
      ]).select().single();
      if (insertError) throw new Error(insertError.message);
      // 3. Send payment pending email to user
      await fetch('/api/email/order-payment-pending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: insertedOrder.id,
          customerName: insertedOrder.customer_name,
          customerEmail: insertedOrder.customer_email,
          payment_screenshot: insertedOrder.payment_screenshot
        })
      });
      setSuccess(true);
      router.push(`/payment/receipt/${insertedOrder.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to submit payment details.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/9769432565?text=${encodeURIComponent('I have completed my payment. Here are my details: UTR/Txn ID: ' + paymentData.utr + ', App: ' + paymentData.app + ', Name: ' + (checkoutData.formData.name || ''))}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 py-12">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader>
          <CardTitle>Pay Online via QR Code</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="text-center py-12">
              <div className="text-2xl font-bold text-green-600 mb-4">Payment Details Submitted!</div>
              <div className="mb-4">Your payment request is pending admin approval. You will see the status in your profile/orders soon.</div>
              <Button asChild className="bg-green-500 hover:bg-green-600 text-white">
                <a href="/profile">Go to Profile</a>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <Image src="/QR.jpeg" alt="Payment QR" width={220} height={220} className="rounded-lg border shadow" />
                <div className="mt-2 text-sm text-gray-600">Scan to pay. UPI/Bank apps supported.</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="utr">Transaction/UTR Number *</Label>
                  <Input id="utr" name="utr" value={paymentData.utr} onChange={handleInputChange} required />
                </div>
                <div>
                  <Label htmlFor="app">Payment App *</Label>
                  <Input id="app" name="app" value={paymentData.app} onChange={handleInputChange} placeholder="e.g. GPay, PhonePe, Paytm, Bank" required />
                </div>
              </div>
              <div>
                <Label htmlFor="screenshot">Upload Payment Screenshot *</Label>
                <Input id="screenshot" name="screenshot" type="file" accept="image/*" onChange={handleFileChange} required />
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea id="notes" name="notes" value={paymentData.notes} onChange={handleInputChange} placeholder="Any additional info..." />
              </div>
              {error && <div className="text-red-600 text-sm">{error}</div>}
              <div className="flex flex-col md:flex-row gap-4 mt-4">
                <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Payment Details'}
                </Button>
                <Button asChild variant="outline">
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">Send Details on WhatsApp</a>
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 