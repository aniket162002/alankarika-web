'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, MessageCircle, ArrowRight, Download, FileText } from 'lucide-react';
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
    const phoneNumber = "9167261572";
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8">
      <Header />
      <div className="container mx-auto px-2 sm:px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-12 h-12 text-green-600" />
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
            <p className="text-xl text-gray-600">
              Thank you for your purchase from अलंकारिका
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Order Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order ID</p>
                    <p className="font-semibold">{orderData.id}</p>
                  </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold">{orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                    </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount Paid</p>
                    <p className="font-semibold text-green-600">{formatCurrency(orderData.total_amount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-semibold text-xs">{orderData.razorpay_payment_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold">{new Date(orderData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                {/* Customer Details */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Customer Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Name:</p>
                      <p className="font-semibold">{orderData.customer_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email:</p>
                      <p className="font-semibold">{orderData.customer_email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone:</p>
                      <p className="font-semibold">{orderData.customer_phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address:</p>
                      <p className="font-semibold">{orderData.customer_address}</p>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {orderData.items.map((item: any, index: number) => {
                      let imageSrc = item.image && item.image.trim() !== '' ? item.image : '/alankarika-logo.png';
                      return (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                          <Image
                            src={imageSrc}
                            alt={item.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  What&apos;s Next?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Order Confirmation</h3>
                      <p className="text-sm text-gray-600">You&apos;ll receive an email confirmation shortly with your order details.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Processing & Crafting</h3>
                      <p className="text-sm text-gray-600">Our artisans will carefully prepare your jewelry. This may take 2-3 business days.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold">Shipping & Delivery</h3>
                      <p className="text-sm text-gray-600">Your order will be shipped with tracking information. Delivery within 5-7 business days.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <Button
              onClick={generatePDF}
              className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
            <Button
              onClick={openWhatsApp}
              className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Track via WhatsApp
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/">
                <ArrowRight className="w-4 h-4 mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>

          {/* Hidden Receipt for PDF Generation */}
          <div id="receipt-content" style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
            <div className="receipt-container" style={{
              width: '800px',
              padding: '40px',
              backgroundColor: 'white',
              fontFamily: 'Arial, sans-serif'
            }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <img src={typeof window !== 'undefined' ? window.location.origin + '/alankarika-logo.png' : '/alankarika-logo.png'} alt="Alankarika Logo" style={{ width: '80px', height: '80px', margin: '0 auto 10px', display: 'block' }} />
              </div>
              <div style={{
                textAlign: 'center',
                borderBottom: '3px solid #D97706',
                paddingBottom: '30px',
                marginBottom: '30px'
              }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#D97706',
                  marginBottom: '10px'
                }}>
                  अलंकारिका
                </div>
                <div style={{
                  fontSize: '18px',
                  color: '#6B7280',
                  marginBottom: '10px'
                }}>
                  Traditional Jewelry Collection
                </div>
                <div style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#059669',
                  backgroundColor: '#D1FAE5',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  display: 'inline-block'
                }}>
                  PAYMENT RECEIPT
                </div>
              </div>

              {/* Order Information */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '30px',
                marginBottom: '30px'
              }}>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1F2937',
                    marginBottom: '15px',
                    borderBottom: '2px solid #F3F4F6',
                    paddingBottom: '5px'
                  }}>Order Details</h3>
                  <div style={{ lineHeight: '1.8' }}>
                    <div><strong>Order ID:</strong> {orderData.id}</div>
                    <div><strong>Payment ID:</strong> {orderData.razorpay_payment_id}</div>
                    <div><strong>Order Date:</strong> {new Date(orderData.created_at).toLocaleDateString()}</div>
                    <div><strong>Payment Method:</strong> {orderData.payment_method === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</div>
                    <div><strong>Status:</strong> <span style={{ color: '#059669', fontWeight: 'bold' }}>Confirmed</span></div>
                  </div>
                </div>
                <div>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#1F2937',
                    marginBottom: '15px',
                    borderBottom: '2px solid #F3F4F6',
                    paddingBottom: '5px'
                  }}>Customer Details</h3>
                  <div style={{ lineHeight: '1.8' }}>
                    <div><strong>Name:</strong> {orderData.customer_name}</div>
                    <div><strong>Email:</strong> {orderData.customer_email}</div>
                    <div><strong>Phone:</strong> {orderData.customer_phone}</div>
                    <div><strong>Address:</strong> {orderData.customer_address}</div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#1F2937',
                  marginBottom: '15px',
                  borderBottom: '2px solid #F3F4F6',
                  paddingBottom: '5px'
                }}>Order Items</h3>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  border: '1px solid #E5E7EB'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F9FAFB' }}>
                      <th style={{
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        textAlign: 'left',
                        fontWeight: 'bold'
                      }}>Product Name</th>
                      <th style={{
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        textAlign: 'center',
                        fontWeight: 'bold'
                      }}>Quantity</th>
                      <th style={{
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}>Price</th>
                      <th style={{
                        padding: '12px',
                        border: '1px solid #E5E7EB',
                        textAlign: 'right',
                        fontWeight: 'bold'
                      }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderData.items.map((item: any, index: number) => (
                      <tr key={index}>
                        <td style={{
                          padding: '12px',
                          border: '1px solid #E5E7EB'
                        }}>{item.name}</td>
                        <td style={{
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          textAlign: 'center'
                        }}>{item.quantity}</td>
                        <td style={{
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          textAlign: 'right'
                        }}>{formatCurrency(item.price)}</td>
                        <td style={{
                          padding: '12px',
                          border: '1px solid #E5E7EB',
                          textAlign: 'right',
                          fontWeight: 'bold'
                        }}>{formatCurrency(item.price * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total */}
              <div style={{
                backgroundColor: '#F9FAFB',
                padding: '20px',
                borderRadius: '8px',
                border: '2px solid #D97706',
                marginBottom: '30px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#1F2937'
                  }}>Total Amount Paid:</span>
                  <span style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#059669'
                  }}>{formatCurrency(orderData.total_amount)}</span>
                </div>
              </div>

              {/* Footer */}
              <div style={{
                textAlign: 'center',
                paddingTop: '20px',
                borderTop: '2px solid #F3F4F6',
                color: '#6B7280'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Thank you for your purchase from अलंकारिका!</strong>
                </div>
                <div style={{ fontSize: '14px' }}>
                  For any queries, contact us at alankarikaa@gmail.com | +91 9167261572
                </div>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                  This is a computer-generated receipt and does not require a signature.
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-8 p-6 bg-amber-50 rounded-lg"
          >
            <h3 className="font-semibold text-amber-800 mb-2">Share Your Experience!</h3>
            <p className="text-sm text-amber-700 mb-4">
              We&apos;d love to see how our jewelry looks on you. Share your photos with us on social media and get featured on our website!
            </p>
            <div className="flex justify-center gap-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <span className="text-white text-sm">f</span>
              </div>
              <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-pink-700 transition-colors">
                <span className="text-white text-sm">i</span>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                <span className="text-white text-sm">p</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}