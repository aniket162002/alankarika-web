import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/components/cart/CartProvider';
import { UserProvider } from '@/hooks/useUser';
import { TooltipProvider } from '@/components/ui/tooltip';
import Head from 'next/head';
import localFont from 'next/font/local';

const inter = localFont({
  src: [
    {
      path: '/fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
});
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'अलंकारिका - Traditional Jewelry Store',
  description: 'Where Tradition Meets Elegance - Discover exquisite handcrafted jewelry with authentic Indian designs',
  keywords: 'jewelry, traditional, indian, kundan, meenakari, gold, silver, bridal, festive',
  authors: [{ name: 'अलंकारिका' }],
  openGraph: {
    title: 'अलंकारिका - Traditional Jewelry Store',
    description: 'Where Tradition Meets Elegance - Discover exquisite handcrafted jewelry',
    type: 'website',
    locale: 'en_IN',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>अलंकारिका | Where Tradition Meets Elegance</title>
        <meta name="description" content="अलंकारिका - Exquisite jewelry where tradition meets elegance. Shop our exclusive collections of Kundan, Meenakari, Gold, and more." />
        <link rel="icon" href="/alankarika-logo.png" type="image/png" />
        <link rel="canonical" href="https://alankaarika.com/" />
        {/* Open Graph */}
        <meta property="og:title" content="अलंकारिका | Where Tradition Meets Elegance" />
        <meta property="og:description" content="Exquisite jewelry where tradition meets elegance. Shop our exclusive collections of Kundan, Meenakari, Gold, and more." />
        <meta property="og:image" content="/alankarika-logo.png" />
        <meta property="og:url" content="https://alankaarika.com/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="अलंकारिका | Where Tradition Meets Elegance" />
        <meta name="twitter:description" content="Exquisite jewelry where tradition meets elegance. Shop our exclusive collections of Kundan, Meenakari, Gold, and more." />
        <meta name="twitter:image" content="/alankarika-logo.png" />
      </Head>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} font-sans`}>
          <TooltipProvider>
            <UserProvider>
              <CartProvider>
                {children}
              </CartProvider>
            </UserProvider>
          </TooltipProvider>
        </body>
      </html>
    </>
  );
}
