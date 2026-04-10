import { NextRequest, NextResponse } from 'next/server';
import { createPropertyNeon, logFormSubmissionNeon } from '@/lib/neon/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await createPropertyNeon({
      name: body.name || `New Property ${Date.now()}`,
      slug: body.slug || `new-property-${Date.now()}`,
      tagline: body.tagline || 'New property description',
      description: body.description || 'Premium property created from the admin dashboard.',
      longDescription: body.longDescription || 'Update this property with your exact details.',
      type: body.type || 'apartment',
      badge: body.badge || null,
      isLive: body.isLive ?? false,
      pricing: {
        perNight: body.pricePerNight ?? 0,
        currency: 'USD',
      },
      capacity: {
        guests: body.guests ?? 2,
        bedrooms: body.bedrooms ?? 1,
        bathrooms: body.bathrooms ?? 1,
        beds: body.beds ?? 1,
      },
      location: {
        city: body.city || 'Accra',
        area: body.area || 'Ayi Mensah',
        country: body.country || 'Ghana',
      },
      images: {
        hero: {
          url: body.heroImageUrl || '',
          alt: body.heroImageAlt || 'New property hero image',
        },
        gallery: [],
      },
      amenities: body.amenities || [],
      features: body.features || [],
      houseRules: body.houseRules || [],
      checkInTime: body.checkInTime || '',
      checkOutTime: body.checkOutTime || '',
    });

    if (!created) {
      return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }

    await logFormSubmissionNeon('/admin/properties', 'Property Create', 'create', body);

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('[Admin] Create property error:', err);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
