import './globals.css';
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { Providers } from './providers';
import Head from 'next/head';
import localFont from 'next/font/local';
import dynamic from 'next/dynamic';
const FloatingChat = dynamic(() => import('./components/ui/FloatingChat'), { ssr: false });

const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2',
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
        <link rel="icon" href="/favicon2.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon_io/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon_io/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon_io/favicon-16x16.png" />
        <link rel="manifest" href="/favicon_io/site.webmanifest" />
        <link rel="canonical" href="https://alankarika-web.vercel.app/" />
        {/* Open Graph */}
        <meta property="og:title" content="अलंकारिका | Where Tradition Meets Elegance" />
        <meta property="og:description" content="Exquisite jewelry where tradition meets elegance. Shop our exclusive collections of Kundan, Meenakari, Gold, and more." />
        <meta property="og:image" content="/alankarika-logo.png" />
        <meta property="og:url" content="https://alankarika-web.vercel.app/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="अलंकारिका | Where Tradition Meets Elegance" />
        <meta name="twitter:description" content="Exquisite jewelry where tradition meets elegance. Shop our exclusive collections of Kundan, Meenakari, Gold, and more." />
        <meta name="twitter:image" content="/alankarika-logo.png" />
      </Head>
      <html lang="en">
        <body className={`${inter.variable} ${playfair.variable} font-sans`}>
          <Providers>
            {children}
          </Providers>
        </body>
        <FloatingChat />
      </html>
    </>
  );
}
