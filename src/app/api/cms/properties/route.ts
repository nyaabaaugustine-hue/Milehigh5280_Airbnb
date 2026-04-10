// API Route: GET /api/cms/properties
// Fetches all properties from Neon Postgres

import { NextResponse } from 'next/server';
import { getAllPropertiesNeon, getLivePropertiesNeon, getPropertyBySlugNeon } from '@/lib/neon/service';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const liveOnly = searchParams.get('live') === 'true';

    if (slug) {
      const property = await getPropertyBySlugNeon(slug);
      if (!property) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }
      return NextResponse.json({ data: property });
    }

    const properties = liveOnly ? await getLivePropertiesNeon() : await getAllPropertiesNeon();

    return NextResponse.json({
      data: properties,
      meta: {
        count: properties.length,
        cached: true,
        revalidate: 300,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
