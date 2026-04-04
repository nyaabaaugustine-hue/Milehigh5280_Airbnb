import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import ClientShell from '@/components/layout/ClientShell';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Milehigh5280 🌴 — Luxury Private Apartment · Ayi Mensah, Accra',
    template: '%s | Milehigh5280 · Ayi Mensah',
  },
  description:
    'Book Milehigh5280, a beautiful private apartment in the serene Ayi Mensah area of Accra. Managed by Rehoboth Properties — offering comfort, privacy, and premium hospitality.',
  keywords: [
    'luxury apartment Ghana', 'Ayi Mensah accommodation', 'Accra short stay',
    'Rehoboth Properties', 'Milehigh5280 Ayi Mensah', 'private apartment Accra',
    'Ghana holiday rental', 'airbnb Accra', 'serviced apartment Ghana',
  ],
  authors: [{ name: 'Rehoboth Properties' }],
  creator: 'Rehoboth Properties',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://milehigh5280.com',
    siteName: 'Milehigh5280 · Ayi Mensah',
    title: 'Milehigh5280 🌴 — Luxury Private Apartment · Ayi Mensah, Accra',
    description: 'A beautifully furnished private apartment in the tranquil Ayi Mensah area of Accra, managed by Rehoboth Properties.',
    images: [{
      url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
      width: 1200, height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Milehigh5280 🌴 · Ayi Mensah',
    description: 'A luxury private apartment in Ayi Mensah, Accra — by Rehoboth Properties.',
  },
  icons: {
    icon: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
    apple: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://milehigh5280.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="bg-obsidian text-[var(--text-primary)] font-sans antialiased overflow-x-hidden">
        <div className="grain-overlay" aria-hidden="true" />

        <ClientShell>
          {children}
        </ClientShell>

        <Footer />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-2)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}
