import React from 'react';
import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import localFont from 'next/font/local';
import { Toaster } from '@/components/ui/sonner';
import GoogleAnalytics from './GoogleAnalytics';
import FloatingChatClient from './components/ui/FloatingChatClient';
import { inter, playfair } from './fonts';

export const metadata: Metadata = {
  metadataBase: new URL('https://alankarika.com'),
  title: 'अलंकारिका - Premium Traditional Indian Jewelry Store',
  description: 'Discover exquisite handcrafted traditional Indian jewelry at अलंकारिका. Shop our premium collection of Mangalsutras, Kundan, Meenakari, Gold, and Silver jewelry. Best quality guaranteed with authentic Indian designs.',
  keywords: ['अलंकारिका', 'traditional jewelry', 'indian jewelry', 'mangalsutra', 'kundan jewelry', 'meenakari', 'gold jewelry', 'silver jewelry', 'bridal jewelry', 'festive jewelry', 'handcrafted jewelry'],
  authors: [{ name: 'अलंकारिका' }],
  creator: 'अलंकारिका',
  publisher: 'अलंकारिका',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://alankarika.com',
  },
  openGraph: {
    title: 'अलंकारिका - Premium Traditional Indian Jewelry Store',
    description: 'Discover exquisite handcrafted traditional Indian jewelry at अलंकारिका. Premium collection of authentic designs.',
    url: 'https://alankarika.com',
    siteName: 'अलंकारिका',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/alankarika-logo.png',
        width: 1200,
        height: 630,
        alt: 'अलंकारिका - Premium Indian Jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'अलंकारिका - Premium Traditional Indian Jewelry Store',
    description: 'Discover exquisite handcrafted traditional Indian jewelry at अलंकारिका. Premium collection of authentic designs.',
    images: ['/alankarika-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your Google Search Console verification code
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`} data-theme="light">
      <body className="font-sans">
        <GoogleAnalytics />
        <Providers>
          {children}
          <Toaster />
          <FloatingChatClient />
        </Providers>
      </body>
    </html>
  );
}
