import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Star, MapPin, Users, Bed, Bath, Waves, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getPropertyBySlug, getLiveProperties, formatCurrency } from '@/lib/data';
import PropertyGallery from '@/components/property/PropertyGallery';
import BookingWidget from '@/components/property/BookingWidget';
import ComingSoonSignup from '@/components/property/ComingSoonSignup';
import Image from 'next/image';

export async function generateStaticParams() {
  return getLiveProperties().map(p => ({ id: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyBySlug(id);
  if (!property) return { title: 'Property Not Found' };
  return {
    title: `${property.name} — ${property.location.city}, Ghana`,
    description: property.description,
    openGraph: { images: [{ url: property.images[0].url }] },
  };
}

const AmenityIcon = ({ icon }: { icon: string }) => {
  const iconMap: Record<string, string> = {
    Waves: '🌊', ChefHat: '👨‍🍳', Bell: '🔔', BellConcierge: '🔔',
    Wifi: '📶', MonitorPlay: '🎬', Sparkles: '✨', UtensilsCrossed: '🍽️',
    TreePalm: '🌴', Wind: '❄️', Shield: '🛡️', Dumbbell: '🏋️',
    Wine: '🍷', Building2: '🏙️', Cpu: '🏠', Flame: '🔥',
    Anchor: '⚓', Ship: '🚢', Sailboat: '⛵', Droplets: '💧',
    PartyPopper: '🎉', Car: '🚗', Shirt: '👕', Zap: '⚡',
  };
  return <span className="text-base">{iconMap[icon] ?? '✦'}</span>;
};

function PropertyJsonLd({ property }: { property: NonNullable<ReturnType<typeof getPropertyBySlug>> }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: property.name,
    description: property.description,
    url: `https://thepalmayimensah.com/properties/${property.slug}`,
    image: property.images.map(i => i.url),
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.location.address,
      addressLocality: property.location.city,
      addressRegion: property.location.region,
      addressCountry: 'GH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: property.location.coordinates.lat,
      longitude: property.location.coordinates.lng,
    },
    telephone: '+233599754270',
    priceRange: `${property.pricing.perNight}/night`,
    starRating: {
      '@type': 'Rating',
      ratingValue: property.rating,
      bestRating: 5,
      worstRating: 1,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: property.rating,
      reviewCount: property.reviewCount,
      bestRating: 5,
    },
    review: property.reviews.map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5 },
      reviewBody: r.comment,
      datePublished: r.date,
    })),
    amenityFeature: property.amenities.map(a => ({
      '@type': 'LocationFeatureSpecification',
      name: a.label,
      value: true,
    })),
    numberOfRooms: property.capacity.bedrooms,
    occupancy: { '@type': 'QuantitativeValue', maxValue: property.capacity.guests },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default async function PropertyPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const property = getPropertyBySlug(id);
  if (!property) notFound();

  const amenityCategories = [
    { label: 'Premium Services', key: 'premium' },
    { label: 'Outdoor & Pool',   key: 'outdoor' },
    { label: 'Entertainment',    key: 'entertainment' },
    { label: 'Kitchen',          key: 'kitchen' },
    { label: 'Essentials',       key: 'essential' },
  ] as const;

  return (
    <>
      <PropertyJsonLd property={property} />
      <div className="pt-28 pb-0 px-6 lg:px-12 max-w-[1440px] mx-auto">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6">
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <ChevronRight size={12} />
          <Link href="/properties" className="hover:text-[var(--gold)] transition-colors">Properties</Link>
          <ChevronRight size={12} />
          <span className="text-white">{property.name}</span>
        </nav>
      </div>

      <div className="px-6 lg:px-12 max-w-[1440px] mx-auto mb-10">
        <PropertyGallery images={property.images} propertyName={property.name} />
      </div>

      <div className="px-6 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-20">

          <div>
            <div className="border-b border-[var(--border)] pb-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                {property.isLive === false && (
                  <span className="bg-obsidian text-[var(--gold)] border border-[var(--gold)] text-[0.6rem] uppercase tracking-widest px-3 py-1 font-semibold">Coming Soon</span>
                )}
                {property.badge && (
                  <span className="bg-[var(--gold)] text-obsidian text-[0.6rem] uppercase tracking-widest px-3 py-1 font-semibold">{property.badge}</span>
                )}
                <span className="text-[var(--text-muted)] text-xs uppercase tracking-widest capitalize">{property.type}</span>
              </div>
              <h1 className="font-serif text-4xl lg:text-6xl font-light text-white mb-3">{property.name}</h1>
              <p className="font-serif text-xl italic text-[var(--gold)] mb-4">{property.tagline}</p>
              <div className="flex flex-wrap items-center gap-5 text-sm">
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <MapPin size={14} className="text-[var(--gold)]" />
                  {property.location.address}
                </div>
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="fill-[var(--gold)] text-[var(--gold)]" />
                  <span className="text-white font-medium">{property.rating}</span>
                  <span className="text-[var(--text-muted)]">({property.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {[
                { icon: <Users size={18} className="text-[var(--gold)]" />, value: property.capacity.guests,    label: 'Guests' },
                { icon: <Bed   size={18} className="text-[var(--gold)]" />, value: property.capacity.bedrooms,  label: 'Bedrooms' },
                { icon: <Bed   size={16} className="text-[var(--gold)]" />, value: property.capacity.beds,      label: 'Beds' },
                { icon: <Bath  size={18} className="text-[var(--gold)]" />, value: property.capacity.bathrooms, label: 'Bathrooms' },
              ].map(({ icon, value, label }) => (
                <div key={label} className="border border-[var(--border)] p-4 text-center hover:border-[var(--gold)] transition-colors duration-300">
                  <div className="flex justify-center mb-2">{icon}</div>
                  <p className="font-serif text-2xl text-white font-light">{value}</p>
                  <p className="text-[var(--text-muted)] text-xs uppercase tracking-widest mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            <div className="mb-10">
              <h2 className="font-serif text-2xl font-light text-white mb-5">About This Property</h2>
              {property.longDescription.split('\n\n').map((para, i) => (
                <p key={i} className="text-[var(--text-muted)] leading-relaxed mb-4 text-[0.95rem]">{para}</p>
              ))}
            </div>

            <div className="border border-[var(--border)] p-6 mb-10 bg-[var(--surface)]">
              <h2 className="font-serif text-xl font-light text-white mb-5">Property Highlights</h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {property.features.map(f => (
                  <li key={f} className="flex items-start gap-3 text-sm text-[var(--text-muted)]">
                    <span className="text-[var(--gold)] shrink-0 mt-0.5">◆</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-serif text-2xl font-light text-white mb-6">Amenities</h2>
              <div className="space-y-8">
                {amenityCategories.map(({ label, key }) => {
                  const items = property.amenities.filter(a => a.category === key);
                  if (!items.length) return null;
                  return (
                    <div key={key}>
                      <p className="section-label mb-4">{label}</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {items.map(amenity => (
                          <div key={amenity.id} className="flex items-center gap-3 border border-[var(--border)] p-3 hover:border-[var(--gold)] transition-colors duration-300">
                            <AmenityIcon icon={amenity.icon} />
                            <span className="text-[var(--text-muted)] text-sm">{amenity.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {property.reviews.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-serif text-2xl font-light text-white">Guest Reviews</h2>
                  <div className="flex items-center gap-2">
                    <Star size={16} className="fill-[var(--gold)] text-[var(--gold)]" />
                    <span className="text-white font-medium">{property.rating}</span>
                    <span className="text-[var(--text-muted)] text-sm">· {property.reviewCount} reviews</span>
                  </div>
                </div>
                <div className="space-y-6">
                  {property.reviews.map(review => (
                    <div key={review.id} className="border border-[var(--border)] p-6 hover:border-[var(--gold)] transition-colors duration-300">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[var(--border-bright)] shrink-0">
                            <Image src={review.avatar} alt={review.author} fill className="object-cover" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{review.author}</p>
                            <p className="text-[var(--text-muted)] text-xs">{review.country} · {review.stayDuration}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex gap-0.5">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} size={12} className="fill-[var(--gold)] text-[var(--gold)]" />
                            ))}
                          </div>
                          <span className="text-[var(--text-subtle)] text-xs">{review.date}</span>
                        </div>
                      </div>
                      <p className="text-[var(--text-muted)] text-sm leading-relaxed italic">&ldquo;{review.comment}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-10">
              <h2 className="font-serif text-2xl font-light text-white mb-4">Location</h2>
              <div className="relative h-64 border border-[var(--border)] bg-[var(--surface-2)] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] to-[var(--surface-2)]" />
                <div className="relative z-10 text-center">
                  <MapPin size={32} className="text-[var(--gold)] mx-auto mb-3" />
                  <p className="text-[var(--text-muted)] text-sm">{property.location.city}, {property.location.region}</p>
                  <a
                    href={`https://maps.google.com/?q=${property.location.coordinates.lat},${property.location.coordinates.lng}`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-ghost mt-4 text-xs py-2 px-4 inline-flex"
                  >
                    Open in Google Maps
                  </a>
                </div>
                <div className="absolute inset-0 opacity-5"
                  style={{ backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '30px 30px' }}
                />
              </div>
            </div>
          </div>

          <div>
            <div className="lg:sticky lg:top-28">
              {property.isLive !== false ? (
                <BookingWidget property={property} />
              ) : (
                <>
                  <div className="border border-[var(--gold)] p-8 bg-[var(--surface)] text-center mb-6">
                    <h3 className="font-serif text-2xl text-white mb-2">Coming Soon</h3>
                    <p className="text-[var(--text-muted)] text-sm mb-6">We are currently finalizing this property. Online booking will be available shortly.</p>
                    <Link href="/contact" className="btn-ghost w-full py-3 text-xs">Inquire for Details</Link>
                  </div>
                  <ComingSoonSignup propertyName={property.name} />
                </>
              )}
              <div className="mt-4 border border-[var(--border)] p-4 bg-[var(--surface)]">
                <p className="section-label text-[0.55rem] mb-2">Pricing in Ghanaian Cedis</p>
                <p className="font-serif text-2xl text-white font-light">
                  {formatCurrency(property.pricing.perNightGHS, 'GHS')}
                  <span className="text-[var(--text-muted)] text-sm font-sans"> / night</span>
                </p>
              </div>
              <div className="mt-3 flex items-start gap-2 text-xs text-[var(--text-muted)]">
                <Waves size={13} className="text-[var(--gold)] mt-0.5 shrink-0" />
                <span>Minimum stay: {property.pricing.minNights} nights. Shorter stays may be available — contact concierge.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <section className="mt-20 py-16 border-t border-[var(--border)] px-6 lg:px-12 max-w-[1440px] mx-auto">
        <h2 className="font-serif text-3xl font-light text-white mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {getLiveProperties()
            .filter(p => p.id !== property.id)
            .slice(0, 3)
            .map(p => {
              const img = p.images[0];
              return (
                <Link key={p.id} href={`/properties/${p.slug}`} className="property-card group" aria-label={`View ${p.name}`}>
                  <div className="relative h-48 card-image overflow-hidden">
                    <Image src={img.url} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/70 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <p className="font-serif text-lg text-white">{p.name}</p>
                      <p className="text-[var(--text-muted)] text-xs">{formatCurrency(p.pricing.perNight)} / night</p>
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </section>
    </>
  );
}
