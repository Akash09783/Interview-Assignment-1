import type { Metadata } from 'next';
import './globals.css';
import LenisProvider from '@/components/ui/LenisProvider';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import CartDrawer from '@/components/cart/CartDrawer';
import PageLoader from '@/components/ui/PageLoader';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://stembeauty.com'),
  title: 'Beauty In Stem — Korean Formulas Engineered for Ultimate Skin Fitness',
  description:
    'Experience bio-cellular skincare powered by medical-grade PDRN Salmon DNA. Recreating the official Stem Beauty visual experience and interactive WebGL bubble simulation.',
  icons: {
    icon: '/assets/logo.png',
  },
  openGraph: {
    title: 'Beauty In Stem | Ultimate Skin Fitness',
    description: 'Korean formulas engineered for ultimate skin fitness with 3D bubble dynamics.',
    url: 'https://stembeauty.com',
    siteName: 'Stem Beauty',
    images: [
      {
        url: '/assets/skin-bg.jpg',
        width: 1200,
        height: 630,
        alt: 'Beauty in Stem Skin Fitness',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-[#202020] antialiased selection:bg-[#d08c81] selection:text-white">
        {/* Authentic Stem Beauty Reload Intro Loader with 3D Coalescing Bubble & Percentage Counter */}
        <PageLoader />

        <LenisProvider>
          <CartProvider>
            {/* Navigation Header */}
            <Header />

            {/* Slide-out Cart Drawer */}
            <CartDrawer />

            {/* Page Content */}
            <main className="relative min-h-screen">
              {children}
            </main>
          </CartProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
