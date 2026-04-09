// API Route: GET /api/cms/amenities
// Fetches all amenities from Airtable

import { NextResponse } from 'next/server';
import { getAllAmenities } from '@/lib/airtable/service';

export const revalidate = 600; // Revalidate every 10 minutes

export async function GET() {
  try {
    const amenities = await getAllAmenities();

    return NextResponse.json({
      data: amenities,
      meta: {
        count: amenities.length,
        cached: true,
        revalidate: 600,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch amenities', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
