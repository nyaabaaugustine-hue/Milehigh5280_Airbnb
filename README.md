# 🏛️ Milehigh5280 Airbnb

**World-class luxury property rental website for Ghana — built with Next.js 14, Tailwind CSS, and TypeScript.**

---

## ⚡ Quick Start

### 1. Install dependencies

```bash
cd C:\Users\TGNE\Desktop\bnb
npm install
```

### 2. Set up environment variables

```bash
copy .env.local.example .env.local
# Then edit .env.local with your real API keys
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — your luxury website is live.

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (Navbar, Footer, WhatsApp)
│   ├── page.tsx                # Homepage (Hero, Properties, Testimonials)
│   ├── globals.css             # Design system & global styles
│   ├── not-found.tsx           # 404 page
│   ├── properties/
│   │   ├── page.tsx            # All properties listing
│   │   └── [id]/page.tsx       # Single property detail
│   ├── booking/page.tsx        # Multi-step booking flow
│   ├── about/page.tsx          # Brand story, team, values
│   └── contact/page.tsx        # Concierge form, WhatsApp, FAQs
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Fixed nav with scroll transparency
│   │   └── Footer.tsx          # Full footer with links + CTA
│   ├── home/
│   │   ├── Hero.tsx            # Full-screen cinematic hero
│   │   ├── FeaturedProperties.tsx
│   │   ├── Testimonials.tsx    # Auto-rotating reviews
│   │   └── Experience.tsx      # The Luxe Difference section
│   ├── property/
│   │   ├── PropertyGallery.tsx # Mosaic grid + lightbox
│   │   └── BookingWidget.tsx   # Sticky booking sidebar
│   └── ui/
│       └── WhatsAppButton.tsx  # Floating WhatsApp FAB
│
├── lib/
│   ├── data.ts                 # Property data + helpers
│   └── utils.ts                # cn(), formatDate(), etc.
│
└── types/
    └── index.ts                # TypeScript interfaces
```

---

## 🎨 Design System

| Token        | Value              |
| ------------ | ------------------ |
| Primary Gold | `#C9963A`          |
| Background   | `#080808`          |
| Surface      | `#111111`          |
| Text Primary | `#F5F0E8`          |
| Text Muted   | `#888888`          |
| Font Serif   | Cormorant Garamond |
| Font Sans    | DM Sans            |

---

## 💳 Payment Integration

### Paystack (Ghana / Africa)

1. Create account at [paystack.com](https://paystack.com)
2. Get your public/secret keys
3. Add to `.env.local`
4. Install: `npm install @paystack/inline-js`
5. Replace placeholder in `src/app/booking/page.tsx → handlePayment()`

### Stripe (International)

1. Create account at [stripe.com](https://stripe.com)
2. Get your keys
3. Install: `npm install @stripe/stripe-js @stripe/react-stripe-js`
4. Replace placeholder payment handler

---

## 📱 Key Features Built

- ✅ **Cinematic hero** with rotating headlines + entrance animations
- ✅ **Property gallery** with mosaic grid + full lightbox + thumbnail strip
- ✅ **Booking widget** — dates, guests, price calculator, currency toggle
- ✅ **Multi-step booking flow** — Details → Review → Payment → Confirmation
- ✅ **WhatsApp FAB** — floating chat button with popup bubble
- ✅ **Concierge contact page** — form + FAQ accordion + map
- ✅ **About page** — brand story, timeline, team, values, stats
- ✅ **Dark luxury design** — grain overlay, gold accents, serif typography
- ✅ **USD/GHS currency switching**
- ✅ **Mobile-first responsive** — every page
- ✅ **SEO metadata** — title templates, OpenGraph, Twitter cards
- ✅ **Scroll-triggered animations** — IntersectionObserver fade-ups
- ✅ **404 page** — branded, on-design
- ✅ **4 full property listings** with real descriptions, amenities, reviews

---

## 🚀 Deployment (Vercel — Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# vercel.com/your-team/luxe-ghana-stays/settings/environment-variables
```

---

## 🔧 Adding New Properties

Edit `src/lib/data.ts` → add a new object to the `properties` array following the `Property` interface in `src/types/index.ts`.

---

## 📞 Support

For questions about this codebase, contact your development team.
WhatsApp: configured in `.env.local` → `NEXT_PUBLIC_WHATSAPP_NUMBER`
