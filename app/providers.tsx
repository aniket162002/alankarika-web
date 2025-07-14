"use client";
import { CartProvider } from '@/components/cart/CartProvider';
import { UserProvider } from '@/hooks/useUser';
import { TooltipProvider } from '@/components/ui/tooltip';
import RouteLoaderProvider from '@/components/ui/RouteLoaderProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <RouteLoaderProvider>
      <TooltipProvider>
        <UserProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </UserProvider>
      </TooltipProvider>
    </RouteLoaderProvider>
  );
} 