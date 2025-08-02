import { Playfair_Display } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
  variable: '--font-inter',
  preload: true,
  display: 'swap',
});

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});
