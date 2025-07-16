'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, MessageCircle, ArrowRight, Download, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatCurrency } from '@/lib/utils/formatNumber';
import Header from '@/components/ui/Header';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface OrderData {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: any[];
  total_amount: number;
  payment_status: string;
  payment_method: string;
  razorpay_payment_id: string;
  created_at: string;
  status: string;
}

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      // First, try to get order data from sessionStorage (most recent)
      const sessionOrderData = sessionStorage.getItem('paymentSuccessOrderData');
      
      if (sessionOrderData) {
        const orderData = JSON.parse(sessionOrderData);
        setOrderData(orderData);
        // Clear session data after use
        sessionStorage.removeItem('paymentSuccessOrderData');
      } else {
        // Fallback to localStorage
        const storedOrderData = localStorage.getItem('lastOrderData');
        
        if (storedOrderData) {
          const parsedOrderData = JSON.parse(storedOrderData);
          if (orderId) {
            parsedOrderData.id = orderId;
          }
          setOrderData(parsedOrderData);
        } else if (orderId && !orderId.startsWith('temp_')) {
          // Try to fetch from database for real orders
          const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();

          if (error) {
            // Fallback to mock data if database fetch fails
            setMockOrderData();
          } else {
            setOrderData(data);
          }
        } else {
          // Fallback to mock data
          setMockOrderData();
        }
      }
    } catch (error) {
      setMockOrderData();
    } finally {
      setLoading(false);
    }
  };

  const setMockOrderData = () => {
    const mockOrderData = {
      id: orderId || 'temp_' + Date.now(),
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      customer_phone: '+91 9876543210',
      customer_address: 'Test Address, Test City, Test State - 123456',
      items: [
        {
          id: 1,
          name: 'Rajwada Kundan Necklace',
          price: 45000,
          quantity: 1,
          image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400'
        }
      ],
      total_amount: 45000,
      payment_status: 'paid',
      payment_method: 'online',
      razorpay_payment_id: 'pay_test_' + Date.now(),
      created_at: new Date().toISOString(),
      status: 'confirmed'
    };
    setOrderData(mockOrderData);
  };

  const openWhatsApp = () => {
    const phoneNumber = "9769432565";
    const message = encodeURIComponent(`Hi! I just completed my payment for Order ID: ${orderData?.id}. Can you provide me with the order tracking details?`);
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const generatePDF = async () => {
    const receiptElement = document.getElementById('receipt-content');
    if (!receiptElement || !orderData) return;

    try {
      const canvas = await html2canvas(receiptElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`Alankaarika-Receipt-${orderData.id}.pdf`);
    } catch (error) {
      alert('Error generating PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 py-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-8">We couldn&apos;t find your order details.</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Add a message or redirect: This page has moved. Please access your receipt from your order or after payment.
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Receipt Page Moved</h2>
        <p className="text-gray-600">Please access your payment receipt from your order details or after submitting payment.</p>
      </div>
    </div>
  );
}