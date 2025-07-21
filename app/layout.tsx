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
        <meta property="og:image" content="https://alankarika-web.vercel.app/alankarika-logo.png" />
        <meta property="og:url" content="https://alankarika-web.vercel.app/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="अलंकारिका | Where Tradition Meets Elegance" />
        <meta name="twitter:description" content="Exquisite jewelry where tradition meets elegance. Shop our exclusive collections of Kundan, Meenakari, Gold, and more." />
        <meta name="twitter:image" content="https://alankarika-web.vercel.app/alankarika-logo.png" />
        <meta name="robots" content="index, follow" />
        <link rel="sitemap" type="application/xml" href="https://alankarika-web.vercel.app/sitemap.xml" />
        {/* Google Search Console Verification */}
        <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* JSON-LD Structured Data: Organization */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'अलंकारिका',
          url: 'https://alankarika-web.vercel.app/',
          logo: 'https://alankarika-web.vercel.app/alankarika-logo.png',
          sameAs: [
            'https://www.instagram.com/alankarikaa',
            'https://www.facebook.com/alankarikaa',
            'mailto:alankarikaa@gmail.com'
          ],
          contactPoint: [{
            '@type': 'ContactPoint',
            email: 'alankarikaa@gmail.com',
            contactType: 'customer support',
            telephone: '+91 9167261572',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi', 'Marathi']
          }]
        })}} />
        {/* JSON-LD Structured Data: Breadcrumbs (example for homepage) */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://alankarika-web.vercel.app/'
            }
          ]
        })}} />
        {/* Google Analytics (replace with your GA4 ID) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-XXXXXXXXXX');
        `}} />
      </Head>
      <html lang="en" aria-label="Alankaarika Jewelry Store" data-theme="light">
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
