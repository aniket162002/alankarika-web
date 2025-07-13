'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus, Trash2, Heart, ArrowLeft, ShoppingBag, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useCart } from '@/components/cart/CartProvider';
import { formatNumber, formatCurrency } from '@/lib/utils/formatNumber';
import type { CartItem } from '@/components/cart/CartProvider';
import { useUser } from '@/hooks/useUser';
import LoginRegisterModal from '@/components/ui/LoginRegisterModal';
import Header from '@/components/ui/Header';

// Sample products data (in real app, this would come from context/state management)
const products = [
  {
    id: 1,
    name: "Rajwada Kundan Necklace",
    description: "Handcrafted Kundan necklace with Meenakari work",
    price: 45000,
    originalPrice: 55000,
    image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Necklaces",
    material: "Kundan"
  },
  {
    id: 2,
    name: "Peacock Meenakari Earrings",
    description: "Traditional peacock design earrings",
    price: 12000,
    originalPrice: 15000,
    image: "https://images.pexels.com/photos/1721934/pexels-photo-1721934.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Earrings",
    material: "Meenakari"
  },
  {
    id: 3,
    name: "Maharani Gold Bangles",
    description: "Set of 6 traditional gold bangles",
    price: 85000,
    originalPrice: 95000,
    image: "https://images.pexels.com/photos/1458688/pexels-photo-1458688.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Bangles",
    material: "Gold"
  }
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  
  const { cartItems: contextCartItems, updateQuantity: contextUpdateQuantity, removeFromCart: contextRemoveFromCart } = useCart();

  // User auth
  const { user, loading } = useUser();
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!user && !loading) setShowAuthModal(true);
    else setShowAuthModal(false);
  }, [user, loading]);

  useEffect(() => {
    setCartItems(contextCartItems as CartItem[]);
  }, [contextCartItems]);

  const updateQuantity = (productId: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    contextUpdateQuantity(Number(productId), Number(newQuantity));
  };

  const removeFromCart = (productId: number | string) => {
    contextRemoveFromCart(Number(productId));
  };

  const applyCoupon = () => {
    const validCoupons: Record<string, { discount: number; type: string }> = {
      'DIWALI25': { discount: 25, type: 'percentage' },
      'WEDDING15': { discount: 15, type: 'percentage' },
      'FIRST500': { discount: 500, type: 'fixed' }
    };

    const coupon = validCoupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({
        code: couponCode.toUpperCase(),
        ...coupon
      });
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  const savings = cartItems.reduce((sum, item) => sum + (((item.originalPrice || 0) - (item.price || 0)) * (item.quantity || 0)), 0);
  
  let discount = 0;
  if (appliedCoupon) {
    discount = appliedCoupon.type === 'percentage' 
      ? (subtotal * appliedCoupon.discount) / 100
      : appliedCoupon.discount;
  }

  const total = subtotal - discount;

  // Loading state
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

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

      {/* Show checkout if requested and user is logged in */}
      {showCheckout && user && (
        <CheckoutForm
          cartItems={cartItems}
          total={total}
          onBack={() => setShowCheckout(false)}
          onSuccess={() => {
            setCartItems([]);
            localStorage.removeItem('alankaarika-cart');
            window.location.href = '/payment-success';
          }}
        />
      )}

      {/* Main cart UI, only if user is logged in and not in checkout */}
      {!showCheckout && user && (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
          <Header />
          {cartItems.length === 0 ? (
                <motion.div
                  className="text-center py-16"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
                  <p className="text-gray-600 mb-8">Discover our beautiful jewelry collections and add items to your cart.</p>
                  <Button asChild size="lg" className="bg-gradient-to-r from-amber-600 to-orange-600">
                    <Link href="/shop">Continue Shopping</Link>
                  </Button>
                </motion.div>
              ) : (
                <div className="container mx-auto px-2 sm:px-4 py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                      {cartItems.map((item, index) => {
                        let imageSrc = item.image_url && item.image_url.trim() !== '' ? item.image_url : (item.image || '/alankarika-logo.png');
                        imageSrc = imageSrc.replace(/([^:]\/)\/+/, '$1');
                        return (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                          >
                            <Card>
                              <CardContent className="p-6">
                                <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                                  <Image
                                    src={imageSrc}
                                    alt={item.name}
                                    width={96}
                                    height={96}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg"
                                    onError={(e) => { (e.target as HTMLImageElement).src = '/alankarika-logo.png'; }}
                                  />
                                  <div className="flex-1">
                                    <h3 className="font-semibold text-lg text-gray-900 mb-1">{item.name}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                                    <div className="flex items-center gap-2 mb-3">
                                      <Badge variant="outline">{item.category}</Badge>
                                      <Badge variant="outline">{item.material}</Badge>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl font-bold text-green-600">{formatCurrency(item.price)}</span>
                                      <span className="text-sm text-gray-400 line-through">{formatCurrency(item.originalPrice || 0)}</span>
                                      <Badge className="bg-green-100 text-green-800">
                                        {item.originalPrice && item.price ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0}% OFF
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center gap-4">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}
                                      >
                                        <Minus className="w-4 h-4" />
                                      </Button>
                                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}
                                      >
                                        <Plus className="w-4 h-4" />
                                      </Button>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button variant="outline" size="icon">
                                        <Heart className="w-4 h-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => removeFromCart(item.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>
                    {/* Order Summary */}
                    <motion.div className="space-y-6 w-full" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                      <Card>
                        <CardHeader>
                          <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex justify-between">
                            <span>Subtotal ({cartItems.length} items):</span>
                            <span>{formatCurrency(subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-green-600">
                            <span>You Save:</span>
                            <span>-{formatCurrency(savings)}</span>
                          </div>
                          {appliedCoupon && (
                            <div className="flex justify-between text-green-600">
                              <span>Coupon ({appliedCoupon.code}):</span>
                              <div className="flex items-center gap-2">
                                <span>-{formatCurrency(discount)}</span>
                                <Button variant="ghost" size="sm" onClick={removeCoupon}>
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {/* Delivery charge removed */}
                          <Separator />
                          <div className="flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                          </div>
                        </CardContent>
                      </Card>
                      {/* Checkout Button */}
                      <Button size="lg" className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700" onClick={() => setShowCheckout(true)}>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Proceed to Checkout
                      </Button>
                      {/* Continue Shopping */}
                      <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link href="/shop">Continue Shopping</Link>
                      </Button>
                    </motion.div>
                  </div>
                </div>
              )}
        </div>
      )}
    </>
  );
}