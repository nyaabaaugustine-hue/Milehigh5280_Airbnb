'use client';

import Hero from '@/components/home/Hero';
import Experience from '@/components/home/Experience';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AmenitiesMarquee from '@/components/home/AmenitiesMarquee';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import PriceCalculator from '@/components/home/PriceCalculator';
import { useBooking } from '@/components/layout/ClientShell';

export default function HomePage() {
  const { openBooking, viewProperty } = useBooking();

  return (
    <>
      <Hero onBookNow={openBooking} />

      {/* ── Art Banner — full-width end-to-end, original proportions ── */}
      <div className="w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775469261/POO_s607yy.png"
          alt="Milehigh5280 art"
          className="w-full block"
          style={{ display: 'block', width: '100%', height: 'auto' }}
          loading="lazy"
        />
      </div>

      <Experience />
      <FeaturedProperties onBookNow={openBooking} onViewProperty={viewProperty} />
      <AmenitiesMarquee />
      <PriceCalculator onBookNow={openBooking} />
      <Testimonials />
      <BlogSection />
    </>
  );
}
