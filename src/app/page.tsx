'use client';

import Hero from '@/components/home/Hero';
import Experience from '@/components/home/Experience';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import AmenitiesMarquee from '@/components/home/AmenitiesMarquee';
import Testimonials from '@/components/home/Testimonials';
import BlogSection from '@/components/home/BlogSection';
import PriceCalculator from '@/components/home/PriceCalculator';
import PressSection from '@/components/home/PressSection';
import ViewerCounter from '@/components/ui/ViewerCounter';
import { useBooking } from '@/components/layout/ClientShell';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { openBooking, viewProperty } = useBooking();
  const router = useRouter();

  return (
    <>
      <Hero onBookNow={openBooking} />
      <Experience />
      <FeaturedProperties onBookNow={openBooking} onViewProperty={viewProperty} />
      <AmenitiesMarquee />
      <PriceCalculator onBookNow={openBooking} />
      <Testimonials />
      <PressSection />
      <BlogSection />

      {/* ── Art Banner ── */}
      <section
        className="bg-[var(--obsidian)] overflow-hidden cursor-pointer"
        onClick={() => router.push('/contact')}
        title="Contact us"
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="relative overflow-hidden border border-[var(--border)] border-b-0 shadow-2xl bg-[#0a0a0a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1775469261/POO_s607yy.png"
              alt="Milehigh5280 Ghana culture art — click to contact us"
              loading="lazy"
              className="w-full h-auto block object-cover max-h-[450px] hover:opacity-90 transition-opacity duration-300"
              style={{ mixBlendMode: 'luminosity', filter: 'brightness(1.1) contrast(1.1)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-obsidian/40 pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Floating viewer counter */}
      <ViewerCounter />
    </>
  );
}
