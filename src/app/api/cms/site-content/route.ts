import { NextRequest, NextResponse } from 'next/server';
import { getAllSiteContentNeon, updateSiteContentNeon } from '@/lib/neon/service';

export async function GET() {
  try {
    const content = await getAllSiteContentNeon();
    return NextResponse.json(content);
  } catch (err) {
    console.error('[CMS] Fetch site content error:', err);
    return NextResponse.json({ error: 'Failed to fetch site content' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const updates = body.updates ?? (body.key ? { [body.key]: body.value } : {});

    if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(updates)) {
      await updateSiteContentNeon(key, String(value ?? ''));
    }

    const content = await getAllSiteContentNeon();
    return NextResponse.json(content);
  } catch (err) {
    console.error('[CMS] Update site content error:', err);
    return NextResponse.json({ error: 'Failed to update site content' }, { status: 500 });
  }
}
