'use client';

import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/cart/CartProvider';
import Link from 'next/link';
import React from 'react';

export function CartIcon() {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();
  
  return (
    <Button variant="outline" size="icon" className="relative" asChild>
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
        {cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0">
            {cartCount > 99 ? '99+' : cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  );
}