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

// ─── URLs — single source of truth ──────────────────────────────────────────
const SITE_URL   = 'https://thepalmayimensah.com';
// Logo used as the share image so it appears on WhatsApp / iMessage / Slack / X etc.
const LOGO_URL   = 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/logo_xcjkpn.jpg';
// Hero photo used as a secondary OG image (rich previews on desktop)
const HERO_URL   = 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

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
  authors:  [{ name: 'Milehigh Properties' }],
  creator:  'Milehigh Properties',

  // ── Favicon / App Icon (used in browser tab) ────────────────────────────
  icons: {
    icon:             [{ url: LOGO_URL, type: 'image/jpeg' }],
    shortcut:         [{ url: LOGO_URL, type: 'image/jpeg' }],
    apple:            [{ url: LOGO_URL, type: 'image/jpeg' }],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: LOGO_URL },
      { rel: 'mask-icon',                    url: LOGO_URL },
    ],
  },

  // ── Open Graph — controls WhatsApp, iMessage, Telegram, Slack, LinkedIn
  //    Put the LOGO first so it's the thumbnail shown in chat link previews ─
  openGraph: {
    type:        'website',
    locale:      'en_GB',
    url:          SITE_URL,
    siteName:    'The Palm · Ayi Mensah',
    title:       'The Palm 🌴 — Luxury Private Apartment · Ayi Mensah, Accra',
    description: 'A beautifully furnished private apartment in the tranquil Ayi Mensah area of Accra, managed by Milehigh Properties.',
    images: [
      // ① Square logo — renders as thumbnail in WhatsApp / iMessage / Telegram
      {
        url:    LOGO_URL,
        width:  800,
        height: 800,
        alt:    'Milehigh5280 Logo',
      },
      // ② Wide hero — used by Facebook / LinkedIn desktop rich previews
      {
        url:    HERO_URL,
        width:  1200,
        height: 630,
        alt:    'The Palm — Luxury apartment in Ayi Mensah, Accra',
      },
    ],
  },

  // ── Twitter / X card ────────────────────────────────────────────────────
  twitter: {
    card:        'summary',           // 'summary' shows a square thumb (logo) — not large image
    site:        '@milehigh5280',
    creator:     '@milehigh5280',
    title:       'The Palm 🌴 · Ayi Mensah',
    description: 'A luxury private apartment in Ayi Mensah, Accra — by Milehigh Properties.',
    images:      [LOGO_URL],          // square logo as Twitter thumbnail
  },

  robots:    { index: true, follow: true },
  category:  'travel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const siteJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'LodgingBusiness',
    name:        'Milehigh5280 by Milehigh Properties',
    url:          SITE_URL,
    telephone:   '+17207059849',
    email:       'herbertprempeh@gmail.com',
    image:        LOGO_URL,
    description: 'Luxury private apartment in Ayi Mensah, Accra, Ghana. Managed by Milehigh Properties.',
    logo:         LOGO_URL,
    address: {
      '@type':          'PostalAddress',
      streetAddress:    'Ayi Mensah',
      addressLocality:  'Accra',
      addressRegion:    'Greater Accra',
      addressCountry:   'GH',
    },
    geo: {
      '@type':    'GeoCoordinates',
      latitude:    5.792905,
      longitude:  -0.181711,
    },
    priceRange: '$',
    sameAs: ['https://www.airbnb.com'],
  };

  return (
    <html lang="en" data-theme="dark" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* ── Hard-coded favicon tags (belt-and-suspenders for all browsers) ── */}
        <link rel="icon"                     type="image/jpeg" href={LOGO_URL} />
        <link rel="shortcut icon"                              href={LOGO_URL} />
        <link rel="apple-touch-icon"                           href={LOGO_URL} />
        <link rel="apple-touch-icon-precomposed"               href={LOGO_URL} />

        {/* ── Force Open Graph tags (belt-and-suspenders alongside Next metadata) ── */}
        {/* Some crawlers (WhatsApp, Telegram) don't respect Next.js metadata output
            and need raw <meta> tags in the HTML to pick up the image correctly.    */}
        <meta property="og:image"              content={LOGO_URL} />
        <meta property="og:image:width"        content="800" />
        <meta property="og:image:height"       content="800" />
        <meta property="og:image:type"         content="image/jpeg" />
        <meta property="og:image:alt"          content="Milehigh5280 Logo" />
        <meta property="og:site_name"          content="The Palm · Ayi Mensah" />
        <meta property="og:url"                content={SITE_URL} />
        <meta name="twitter:card"              content="summary" />
        <meta name="twitter:image"             content={LOGO_URL} />

        {/* ── WhatsApp / iMessage specific: og:image must be absolute & public ── */}
        <meta property="og:image:secure_url"   content={LOGO_URL} />

        {/* ── Structured data ── */}
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
              color:      'var(--text-primary)',
              border:     '1px solid var(--border)',
              fontFamily: 'var(--font-sans)',
              fontSize:   '0.875rem',
            },
          }}
        />
      </body>
    </html>
  );
}
