import { NextRequest, NextResponse } from 'next/server';
import { createAmenityNeon, getAllAmenitiesNeon, logFormSubmissionNeon } from '@/lib/neon/service';

export async function GET() {
  try {
    const amenities = await getAllAmenitiesNeon();
    return NextResponse.json(amenities);
  } catch (err) {
    console.error('[Admin] Get amenities error:', err);
    return NextResponse.json({ error: 'Failed to fetch amenities' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    const created = await createAmenityNeon({
      name: body.name || 'New Amenity',
      icon: body.icon || '✨',
      category: body.category || 'essential',
      description: body.description || '',
    });

    if (!created) {
      return NextResponse.json({ error: 'Failed to create amenity' }, { status: 500 });
    }

    await logFormSubmissionNeon('/admin/amenities', 'Amenity Create', 'create', body);

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error('[Admin] Create amenity error:', err);
    return NextResponse.json({ error: 'Failed to create amenity' }, { status: 500 });
  }
}