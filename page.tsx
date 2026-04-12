import { getLivePropertiesNeon } from '@/lib/neon/service';
import FeaturedProperties from '@/components/home/FeaturedProperties';
import Testimonials from '@/components/home/Testimonials';

export default async function HomePage() {
  const properties = await getLivePropertiesNeon();

  return (
    <main>
      {/* Hero section would go here */}
      <FeaturedProperties allProperties={properties} />
      <Testimonials />
    </main>
  );
}