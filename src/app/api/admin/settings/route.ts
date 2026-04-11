// GET /api/admin/settings - Get all settings
// PATCH /api/admin/settings - Update settings

import { NextRequest, NextResponse } from 'next/server';
import { getSettingsNeon, updateSettingsNeon, logFormSubmissionNeon } from '@/lib/neon/service';

export async function GET() {
  try {
    const settings = await getSettingsNeon();
    return NextResponse.json(settings);
  } catch (err) {
    console.error('[Admin] Get settings error:', err);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    const updated = await updateSettingsNeon({
      phone: body.phone,
      whatsapp: body.whatsapp,
      email: body.email,
      address: body.address,
      socialLinks: body.socialLinks,
    });

    if (!updated) {
      return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
    }

    await logFormSubmissionNeon('/admin/settings', 'Settings Update', 'update', body);

    return NextResponse.json(updated);
  } catch (err) {
    console.error('[Admin] Update settings error:', err);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}