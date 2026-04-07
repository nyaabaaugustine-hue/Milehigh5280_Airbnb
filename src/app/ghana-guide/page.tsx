import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AudioPlayer from '../../../AudioPlayer';

export const metadata: Metadata = {
  title: 'Ghana Visitor Guide — Visa, Safety & Travel Tips | Milehigh5280',
  description: 'Everything you need to know before visiting Ghana. Visa requirements, safety tips, airport transfers, recommended tours, currency, accessibility, and more.',
  openGraph: {
    title: 'Ghana Visitor Guide | Milehigh5280 · Ayi Mensah',
    description: 'Your complete guide to visiting Ghana — from e-Visa to Ayi Mensah.',
    images: [{ url: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg' }],
  },
};

// ─── Data ────────────────────────────────────────────────────────────────────

const visaInfo = [
  { flag: '🌍', title: 'African Union Citizens', detail: 'Most AU countries enjoy visa-on-arrival or visa-free entry. Check your country at the Ghana Immigration Service website.' },
  { flag: '🇺🇸', title: 'USA / Canada / UK / EU', detail: 'Obtain a Ghana e-Visa online before travel at evisa.ghana.gov.gh. Processing takes 3–5 business days. Single-entry 30-day visa costs approx. $100.' },
  { flag: '✈️', title: 'Visa on Arrival', detail: 'Some nationalities qualify for a 30-day visa on arrival at Kotoka International Airport (KIA). Fee: ~$150 USD payable in cash or card.' },
  { flag: '📄', title: 'Required Documents', detail: 'Valid passport (6+ months), return flight, proof of accommodation (your Milehigh5280 booking confirmation works), yellow fever vaccination certificate.' },
];

const safetyTips = [
  { icon: '🏥', title: 'Nearest Hospital', detail: 'Millennium Medical Centre — 12 min from Milehigh5280. Emergency: 999 (Ghana Police) / 112 (National Emergency).' },
  { icon: '💊', title: 'Health Precautions', detail: 'Yellow fever vaccination required. Malaria prophylaxis strongly recommended. Pack insect repellent. Drink bottled or filtered water only.' },
  { icon: '💰', title: 'Currency & ATMs', detail: 'Ghana Cedi (GHS). USD widely accepted at hotels. ATMs available at all major banks. Avoid unlicensed money changers.' },
  { icon: '📱', title: 'SIM Cards', detail: 'Pick up an MTN, Vodafone, or AirtelTigo SIM at the airport. Bring your passport. Data is affordable (~GHS 30 for 5GB).' },
  { icon: '🔌', title: 'Power Adapters', detail: 'Ghana uses Type G (British 3-pin) plugs at 230V/50Hz. Bring an adapter. The apartment has a backup generator for uninterrupted power.' },
  { icon: '🚗', title: 'Getting Around', detail: 'Use Uber or Bolt — both available in Accra. Trotros (minibuses) are cheap but complex for visitors. Taxis always negotiate fare first.' },
];

const tourOperators = [
  {
    name: 'Accra City Tour',
    duration: 'Full Day',
    highlights: 'Independence Square, Kwame Nkrumah Memorial, Makola Market, Osu Castle',
    price: 'From $45/person',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775558863/pmn_v6crrg.jpg',
  },
  {
    name: 'Cape Coast & Elmina Castle',
    duration: '2 Days',
    highlights: 'Elmina Slave Castle (UNESCO), Kakum Canopy Walk, Cape Coast Fishing Harbour',
    price: 'From $120/person',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775558720/ad_oujvyz.jpg',
  },
  {
    name: 'Kumasi & Ashanti Kingdom',
    duration: '2 Days',
    highlights: 'Manhyia Palace, Kejetia Market (largest in W. Africa), Kente weaving villages',
    price: 'From $110/person',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775558720/ubn_d0iz5b.jpg',
  },
  {
    name: 'Boti Falls Day Trip',
    duration: 'Half Day',
    highlights: 'Twin waterfalls 45 min from Ayi Mensah, jungle hiking, swimming hole',
    price: 'From $35/person',
    image: 'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775558950/4722_Boti-Yaw-Pare_ej9nuw.jpg',
  },
];

const languages = [
  { lang: 'English', note: 'Official language — widely spoken everywhere' },
  { lang: 'Twi / Akan', note: 'Most widely spoken local language. "Akwaaba" = Welcome!' },
  { lang: 'Ga', note: 'Spoken in Greater Accra region' },
  { lang: 'Ewe', note: 'Spoken in Volta Region' },
  { lang: 'French', note: 'Useful for travel to neighbouring Côte d\'Ivoire, Togo, Burkina Faso' },
];

const accessibilityFeatures = [
  'Ground-floor bedroom option available on request',
  'Step-free access from parking to main entrance',
  'Grab bars available in bathrooms on request',
  'Large print property guide available',
  'Accessible parking space reserved',
  'WhatsApp concierge for real-time mobility assistance',
];

const currencies = [
  { code: 'USD', symbol: '$', rate: '1 USD ≈ GHS 15.80', note: 'Widely accepted' },
  { code: 'GBP', symbol: '£', rate: '1 GBP ≈ GHS 19.80', note: 'Accepted at major hotels' },
  { code: 'EUR', symbol: '€', rate: '1 EUR ≈ GHS 17.20', note: 'Exchange at airport or banks' },
  { code: 'NGN', symbol: '₦', rate: '1 NGN ≈ GHS 0.0097', note: 'Available at forex bureaus' },
  { code: 'XOF', symbol: 'CFA', rate: '1 XOF ≈ GHS 0.026', note: 'West African franc' },
  { code: 'GHS', symbol: '₵', rate: 'Local Currency', note: 'Always best rate in-country' },
];

// ─── Page ────────────────────────────────────────────────────────────────────
export default function GhanaGuidePage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg"
            alt="Ghana - Ayi Mensah"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(8,8,8,0.5) 0%, rgba(8,8,8,0.97) 100%)' }} />
        </div>
        <div className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="flex items-center gap-3 mb-4">
            <p className="section-label">Travel Intelligence</p>
            <Image src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775411320/images_1_kilffq.jpg"
              alt="Ghana Flag" width={22} height={15} className="rounded-sm" unoptimized />
          </div>
          <h1 className="font-serif font-light text-white leading-tight mb-4">
            Your Complete<br />
            <span className="italic text-gold-gradient">Ghana Guide</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-lg leading-relaxed mb-8">
            Everything a first-time or returning visitor needs — from visa applications to hidden waterfalls,
            currency tips to safety essentials. Curated by the Milehigh team.
          </p>
          <div className="flex flex-wrap gap-3">
            {['Visa & Entry', 'Safety & Health', 'Tours & Day Trips', 'Currency', 'Accessibility', 'Booking'].map(label => (
              <a key={label} href={`#${label.toLowerCase().replace(/[^a-z]/g, '-')}`}
                className="btn-ghost text-[0.65rem] py-2.5 px-4">
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-12 py-16 space-y-24">

        {/* ── Airport Transfer (Feature 12) ── */}
        <section id="airport-transfer">
          <p className="section-label mb-3">Arrival Made Easy</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Airport <span className="italic text-gold-gradient">Transfer</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-[var(--border)] p-8 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors duration-300">
              <div className="text-3xl mb-4">✈️</div>
              <h3 className="font-serif text-xl text-white mb-3">From Kotoka International Airport</h3>
              <ul className="space-y-3 text-[var(--text-muted)] text-sm leading-relaxed">
                <li className="flex gap-3"><span className="text-[var(--gold)] shrink-0">◆</span> ~35 min drive from KIA to Milehigh5280 in normal traffic</li>
                <li className="flex gap-3"><span className="text-[var(--gold)] shrink-0">◆</span> Private pickup available — just message us your flight details</li>
                <li className="flex gap-3"><span className="text-[var(--gold)] shrink-0">◆</span> Fare: GHS 250–350 ($16–22) depending on traffic</li>
                <li className="flex gap-3"><span className="text-[var(--gold)] shrink-0">◆</span> Uber & Bolt apps work reliably at KIA exit</li>
                <li className="flex gap-3"><span className="text-[var(--gold)] shrink-0">◆</span> We recommend pre-arranging for late-night arrivals</li>
              </ul>
              <a
                href={`https://wa.me/17207059849?text=Hello%2C%20I%27d%20like%20to%20arrange%20airport%20pickup`}
                target="_blank" rel="noopener noreferrer"
                className="btn-gold mt-6 text-[0.7rem] py-3 inline-flex items-center gap-2"
              >
                Book Airport Pickup
              </a>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Journey Time', value: '~35 min', note: 'Normal traffic' },
                { label: 'Distance', value: '22 km', note: 'Via N1 Highway' },
                { label: 'Uber / Bolt', value: 'GHS 180–280', note: 'Surge may apply' },
                { label: 'Private Transfer', value: 'GHS 300', note: 'Fixed rate, pre-arranged' },
              ].map(({ label, value, note }) => (
                <div key={label} className="border border-[var(--border)] p-5 flex items-center justify-between hover:border-[var(--gold)] transition-colors">
                  <div>
                    <p className="text-[var(--text-subtle)] text-[0.65rem] uppercase tracking-widest">{label}</p>
                    <p className="text-white font-serif text-xl font-light">{value}</p>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs text-right">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Visa & Entry (Feature 31) ── */}
        <section id="visa---entry">
          <p className="section-label mb-3">Before You Fly</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Visa &amp; <span className="italic text-gold-gradient">Entry Requirements</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {visaInfo.map(({ flag, title, detail }) => (
              <div key={title} className="border border-[var(--border)] p-6 hover:border-[var(--gold)] transition-colors duration-300 bg-[var(--surface)]">
                <div className="flex items-start gap-4">
                  <span className="text-2xl shrink-0">{flag}</span>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-2">{title}</h3>
                    <p className="text-[var(--text-muted)] text-sm leading-relaxed">{detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-[rgba(201,150,58,0.07)] border border-[var(--gold)]/30 p-6">
            <p className="text-[var(--gold)] text-sm font-medium mb-2">💡 Pro Tip from Milehigh</p>
            <p className="text-[var(--text-muted)] text-sm leading-relaxed">
              Apply for your e-Visa at least 2 weeks before travel at{' '}
              <a href="https://evisa.ghana.gov.gh" target="_blank" rel="noopener noreferrer"
                className="text-[var(--gold)] hover:underline">evisa.ghana.gov.gh</a>.
              Your Milehigh5280 booking confirmation can serve as your proof of accommodation.
              Download it from your booking email and attach it to the application.
            </p>
          </div>
        </section>

        {/* ── Safety & Health (Feature 28) ── */}
        <section id="safety---health">
          <p className="section-label mb-3">Stay Safe & Healthy</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Safety <span className="italic text-gold-gradient">&amp; Health</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {safetyTips.map(({ icon, title, detail }) => (
              <div key={title} className="border border-[var(--border)] p-6 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors duration-300">
                <span className="text-2xl block mb-3">{icon}</span>
                <h3 className="text-white font-medium text-sm mb-2">{title}</h3>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">{detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 border border-red-900/40 bg-red-950/20 p-6">
            <p className="text-red-400 font-medium text-sm mb-2">🚨 Emergency Contacts (Ghana)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {[
                { service: 'Police', number: '191' },
                { service: 'Ambulance', number: '193' },
                { service: 'Fire Service', number: '192' },
                { service: 'National Emergency', number: '112' },
              ].map(({ service, number }) => (
                <div key={service}>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest">{service}</p>
                  <a href={`tel:${number}`} className="text-white font-bold text-lg hover:text-[var(--gold)] transition-colors">{number}</a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Tour Operators & Day Trips (Feature 34) ── */}
        <section id="tours---day-trips">
          <p className="section-label mb-3">Explore Ghana</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Recommended <span className="italic text-gold-gradient">Day Trips &amp; Tours</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tourOperators.map(tour => (
              <div key={tour.name} className="group border border-[var(--border)] bg-[var(--surface)] overflow-hidden hover:border-[var(--gold)] transition-colors duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image src={tour.image} alt={tour.name} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--obsidian)]/80 to-transparent" />
                  <div className="absolute top-3 right-3 bg-[var(--gold)] text-[var(--obsidian)] text-[0.6rem] font-bold px-2.5 py-1 uppercase tracking-wider">
                    {tour.duration}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-serif text-xl text-white mb-2">{tour.name}</h3>
                  <p className="text-[var(--text-muted)] text-sm leading-relaxed mb-4">{tour.highlights}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--gold)] font-medium text-sm">{tour.price}</span>
                    <a
                      href={`https://wa.me/17207059849?text=Hello%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(tour.name)}%20tour`}
                      target="_blank" rel="noopener noreferrer"
                      className="btn-ghost text-[0.65rem] py-2 px-4"
                    >
                      Book via WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[var(--text-muted)] text-sm mt-6 text-center">
            All tours can be arranged through your Milehigh concierge. Ask us for group rates and custom itineraries.
          </p>
        </section>

        {/* ── Currency (Feature 36) ── */}
        <section id="currency">
          <p className="section-label mb-3">Money Matters</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Currency <span className="italic text-gold-gradient">&amp; Exchange</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {currencies.map(({ code, symbol, rate, note }) => (
              <div key={code} className="border border-[var(--border)] p-4 text-center hover:border-[var(--gold)] transition-colors duration-300">
                <p className="font-serif text-2xl text-white font-light">{symbol}</p>
                <p className="text-[var(--gold)] text-xs font-bold mt-1">{code}</p>
                <p className="text-[var(--text-muted)] text-[0.6rem] mt-2 leading-relaxed">{rate}</p>
                <p className="text-[var(--text-subtle)] text-[0.55rem] mt-1">{note}</p>
              </div>
            ))}
          </div>
          <div className="border border-[var(--border)] p-6 bg-[var(--surface)]">
            <p className="text-white font-medium text-sm mb-3">💳 Payment at Milehigh5280</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['USD Cash', 'GHS Cash', 'Mobile Money (MTN / Vodafone)', 'Paystack (Card / Online)', 'WhatsApp Payment Arrangement', 'Bank Transfer'].map(m => (
                <div key={m} className="flex items-center gap-2 text-[var(--text-muted)] text-sm">
                  <span className="text-[var(--gold)]">✓</span> {m}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Accessibility (Feature 16) ── */}
        <section id="accessibility">
          <p className="section-label mb-3">For Every Traveller</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Accessibility <span className="italic text-gold-gradient">Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
            {accessibilityFeatures.map(feat => (
              <div key={feat} className="flex items-center gap-3 border border-[var(--border)] p-4 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors">
                <span className="text-[var(--gold)] shrink-0">♿</span>
                <p className="text-[var(--text-muted)] text-sm">{feat}</p>
              </div>
            ))}
          </div>
          <p className="text-[var(--text-muted)] text-sm text-center">
            Have specific accessibility needs?{' '}
            <a href="/contact" className="text-[var(--gold)] hover:underline">Contact our concierge</a>
            {' '}and we will make every arrangement for a comfortable stay.
          </p>
        </section>

        {/* ── Languages (Feature 15) ── */}
        <section id="languages">
          <p className="section-label mb-3">Communication</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Languages <span className="italic text-gold-gradient">Spoken</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {languages.map(({ lang, note }) => (
              <div key={lang} className="border border-[var(--border)] p-5 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors">
                <p className="text-white font-medium mb-1">{lang}</p>
                <p className="text-[var(--text-muted)] text-sm">{note}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 bg-[rgba(201,150,58,0.07)] border border-[var(--gold)]/30 p-6">
            <p className="text-white text-sm mb-3 font-medium">🗣️ Useful Twi Phrases for Visitors</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { twi: 'Akwaaba', en: 'Welcome / Hello' },
                { twi: 'Medaase', en: 'Thank you' },
                { twi: 'Ɛte sɛn?', en: 'How are you?' },
                { twi: 'Mepaakyɛw', en: 'Please / Excuse me' },
                { twi: 'Me kɔ Ayi Mensah', en: 'I\'m going to Ayi Mensah' },
                { twi: 'Ɛyɛ', en: 'It\'s fine / OK' },
              ].map(({ twi, en }) => (
                <div key={twi} className="border border-[var(--border)] p-3">
                  <p className="text-[var(--gold)] font-bold text-sm">{twi}</p>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">{en}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Ghana / Diaspora (Feature 17 + 40) ── */}
        <section id="why-ghana">
          <p className="section-label mb-3">Beyond the Obvious</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Why Ghana, <span className="italic text-gold-gradient">Why Now?</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mb-12">
            <div className="space-y-5 text-[var(--text-muted)] leading-relaxed text-[0.95rem]">
              <p>
                Ghana is West Africa&apos;s crown jewel — democratic, English-speaking, safe, and
                staggeringly beautiful. From the red laterite roads of Ayi Mensah to the
                colonial grandeur of Cape Coast, every corner tells a story.
              </p>
              <p>
                For the diaspora and first-time African visitors alike, Accra in 2026 is
                experiencing a cultural renaissance. World-class restaurants, contemporary
                art galleries, and a tech ecosystem rivalling Lagos have transformed the
                city into a must-visit destination.
              </p>
              <p>
                Ayi Mensah itself sits in the lush hills northeast of Accra — cooler, quieter, and
                dramatically greener than the city below. It&apos;s become the address of choice
                for discerning returnees, expats, and international visitors who want the best of
                Ghana without the noise.
              </p>
            </div>
            <div className="relative h-80 overflow-hidden border border-[var(--border)]">
              <Image
                src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380288/1_qwgwqd.png"
                alt="Ayi Mensah - Milehigh5280"
                fill className="object-cover" unoptimized
              />
            </div>
          </div>

          {/* Diaspora Testimonials (Feature 40) */}
          <div>
            <p className="section-label mb-6">Loved by the Diaspora</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                {
                  quote: 'Coming back from London every year and Milehigh5280 makes it feel like home — actually better than home.',
                  name: 'Abena K.', country: '🇬🇧 UK-based Ghanaian', avatar: 'A',
                },
                {
                  quote: 'Finally, a place in Accra that matches what I\'m used to in New York. Clean, modern, and the neighbourhood feels safe.',
                  name: 'Kofi B.', country: '🇺🇸 US-based Ghanaian', avatar: 'K',
                },
                {
                  quote: 'Brought my family from Toronto to rediscover Ghana. The apartment gave us the privacy we needed — would book every year.',
                  name: 'Ama S.', country: '🇨🇦 Canada-based Ghanaian', avatar: 'A',
                },
                {
                  quote: 'As a Nigerian visiting Accra for the first time, Ayi Mensah blew me away. The apartment is stunning and the team was phenomenal.',
                  name: 'Chidi O.', country: '🇳🇬 Nigerian Visitor', avatar: 'C',
                },
              ].map(({ quote, name, country, avatar }) => (
                <div key={name} className="border border-[var(--border)] p-6 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors">
                  <p className="text-[var(--text-muted)] text-sm italic leading-relaxed mb-5">&ldquo;{quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full border border-[var(--gold)]/40 flex items-center justify-center text-[var(--gold)] text-sm font-bold bg-[rgba(201,150,58,0.1)]">
                      {avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{name}</p>
                      <p className="text-[var(--text-muted)] text-xs">{country}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Corporate Travel (Feature 32) ── */}
        <section id="corporate">
          <p className="section-label mb-3">Business Travel</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Corporate &amp; <span className="italic text-gold-gradient">Long-Stay Guests</span>
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="border border-[var(--border)] p-8 bg-[var(--surface)]">
              <h3 className="font-serif text-2xl text-white mb-4">Why Companies Choose Milehigh5280</h3>
              <ul className="space-y-4">
                {[
                  'Full invoicing for corporate accounts and NGOs',
                  'Monthly and quarterly long-stay rates available',
                  'Dedicated concierge for business logistics',
                  'High-speed fibre WiFi suitable for video calls and remote work',
                  'Quiet Ayi Mensah neighbourhood — ideal for focused work',
                  'Airport pickup and vehicle arrangements',
                  'Meeting space arrangements through our network',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--gold)] shrink-0">◆</span>{item}
                  </li>
                ))}
              </ul>
              <a href="/contact" className="btn-gold mt-6 inline-flex text-[0.7rem] py-3">
                Request Corporate Rate
              </a>
            </div>
            <div className="space-y-4">
              <div className="border border-[var(--gold)]/30 bg-[rgba(201,150,58,0.05)] p-6">
                <p className="text-[var(--gold)] font-medium text-sm mb-2">Who We Host</p>
                <p className="text-[var(--text-muted)] text-sm leading-relaxed">
                  NGO staff, diplomats, UN agency workers, multinational executives, journalists on assignment,
                  documentary crews, and visiting academics. Milehigh5280 is a trusted base for professionals
                  working across West Africa.
                </p>
              </div>
              <div className="border border-[var(--border)] p-6">
                <p className="text-white font-medium text-sm mb-3">Corporate Pricing</p>
                <div className="space-y-2">
                  {[
                    { period: '1–2 Weeks', rate: 'Standard nightly rate' },
                    { period: '3–4 Weeks', rate: '10% off nightly rate' },
                    { period: '1–3 Months', rate: 'Monthly flat rate — contact us' },
                    { period: '3+ Months', rate: 'Negotiated long-stay agreement' },
                  ].map(({ period, rate }) => (
                    <div key={period} className="flex justify-between text-sm border-b border-[var(--border)] pb-2">
                      <span className="text-[var(--text-muted)]">{period}</span>
                      <span className="text-white">{rate}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Booking Inquiry ── */}
        <section id="booking" className="scroll-mt-24">
          <p className="section-label mb-3">Plan Your Stays</p>
          <h2 className="font-serif text-4xl font-light text-white mb-8">
            Booking <span className="italic text-gold-gradient">Inquiry</span>
          </h2>
          <div className="max-w-3xl border border-[var(--border)] p-8 lg:p-12 bg-[var(--surface)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--gold)]/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-[var(--gold)]/10 transition-colors" />
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-[var(--text-subtle)] font-bold">Full Name</label>
                <input type="text" placeholder="e.g. Akwasi Prempeh" className="w-full bg-[var(--obsidian)] border border-[var(--border)] p-3 text-white text-sm focus:border-[var(--gold)] outline-none transition-colors rounded-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-[var(--text-subtle)] font-bold">Email Address</label>
                <input type="email" placeholder="name@domain.com" className="w-full bg-[var(--obsidian)] border border-[var(--border)] p-3 text-white text-sm focus:border-[var(--gold)] outline-none transition-colors rounded-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-[var(--text-subtle)] font-bold">Travel Dates</label>
                <input type="text" placeholder="Approx. Month or Dates" className="w-full bg-[var(--obsidian)] border border-[var(--border)] p-3 text-white text-sm focus:border-[var(--gold)] outline-none transition-colors rounded-none" />
              </div>
              <div className="space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-[var(--text-subtle)] font-bold">Inquiry Type</label>
                <select className="w-full bg-[var(--obsidian)] border border-[var(--border)] p-3 text-white text-sm focus:border-[var(--gold)] outline-none transition-colors cursor-pointer rounded-none">
                  <option>Short Stay (1-7 nights)</option>
                  <option>Extended Stay (1 week+)</option>
                  <option>Corporate / Group Booking</option>
                  <option>Tour Only Inquiry</option>
                </select>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[0.65rem] uppercase tracking-widest text-[var(--text-subtle)] font-bold">How can we assist?</label>
                <textarea rows={4} placeholder="Mention any specific tours, airport transfer needs, or property preferences..." className="w-full bg-[var(--obsidian)] border border-[var(--border)] p-3 text-white text-sm focus:border-[var(--gold)] outline-none transition-colors resize-none rounded-none" />
              </div>
              <div className="md:col-span-2 pt-2">
                <button type="submit" className="btn-gold w-full py-4 text-[0.7rem] font-bold tracking-[0.2em] shadow-xl hover:shadow-[var(--gold)]/10 transition-all uppercase">
                  Submit Booking Inquiry
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-[var(--border)] pt-16 text-center">
          <p className="section-label mb-4">Ready to Visit Ghana?</p>
          <h2 className="font-serif text-4xl font-light text-white mb-4">
            Your <span className="italic text-gold-gradient">stay awaits</span>
          </h2>
          <p className="text-[var(--text-muted)] mb-8 max-w-md mx-auto">
            Book Milehigh5280 as your base and let us take care of the rest — from airport pickup to curated tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/properties" className="btn-gold">View Our Properties</Link>
            <Link href="/contact" className="btn-ghost">Talk to Concierge</Link>
          </div>
        </section>

      </div>
      <AudioPlayer />
    </>
  );
}
