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

      {/* Floating viewer counter */}
      <ViewerCounter />
    </>
  );
}
