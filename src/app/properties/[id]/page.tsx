import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  Star, MapPin, Users, Bed, Bath, Waves, ChevronRight,
  Wifi, Wind, Shield, Zap, TreePalm, UtensilsCrossed,
  Car, Tv, Coffee, Shirt, Flame, Package, Phone, Quote,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { getPropertyBySlugNeon, getLivePropertiesNeon, getReviewsByPropertyIdNeon } from '@/lib/neon/service';
import BookingWidget from '@/components/property/BookingWidget';
import ComingSoonSignup from '@/components/property/ComingSoonSignup';
import { CONTACT_INFO } from '@/lib/data';

export const revalidate = 60;

// ─── Static Params ─────────────────────────────────────────────────────────
export async function generateStaticParams() {
  try {
    const props = await getLivePropertiesNeon();
    return props.map(p => ({ id: p.slug }));
  } catch {
    return [];
  }
}

// ─── Metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const property = await getPropertyBySlugNeon(id);
  if (!property) return { title: 'Property Not Found' };
  const heroUrl =
    property.images?.hero?.url ||
    property.images?.gallery?.[0]?.url ||
    '';
  return {
    title: `${property.name} — ${property.location.city}, Ghana`,
    description: property.description,
    openGraph: { images: heroUrl ? [{ url: heroUrl }] : [] },
  };
}

// ─── Amenity emoji map ──────────────────────────────────────────────────────
const AMENITY_EMOJI: Record<string, string> = {
  wifi: '📶',
  'air-conditioning': '❄️',
  airconditioning: '❄️',
  security: '🛡️',
  electricity: '⚡',
  generator: '⚡',
  garden: '🌴',
  kitchen: '🍽️',
  parking: '🚗',
  tv: '🎬',
  television: '🎬',
  coffee: '☕',
  washer: '👕',
  laundry: '🧺',
  bbq: '🔥',
  pool: '🏊',
  gym: '🏋️',
  spa: '💆',
  'chef-service': '👨‍🍳',
  chef: '👨‍🍳',
  concierge: '🔔',
  balcony: '🌅',
  terrace: '🌅',
  jacuzzi: '🛁',
  'hot-tub': '🛁',
};

function AmenityChip({ label }: { label: string }) {
  const key = label.toLowerCase().replace(/\s+/g, '-');
  const emoji = AMENITY_EMOJI[key] || AMENITY_EMOJI[key.split('-')[0]] || '✦';
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] hover:bg-[var(--surface-2)] transition-all duration-300 group cursor-default">
      <span className="text-sm leading-none">{emoji}</span>
      <span className="text-[var(--text-muted)] text-sm group-hover:text-white transition-colors capitalize">
        {label.replace(/-/g, ' ')}
      </span>
    </div>
  );
}

