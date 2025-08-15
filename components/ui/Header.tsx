import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/components/cart/CartProvider';
import { useUser } from '@/hooks/useUser';
import { ShoppingCart, User as UserIcon, Menu, X } from 'lucide-react';
import { Badge } from './badge';
import { Button } from './button';

const NAV_LINKS = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Shop', href: '/shop' },
  { name: 'Contact', href: '/contact' },
];
const AUTH_LINKS = [
  { name: 'Custom Builder', href: '/custom-builder' },
  { name: 'Gift Finder Quiz', href: '/gift-quiz' },
];

export default function Header() {
  const { cartItems } = useCart();
  const { user } = useUser();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <header
      className={`fixed top-0 left-0 z-[9999] w-full bg-white shadow-md transition-shadow duration-300 ${isScrolled ? 'shadow-lg' : ''}`}
      style={{ position: 'fixed', top: 0, left: 0, width: '100%' }}
    >
      <div className="w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between min-h-[80px] flex-nowrap">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 min-w-fit">
          <Image src="/alankarika-logo.png" alt="Alankarika Logo" width={56} height={56} className="rounded-full shadow-md" />
          <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent select-none">अलंकारिका</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center gap-x-8 items-center flex-nowrap">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-2 py-1 text-lg font-medium text-gray-800 hover:text-amber-600 transition-colors duration-200 focus:outline-none"
            >
              <span className="z-10 relative">{link.name}</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
          ))}
          {user && AUTH_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="relative px-2 py-1 text-lg font-semibold text-amber-700 hover:text-amber-600 transition-colors duration-200 focus:outline-none"
            >
              <span className="z-10 relative">{link.name}</span>
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-gradient-to-r from-amber-600 to-orange-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            </Link>
          ))}
        </nav>

        {/* Cart/Profile */}
        <div className="flex items-center gap-4 min-w-fit">
          <Link href="/cart" className="relative group">
            <ShoppingCart className="w-7 h-7 text-gray-700 group-hover:text-amber-600 transition-colors" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                {cartItems.length}
              </Badge>
            )}
          </Link>
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="group" aria-label="Profile">
                <UserIcon className="w-7 h-7 text-gray-700 group-hover:text-amber-600 transition-colors" />
              </button>
              {/* Dropdown menu on hover */}
              {user && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-orange-100 rounded-lg shadow-lg z-50 opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity duration-200">
                  <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">My Profile</Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">Order History</Link>
                  <Link href="/shipping-tracking" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">Shipping Tracking</Link>
                </div>
              )}
              {!user && (
                <Link href="/login" className="absolute right-0 mt-2 w-48 block px-4 py-2 text-gray-800 bg-white border border-orange-100 rounded-lg shadow-lg z-50 hover:bg-amber-50"></Link>
              )}
            </div>
            {/* Remove direct profile link in mobile, add dropdown links below */}
        </div>

        {/* Mobile Hamburger */}
        <Button variant="ghost" size="icon" className="md:hidden ml-2" onClick={() => setMobileMenuOpen((v) => !v)} aria-label="Open menu">
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div ref={mobileMenuRef} className="md:hidden fixed inset-0 bg-white shadow-lg border-t z-[9999] animate-fade-in">
          <nav className="flex flex-col gap-2 py-4 px-6">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-lg font-medium text-gray-800 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user && AUTH_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-lg font-semibold text-amber-700 hover:text-amber-600 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex gap-4 mt-4">
              <Link href="/cart" className="relative group">
                <ShoppingCart className="w-7 h-7 text-gray-700 group-hover:text-amber-600 transition-colors" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    {cartItems.length}
                  </Badge>
                )}
              </Link>
                {user && (
                  <>
                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">My Profile</Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">Order History</Link>
                    <Link href="/shipping-tracking" className="block px-4 py-2 text-gray-800 hover:bg-amber-50">Shipping Tracking</Link>
                  </>
                )}
                {!user && (
                  <Link href="/login" className="block px-4 py-2 text-gray-800 hover:bg-amber-50"></Link>
                )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
} 