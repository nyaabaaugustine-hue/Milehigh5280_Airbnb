import type { Metadata } from 'next';
import { DM_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import Footer from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import ClientShell from '@/components/layout/ClientShell';
import SiteLoader from '@/components/ui/SiteLoader';
import SocialSidebar from '@/components/ui/SocialSidebar';
import GhanaTourAd from '@/components/ui/GhanaTourAd';
import { CookieConsent, NewsletterSignup, SocialProofTicker } from '@/components/ui/SmartWidgets';

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
    default: 'The Palm 🌴 — Luxury Private Apartment · Ayi Mensah, Accra',
    template: '%s | The Palm · Ayi Mensah',
  },
  description:
    'Book The Palm, a beautiful private apartment in the serene Ayi Mensah area of Accra. Managed by Milehigh Properties — offering comfort, privacy, and premium hospitality.',
  keywords: [
    'luxury apartment Ghana', 'Ayi Mensah accommodation', 'Accra short stay',
    'Milehigh Properties', 'The Palm Ayi Mensah', 'private apartment Accra',
    'Ghana holiday rental', 'airbnb Accra', 'serviced apartment Ghana',
  ],
  authors: [{ name: 'Milehigh Properties' }],
  creator: 'Milehigh Properties',
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://thepalmayimensah.com',
    siteName: 'The Palm · Ayi Mensah',
    title: 'The Palm 🌴 — Luxury Private Apartment · Ayi Mensah, Accra',
    description: 'A beautifully furnished private apartment in the tranquil Ayi Mensah area of Accra, managed by Milehigh Properties.',
    images: [{
      url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
      width: 1200, height: 630,
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Palm 🌴 · Ayi Mensah',
    description: 'A luxury private apartment in Ayi Mensah, Accra — by Milehigh Properties.',
    images: ['https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg'],
  },
  icons: {
    icon: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
    shortcut: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
    apple: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg',
    },
  },
  robots: { index: true, follow: true },
  metadataBase: new URL('https://thepalmayimensah.com'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'Milehigh5280 by Milehigh Properties',
    url: 'https://thepalmayimensah.com',
    telephone: '+17207059849',
    email: 'herbertprempeh@gmail.com',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg',
    description: 'Luxury private apartment in Ayi Mensah, Accra, Ghana. Managed by Milehigh Properties.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Ayi Mensah',
      addressLocality: 'Accra',
      addressRegion: 'Greater Accra',
      addressCountry: 'GH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 5.792905,
      longitude: -0.181711,
    },
    priceRange: '$',
    sameAs: [
      'https://www.airbnb.com',
    ],
  };

  return (
    <html lang="en" data-theme="dark" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
      </head>
      <body className="text-[var(--text-primary)] font-sans antialiased overflow-x-hidden">
        <div className="grain-overlay" aria-hidden="true" />
        <SiteLoader />
        <SocialSidebar />
        <GhanaTourAd />
        <SocialProofTicker />
        <ClientShell>
          {children}
        </ClientShell>
        <Footer />
        <CookieConsent />
        <NewsletterSignup />
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