// ─── JSON-LD ────────────────────────────────────────────────────────────────
function PropertyJsonLd({ property }: { property: any }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    description: property.description,
    url: `https://thepalmayimensah.com/properties/${property.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.location.city,
      addressRegion: property.location.area,
      addressCountry: 'GH',
    },
    priceRange: `$${property.pricing?.perNight ?? 0}/night`,
    telephone: CONTACT_INFO.phone,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Star Row helper ────────────────────────────────────────────────────────
function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          size={size}
          className={n <= Math.round(rating)
            ? 'fill-[var(--gold)] text-[var(--gold)]'
            : 'text-[var(--border)]'
          }
        />
      ))}
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────
export default async function PropertyPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = await getPropertyBySlugNeon(id);
  if (!property) notFound();

  const [allProperties, reviews] = await Promise.all([
    getLivePropertiesNeon().catch(() => []),
    getReviewsByPropertyIdNeon(property.id).catch(() => []),
  ]);
  const related = allProperties.filter(p => p.slug !== property.slug).slice(0, 3);

  const heroImage =
    property.images?.hero?.url ||
    property.images?.gallery?.[0]?.url ||
    'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg';

  const gallery: Array<{ url: string; alt: string }> = [];
  if (property.images?.hero?.url) {
    gallery.push({ url: property.images.hero.url, alt: property.images.hero.alt || property.name });
  }
  (property.images?.gallery || []).forEach((g: any) => {
    if (g?.url && !gallery.find(x => x.url === g.url)) {
      gallery.push({ url: g.url, alt: g.alt || property.name });
    }
  });

  const amenities: string[] = Array.isArray(property.amenities) ? property.amenities : [];
  const features: string[] = Array.isArray(property.features) ? property.features : [];
  const houseRules: string[] = Array.isArray(property.houseRules) ? property.houseRules : [];

  const perNight = property.pricing?.perNight ?? 0;
  const perNightGHS = property.pricing?.perNightGHS ?? Math.round(perNight * 15.8);

  // ── Reviews summary ──────────────────────────────────────────────────────
  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : property.rating ?? 0;

  return (
    <>
      <PropertyJsonLd property={property} />

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <div className="relative w-full h-[75vh] min-h-[560px] max-h-[820px] overflow-hidden">
        <Image
          src={heroImage}
          alt={property.name}
          fill
          priority
          className="object-cover"
        />
        {/* Layered gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/70 via-[#080808]/20 to-transparent" />

        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="absolute top-28 left-6 lg:left-12 flex items-center gap-2 text-xs text-white/50 z-10"
        >
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <ChevronRight size={11} />
          <Link href="/properties" className="hover:text-[var(--gold)] transition-colors">Properties</Link>
          <ChevronRight size={11} />
          <span className="text-white/80">{property.name}</span>
        </nav>

        {/* Hero text */}
        <div className="absolute bottom-0 left-0 right-0 px-6 lg:px-12 pb-12 z-10 max-w-[1440px] mx-auto">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            {property.isLive === false && (
              <span className="bg-[#080808] text-[var(--gold)] border border-[var(--gold)] text-[0.6rem] uppercase tracking-widest px-3 py-1 font-semibold">
                Coming Soon
              </span>
            )}
            {property.badge && (
              <span className="bg-[var(--gold)] text-[#080808] text-[0.6rem] uppercase tracking-widest px-3 py-1 font-bold">
                {property.badge}
              </span>
            )}
            {property.type && (
              <span className="text-white/60 text-[0.6rem] uppercase tracking-widest border border-white/20 px-3 py-1">
                {property.type}
              </span>
            )}
          </div>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light text-white mb-4 leading-tight">
            {property.name}
          </h1>
          {property.tagline && (
            <p className="font-serif text-xl italic text-[var(--gold)] mb-5">
              {property.tagline}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-5 text-sm">
            <span className="flex items-center gap-1.5 text-white/70">
              <MapPin size={14} className="text-[var(--gold)]" />
              {property.location.city}{property.location.area ? `, ${property.location.area}` : ''}, Ghana
            </span>
            {(property.rating ?? 0) > 0 && (
              <span className="flex items-center gap-1.5">
                <Star size={14} className="fill-[var(--gold)] text-[var(--gold)]" />
                <span className="text-white font-semibold">{property.rating}</span>
                <span className="text-white/50">({property.reviewCount ?? 0} reviews)</span>
              </span>
            )}
            <span className="font-serif text-2xl text-white font-light">
              ${perNight.toLocaleString()}
              <span className="text-white/50 text-sm font-sans"> / night</span>
            </span>
          </div>
        </div>

        {/* Thumbnail strip */}
        {gallery.length > 1 && (
          <div className="absolute bottom-8 right-6 lg:right-12 z-10 hidden sm:flex gap-2">
            {gallery.slice(1, 5).map((img, i) => (
              <div
                key={i}
                className="relative w-18 h-18 lg:w-[72px] lg:h-[72px] overflow-hidden border border-white/20 hover:border-[var(--gold)] transition-colors cursor-pointer"
                style={{ width: 72, height: 72 }}
              >
                <Image src={img.url} alt={img.alt} fill className="object-cover" />
              </div>
            ))}
            {gallery.length > 5 && (
              <div
                className="bg-black/60 border border-white/20 flex items-center justify-center cursor-pointer hover:border-[var(--gold)] transition-colors"
                style={{ width: 72, height: 72 }}
              >
                <span className="text-white text-xs font-medium">+{gallery.length - 5}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
      <div className="px-6 lg:px-12 max-w-[1440px] mx-auto py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 xl:gap-20">

          {/* LEFT COLUMN */}
          <div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-14">
              {[
                { icon: <Users size={20} className="text-[var(--gold)]" />, value: property.capacity?.guests ?? '—', label: 'Guests' },
                { icon: <Bed size={20} className="text-[var(--gold)]" />, value: property.capacity?.bedrooms ?? '—', label: 'Bedrooms' },
                { icon: <Bed size={18} className="text-[var(--gold)]" />, value: property.capacity?.beds ?? '—', label: 'Beds' },
                { icon: <Bath size={20} className="text-[var(--gold)]" />, value: property.capacity?.bathrooms ?? '—', label: 'Bathrooms' },
              ].map(({ icon, value, label }) => (
                <div
                  key={label}
                  className="border border-[var(--border)] p-5 text-center bg-[var(--surface)] hover:border-[var(--gold)] transition-all duration-300 group"
                >
                  <div className="flex justify-center mb-3">{icon}</div>
                  <p className="font-serif text-3xl text-white font-light">{value}</p>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-1 group-hover:text-[var(--gold)] transition-colors">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            {/* About */}
            {(property.longDescription || property.description) && (
              <div className="mb-14 pb-14 border-b border-[var(--border)]">
                <p className="section-label mb-4">About This Property</p>
                <h2 className="font-serif text-3xl lg:text-4xl text-white font-light mb-6 leading-tight">
                  Experience {property.name}
                </h2>
                <div className="space-y-4">
                  {(property.longDescription || property.description)
                    .split('\n\n')
                    .filter(Boolean)
                    .map((para: string, i: number) => (
                      <p key={i} className="text-[var(--text-muted)] leading-relaxed text-[0.95rem]">
                        {para}
                      </p>
                    ))}
                </div>
              </div>
            )}

            {/* Features / Highlights */}
            {features.length > 0 && (
              <div className="mb-14 pb-14 border-b border-[var(--border)]">
                <p className="section-label mb-4">Property Highlights</p>

                {/* Features showcase image */}
                <div className="relative w-full h-56 mb-6 overflow-hidden border border-[var(--border)]">
                  <Image
                    src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775380667/ERR_jjr2hx.jpg"
                    alt={`${property.name} — property highlights`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/60 via-transparent to-transparent" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {features.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 border border-[var(--border)] bg-[var(--surface)] hover:border-[var(--gold)] transition-colors group"
                    >
                      <span className="text-[var(--gold)] shrink-0 mt-0.5 group-hover:scale-110 transition-transform">◆</span>
                      <span className="text-[var(--text-muted)] text-sm leading-relaxed">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Amenities */}
            {amenities.length > 0 && (
              <div className="mb-14 pb-14 border-b border-[var(--border)]">
                <p className="section-label mb-4">Amenities & Services</p>
                <h2 className="font-serif text-2xl text-white font-light mb-6">What&apos;s Included</h2>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((a, i) => (
                    <AmenityChip key={i} label={a} />
                  ))}
                </div>
              </div>
            )}

            {/* House Rules */}
            {houseRules.length > 0 && (
              <div className="mb-14 pb-14 border-b border-[var(--border)]">
                <p className="section-label mb-4">House Rules</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {houseRules.map((rule, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-[var(--text-muted)] py-2.5 border-b border-[var(--border)] last:border-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] shrink-0" />
                      {rule}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Check-in / Check-out */}
            {(property.checkInTime || property.checkOutTime) && (
              <div className="mb-14 pb-14 border-b border-[var(--border)]">
                <p className="section-label mb-4">Check-in & Check-out</p>
                <div className="grid grid-cols-2 gap-4">
                  {property.checkInTime && (
                    <div className="border border-[var(--border)] p-6 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors group">
                      <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-2">Check-in from</p>
                      <p className="font-serif text-2xl text-white font-light">{property.checkInTime}</p>
                    </div>
                  )}
                  {property.checkOutTime && (
                    <div className="border border-[var(--border)] p-6 bg-[var(--surface)] hover:border-[var(--gold)] transition-colors group">
                      <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mb-2">Check-out by</p>
                      <p className="font-serif text-2xl text-white font-light">{property.checkOutTime}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── REVIEWS ─────────────────────────────────────────────── */}
            <div className="mb-14 pb-14 border-b border-[var(--border)]">
              <p className="section-label mb-4">Guest Reviews</p>

              {/* Rating summary */}
              <div className="flex items-center gap-4 mb-8">
                <div className="text-center">
                  <p className="font-serif text-5xl text-white font-light leading-none">
                    {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                  </p>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-1">Overall</p>
                </div>
                <div className="border-l border-[var(--border)] pl-4">
                  <StarRow rating={avgRating} size={18} />
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    {reviews.length > 0
                      ? `${reviews.length} verified review${reviews.length !== 1 ? 's' : ''}`
                      : 'No reviews yet'}
                  </p>
                </div>
              </div>

              {/* Review cards */}
              {reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border border-[var(--border)] bg-[var(--surface)] p-6 hover:border-[var(--gold)]/40 transition-colors"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        {/* Avatar */}
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[var(--border)] shrink-0 bg-[var(--surface-2)]">
                          {review.authorAvatar ? (
                            <Image
                              src={review.authorAvatar}
                              alt={review.author}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--gold)] font-serif text-lg">
                              {review.author.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>

                        {/* Author info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="text-white font-medium text-sm">{review.author}</p>
                              {review.country && (
                                <p className="text-[var(--text-muted)] text-xs">{review.country}</p>
                              )}
                            </div>
                            <div className="text-right">
                              <StarRow rating={review.rating} size={12} />
                              <p className="text-[var(--text-muted)] text-xs mt-0.5">{review.date}</p>
                            </div>
                          </div>
                          {review.stayDuration && (
                            <p className="text-[var(--text-muted)] text-xs mt-1 flex items-center gap-1">
                              <Waves size={10} className="text-[var(--gold)]" />
                              Stayed {review.stayDuration}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Comment */}
                      <div className="relative pl-4 border-l-2 border-[var(--gold)]/30">
                        <Quote size={14} className="text-[var(--gold)] mb-1 opacity-60" />
                        <p className="text-[var(--text-muted)] text-sm leading-relaxed italic">
                          {review.comment}
                        </p>
                        {review.isVerified && (
                          <span className="inline-flex items-center gap-1 mt-2 text-[0.65rem] text-[var(--gold)] uppercase tracking-wider">
                            <Shield size={9} /> Verified Stay
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-[var(--border)] bg-[var(--surface)] p-10 text-center">
                  <Star size={28} className="text-[var(--border)] mx-auto mb-3" />
                  <p className="text-[var(--text-muted)] text-sm">Be the first to leave a review.</p>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="mb-14">
              <p className="section-label mb-4">Location</p>
              <h2 className="font-serif text-2xl text-white font-light mb-6">
                {property.location.city}{property.location.area ? `, ${property.location.area}` : ''}
              </h2>
              <div
                className="relative h-72 border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center overflow-hidden group hover:border-[var(--gold)] transition-all duration-300 cursor-pointer"
                onClick={() => {
                  const q = property.coordinates
                    ? `${property.coordinates.lat},${property.coordinates.lng}`
                    : `${property.name}, ${property.location.city}, Ghana`;
                  window.open(`https://maps.google.com/?q=${encodeURIComponent(q)}`, '_blank');
                }}
              >
                {/* Animated grid */}
                <div
                  className="absolute inset-0 opacity-[0.05]"
                  style={{
                    backgroundImage:
                      'linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] via-transparent to-[var(--surface-2)]" />
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 border border-[var(--gold)] flex items-center justify-center mx-auto mb-4 group-hover:bg-[var(--gold)] group-hover:scale-110 transition-all duration-300">
                    <MapPin size={24} className="text-[var(--gold)] group-hover:text-[#080808] transition-colors" />
                  </div>
                  <p className="text-white font-medium mb-1 text-lg">{property.name}</p>
                  <p className="text-[var(--text-muted)] text-sm mb-5">
                    {property.location.city}{property.location.area ? `, ${property.location.area}` : ''}, Ghana
                  </p>
                  <span className="btn-ghost text-xs py-2 px-5 inline-flex pointer-events-none">
                    Open in Google Maps →
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
              <p className="section-label mb-4">Have Questions?</p>
              <p className="text-[var(--text-muted)] text-sm mb-4 leading-relaxed">
                Our concierge team is available to help you plan the perfect stay.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={`tel:${CONTACT_INFO.phone}`}
                  className="btn-ghost text-sm py-2.5 px-5 inline-flex items-center gap-2"
                >
                  <Phone size={14} /> Call Us
                </a>
                <a
                  href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-sm py-2.5 px-5 inline-flex items-center gap-2"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN — Sticky Booking */}
          <div>
            <div className="lg:sticky lg:top-28 space-y-4">

              {/* Pricing card */}
              <div className="border border-[var(--border)] bg-[var(--surface)] p-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif text-4xl text-white font-light">
                    ${perNight.toLocaleString()}
                  </span>
                  <span className="text-[var(--text-muted)] text-sm">/ night</span>
                </div>
                <p className="text-[var(--text-muted)] text-sm">
                  ≈ GH₵ {perNightGHS.toLocaleString(undefined, { maximumFractionDigits: 0 })} / night
                </p>
                {property.pricing?.minNights && property.pricing.minNights > 1 && (
                  <div className="mt-3 pt-3 border-t border-[var(--border)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
                    <Waves size={12} className="text-[var(--gold)] shrink-0" />
                    Minimum stay: {property.pricing.minNights} nights
                  </div>
                )}
              </div>

              {/* Booking widget or coming soon */}
              {property.isLive !== false ? (
                <BookingWidget property={property as any} />
              ) : (
                <>
                  <div className="border border-[var(--gold)] p-8 bg-[var(--surface)] text-center">
                    <div className="w-12 h-12 border border-[var(--gold)] flex items-center justify-center mx-auto mb-4">
                      <Waves size={20} className="text-[var(--gold)]" />
                    </div>
                    <h3 className="font-serif text-2xl text-white mb-2">Coming Soon</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-6 leading-relaxed">
                      We are finalizing this property. Online booking will be available shortly.
                    </p>
                    <Link href="/contact" className="btn-ghost w-full py-3 text-xs text-center block">
                      Inquire for Details
                    </Link>
                  </div>
                  <ComingSoonSignup propertyName={property.name} />
                </>
              )}

              {/* Trust badges */}
              <div className="border border-[var(--border)] bg-[var(--surface)] p-5">
                <p className="section-label text-[0.55rem] mb-4">Why Book With Us</p>
                <div className="space-y-3">
                  {[
                    { icon: '🛡️', text: 'Verified luxury property' },
                    { icon: '🔑', text: 'Flexible check-in options' },
                    { icon: '📞', text: '24/7 concierge support' },
                    { icon: '💰', text: 'Best price guarantee' },
                    { icon: '🌟', text: '5-star hospitality standards' },
                  ].map(({ icon, text }) => (
                    <div key={text} className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                      <span className="text-base leading-none">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RELATED PROPERTIES ─────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-20 border-t border-[var(--border)] px-6 lg:px-12 max-w-[1440px] mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="section-label mb-3">Explore More</p>
              <h2 className="font-serif text-3xl lg:text-4xl font-light text-white">
                You May Also Like
              </h2>
            </div>
            <Link href="/properties" className="btn-ghost hidden sm:inline-flex text-sm">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map(p => {
              const img =
                p.images?.hero?.url ||
                p.images?.gallery?.[0]?.url ||
                'https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775296671/5_yc05lt.jpg';
              const price = p.pricing?.perNight ?? 0;
              return (
                <Link
                  key={p.id}
                  href={`/properties/${p.slug}`}
                  className="group block border border-[var(--border)] hover:border-[var(--gold)] bg-[var(--surface)] transition-all duration-300 overflow-hidden hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative h-52 overflow-hidden">
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/80 via-transparent to-transparent" />
                    {p.badge && (
                      <span className="absolute top-3 left-3 bg-[var(--gold)] text-[#080808] text-[0.6rem] font-bold uppercase tracking-wider px-2 py-1">
                        {p.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    {(p.rating ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5 mb-2">
                        <Star size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
                        <span className="text-xs text-[var(--text-muted)]">
                          {p.rating} · {p.reviewCount ?? 0} reviews
                        </span>
                      </div>
                    )}
                    <h3 className="font-serif text-xl text-white mb-1">{p.name}</h3>
                    <p className="text-[var(--text-muted)] text-xs flex items-center gap-1 mb-4">
                      <MapPin size={11} />
                      {p.location.city}{p.location.area ? `, ${p.location.area}` : ''}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                      <div>
                        <span className="font-serif text-xl text-white">${price.toLocaleString()}</span>
                        <span className="text-[var(--text-muted)] text-xs"> / night</span>
                      </div>
                      <span className="text-[var(--gold)] text-sm group-hover:translate-x-1 transition-transform inline-block">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
}
