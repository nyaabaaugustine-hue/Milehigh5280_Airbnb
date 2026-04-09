// API Route: GET /api/cms/reviews
// Fetches all reviews from Airtable

import { NextResponse } from 'next/server';
import { getAllReviews, getReviewsByPropertyId } from '@/lib/airtable/service';

export const revalidate = 300; // Revalidate every 5 minutes

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (propertyId) {
      const reviews = await getReviewsByPropertyId(propertyId);
      return NextResponse.json({
        data: reviews,
        meta: {
          count: reviews.length,
          propertyId,
          cached: true,
        },
      });
    }

    const reviews = await getAllReviews();

    return NextResponse.json({
      data: reviews,
      meta: {
        count: reviews.length,
        cached: true,
        revalidate: 300,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
