// PATCH /api/admin/amenities/[id] - Update amenity
// DELETE /api/admin/amenities/[id] - Delete amenity

import { NextRequest, NextResponse } from 'next/server';
import { deleteAmenityNeon, updateAmenityNeon, logFormSubmissionNeon } from '@/lib/neon/service';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await req.json();

    const updated = await updateAmenityNeon(id, {
      name: body.name,
      icon: body.icon,
      category: body.category,
      description: body.description,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Amenity not found or update failed' }, { status: 404 });
    }

    await logFormSubmissionNeon('/admin/amenities', 'Amenity Edit', 'update', { id, ...body });

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[Admin] Patch amenity error:', err);
    return NextResponse.json({ error: 'Failed to update amenity' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const deleted = await deleteAmenityNeon(id);

    if (!deleted) {
      return NextResponse.json({ error: 'Amenity not found or delete failed' }, { status: 404 });
    }

    await logFormSubmissionNeon('/admin/amenities', 'Amenity Delete', 'delete', { id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Delete amenity error:', err);
    return NextResponse.json({ error: 'Failed to delete amenity' }, { status: 500 });
  }
}