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
      <Experience />
      <FeaturedProperties onBookNow={openBooking} onViewProperty={viewProperty} />
      <AmenitiesMarquee />
      <PriceCalculator onBookNow={openBooking} />
      <Testimonials />
      <BlogSection />
    </>
  );
}
