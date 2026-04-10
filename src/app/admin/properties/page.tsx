import type { Metadata } from 'next';
import { getAllPropertiesNeon } from '@/lib/neon/service';
import PropertiesPageClient from './PropertiesPageClient';

export const metadata: Metadata = {
  title: 'Properties | Admin Dashboard',
  robots: 'noindex, nofollow',
};

export default async function AdminPropertiesPage() {
  const properties = await getAllPropertiesNeon().catch(() => []);
  
  const normalized = properties.map((p) => ({
    ...p,
    location: {
      region: p.location.area || '',
      city: p.location.city,
    },
    capacity: {
      ...p.capacity,
      bathrooms: p.capacity.bathrooms || 0,
    },
    images: Array.isArray(p.images) ? p.images : p.images?.gallery || [],
  })) as any;

  return <PropertiesPageClient initialProperties={normalized} />;
}
