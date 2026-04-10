// PATCH /api/admin/properties/[id]
// Update a property in Neon Postgres

import { NextRequest, NextResponse } from 'next/server';
import { deletePropertyNeon, logFormSubmissionNeon, updatePropertyNeon } from '@/lib/neon/service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const updated = await updatePropertyNeon(id, {
      name: body.name,
      tagline: body.tagline,
      pricing: body.price ? { perNight: body.price, currency: 'USD' } : undefined,
      isLive: body.isLive,
      capacity: body.bedrooms || body.bathrooms || body.guests ? {
        bedrooms: body.bedrooms,
        bathrooms: body.bathrooms,
        guests: body.guests,
        beds: body.beds || body.bedrooms,
      } : undefined,
      location: body.city || body.region ? {
        city: body.city,
        area: body.region,
        country: body.country,
      } : undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { error: 'Property not found or update failed' },
        { status: 404 }
      );
    }

    await logFormSubmissionNeon('/admin/properties', 'Property Edit', 'update', { id, ...body });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[Admin] Patch property error:', err);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = await deletePropertyNeon(id);

    if (!deleted) {
      return NextResponse.json(
        { error: 'Property not found or delete failed' },
        { status: 404 }
      );
    }

    await logFormSubmissionNeon('/admin/properties', 'Property Delete', 'delete', { id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Delete property error:', err);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
