"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Download, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatCurrency } from "@/lib/utils/formatNumber";
import Header from "@/components/ui/Header";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PaymentReceiptPage() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  // Helper to check if all images in the PDF content are loaded
  const checkImagesLoaded = useCallback(() => {
    if (!pdfRef.current) return;
    const images = pdfRef.current.querySelectorAll('img');
    if (images.length === 0) {
      setImagesLoaded(true);
      return;
    }
    let loaded = 0;
    images.forEach((img) => {
      if (img.complete) loaded++;
      else {
        img.onload = () => {
          loaded++;
          if (loaded === images.length) setImagesLoaded(true);
        };
        img.onerror = () => {
          loaded++;
          if (loaded === images.length) setImagesLoaded(true);
        };
      }
    });
    if (loaded === images.length) setImagesLoaded(true);
  }, []);

  // When orderData changes, check if images are loaded
  useEffect(() => {
    setImagesLoaded(false);
    setPdfReady(false);
    if (orderData) {
      setTimeout(() => {
        checkImagesLoaded();
      }, 100); // Give time for images to render
    }
  }, [orderData, checkImagesLoaded]);

  // When images are loaded, set PDF ready
  useEffect(() => {
    if (imagesLoaded) {
      setTimeout(() => setPdfReady(true), 100); // Small delay for safety
    }
  }, [imagesLoaded]);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();
      if (error) throw error;
      setOrderData(data);
    } catch (error) {
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const phoneNumber = "9769432565";
    const message = encodeURIComponent(
      `Hi! I just completed my payment for Order ID: ${orderData?.id}. Can you provide me with the order tracking details?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const generatePDF = async () => {
    if (!pdfRef.current || !orderData) return;
    try {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure DOM is ready
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 10;
      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(`Alankaarika-Receipt-${orderData.id}.pdf`);
    } catch (error) {
      alert("Error generating PDF. Please try again.");
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

  // Construct the full Supabase public URL for the screenshot
  const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const paymentScreenshotUrl = orderData?.payment_screenshot
    ? `${supabaseProjectUrl.replace('https://', 'https://')}/storage/v1/object/public/payment_screenshots/${orderData.payment_screenshot}`
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100 py-8 flex flex-col items-center">
      <Header />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex flex-col items-center justify-center mb-8"
      >
        <div className="relative">
          <span className="absolute -top-4 -left-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </span>
          <Image
            src="/alankarika-logo.png"
            alt="Alankaarika Logo"
            width={80}
            height={80}
            className="rounded-full border-4 border-amber-300 shadow-lg bg-white"
          />
        </div>
        <h1 className="text-3xl font-bold text-amber-700 mt-4 mb-2">Thank You for Your Payment!</h1>
        <p className="text-lg text-gray-700 mb-2">Your payment is <span className="font-semibold text-orange-600">pending admin approval</span>.</p>
        <Badge className="bg-yellow-100 text-yellow-800 px-4 py-2 text-base mb-2">Order ID: {orderData.id}</Badge>
        <p className="text-sm text-gray-500">You will receive a confirmation soon. For queries, contact us on WhatsApp.</p>
      </motion.div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 mb-8" id="receipt-content">
        <div className="flex flex-col md:flex-row md:justify-between mb-4">
          <div>
            <div className="font-semibold text-lg text-amber-700 mb-1">Order Summary</div>
            <div className="text-gray-700">{orderData.customer_name}</div>
            <div className="text-gray-500 text-sm">{orderData.customer_email}</div>
            <div className="text-gray-500 text-sm">{orderData.customer_phone}</div>
            <div className="text-gray-500 text-sm">{orderData.customer_address}</div>
          </div>
          <div className="text-right mt-4 md:mt-0">
            <div className="font-semibold text-lg text-amber-700 mb-1">Payment Details</div>
            <div className="text-gray-700">Method: <span className="font-medium">Online (QR)</span></div>
            <div className="text-gray-700">Status: <span className="font-medium text-orange-600">Pending Approval</span></div>
            <div className="text-gray-700">Amount: <span className="font-bold">{formatCurrency(orderData.total_amount)}</span></div>
            {orderData.payment_utr && <div className="text-gray-700">UTR/Txn ID: <span className="font-mono">{orderData.payment_utr}</span></div>}
            {orderData.payment_app && <div className="text-gray-700">App: <span className="font-mono">{orderData.payment_app}</span></div>}
            {paymentScreenshotUrl && (
              <div className="mt-2">
                <span className="text-gray-700">Screenshot:</span>
                <a href={paymentScreenshotUrl} target="_blank" rel="noopener noreferrer">
                  <img src={paymentScreenshotUrl} alt="Payment Screenshot" className="w-24 h-24 object-cover rounded border mt-1" />
                </a>
              </div>
            )}
          </div>
        </div>
        <div className="border-t border-dashed border-amber-200 my-4"></div>
        <div>
          <div className="font-semibold text-lg text-amber-700 mb-2">Items</div>
          <ul className="space-y-2">
            {orderData.items?.map((item: any, idx: number) => (
              <li key={idx} className="flex justify-between items-center">
                <span className="text-gray-700">{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                <span className="font-medium">{formatCurrency(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-dashed border-amber-200 my-4"></div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg text-amber-700">Total</span>
          <span className="font-bold text-lg">{formatCurrency(orderData.total_amount)}</span>
        </div>
      </div>
      {/* PDF Receipt Preview (VISIBLE for debugging) */}
      <div
        id="pdf-receipt-content"
        ref={pdfRef}
        style={{
          position: 'relative', // Visible for debugging
          width: 794, // A4 width in px at 72dpi
          height: 1123, // A4 height in px at 72dpi
          margin: '40px auto',
          background: 'linear-gradient(135deg, #fffbe6 0%, #ffe0b2 100%)',
          borderRadius: 24,
          boxShadow: '0 8px 32px rgba(255, 193, 7, 0.15)',
          border: '4px solid #ffb300',
          overflow: 'hidden',
          fontFamily: 'Inter, Arial, sans-serif',
          zIndex: 10,
        }}
      >
        <div style={{ position: 'absolute', top: 32, right: 32, opacity: 0.08, zIndex: 0 }}>
          <img src="/alankarika-logo.png" alt="Logo" style={{ width: 180 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: 48, height: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <img src="/alankarika-logo.png" alt="Alankaarika Logo" style={{ width: 100, borderRadius: 50, border: '4px solid #ffb300', background: '#fff', marginBottom: 12, boxShadow: '0 2px 8px #ffe08255' }} />
            <h1 style={{ color: '#ff9800', fontWeight: 900, fontSize: 36, margin: 0, letterSpacing: 2, textShadow: '0 2px 8px #ffe08255' }}>Alankaarika Receipt</h1>
            <div style={{ color: '#ff9800', fontWeight: 700, fontSize: 18, marginTop: 6 }}>Order ID: {orderData.id}</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
            <div style={{ background: '#fffde7', borderRadius: 16, padding: 24, flex: 1, marginRight: 12, boxShadow: '0 2px 8px #ffe08255' }}>
              <div style={{ fontWeight: 800, color: '#ff9800', fontSize: 20, marginBottom: 8 }}>Order Summary</div>
              <div style={{ color: '#333', fontSize: 16 }}>{orderData.customer_name}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{orderData.customer_email}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{orderData.customer_phone}</div>
              <div style={{ color: '#888', fontSize: 14 }}>{orderData.customer_address}</div>
            </div>
            <div style={{ background: '#fffde7', borderRadius: 16, padding: 24, flex: 1, marginLeft: 12, boxShadow: '0 2px 8px #ffe08255' }}>
              <div style={{ fontWeight: 800, color: '#ff9800', fontSize: 20, marginBottom: 8 }}>Payment Details</div>
              <div style={{ color: '#333', fontSize: 16 }}>Method: <b>Online (QR)</b></div>
              <div style={{ color: '#ff9800', fontWeight: 700 }}>Status: Pending Approval</div>
              <div style={{ color: '#333', fontSize: 16 }}>Amount: <b>{formatCurrency(orderData.total_amount)}</b></div>
              {orderData.payment_utr && <div style={{ color: '#333', fontSize: 16 }}>UTR/Txn ID: <span style={{ fontFamily: 'monospace' }}>{orderData.payment_utr}</span></div>}
              {orderData.payment_app && <div style={{ color: '#333', fontSize: 16 }}>App: <span style={{ fontFamily: 'monospace' }}>{orderData.payment_app}</span></div>}
              {paymentScreenshotUrl && (
                <div style={{ marginTop: 10 }}>
                  <span style={{ color: '#333' }}>Screenshot:</span>
                  <img src={paymentScreenshotUrl} alt="Payment Screenshot" style={{ width: 80, borderRadius: 8, border: '1px solid #ffb300', marginTop: 4 }} />
                </div>
              )}
            </div>
          </div>
          <div style={{ background: '#fffde7', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 2px 8px #ffe08255' }}>
            <div style={{ fontWeight: 800, color: '#ff9800', fontSize: 20, marginBottom: 8 }}>Items</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {orderData.items?.map((item: any, idx: number) => (
                <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ color: '#333', fontWeight: 600 }}>{item.name} <span style={{ color: '#bbb', fontSize: 13 }}>x{item.quantity}</span></span>
                  <span style={{ fontWeight: 700 }}>{formatCurrency(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ background: 'linear-gradient(90deg, #ffb300 0%, #ff9800 100%)', borderRadius: 16, padding: 22, color: '#fff', fontWeight: 900, fontSize: 28, textAlign: 'right', boxShadow: '0 2px 8px #ffe08255', marginBottom: 24 }}>
            Total: {formatCurrency(orderData.total_amount)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 24, color: '#ff9800', fontWeight: 700, fontSize: 18, letterSpacing: 1 }}>
            Thank you for shopping with Alankaarika!<br />For queries, contact us on WhatsApp.
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
        <Button
          onClick={generatePDF}
          className="bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-2"
          disabled={!pdfReady}
        >
          <Download className="w-5 h-5" /> Download PDF Receipt
        </Button>
        <Button onClick={openWhatsApp} variant="outline" className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-600" /> Share on WhatsApp
        </Button>
        <Button asChild variant="secondary">
          <Link href="/shop">
            <CheckCircle className="w-5 h-5 text-amber-600" /> Continue Shopping
          </Link>
        </Button>
      </div>
    </div>
  );
} 