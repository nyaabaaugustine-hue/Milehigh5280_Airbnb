import { getPropertyBySlugNeon, getLivePropertiesNeon } from '@/lib/neon/service';
import { notFound } from 'next/navigation';
import PropertyDetailPageClient from './PropertyDetailPageClient';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const properties = await getLivePropertiesNeon();
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const property = await getPropertyBySlugNeon(params.slug);
  if (!property) return { title: 'Property Not Found | Milehigh5280' };

  return {
    title: `${property.name} | Milehigh5280 Properties`,
    description: property.tagline || property.description,
  };
}

export default async function PropertyPage({ params }: { params: { slug: string } }) {
  const property = await getPropertyBySlugNeon(params.slug);

  if (!property) {
    notFound();
  }

  return <PropertyDetailPageClient property={property} />;
}