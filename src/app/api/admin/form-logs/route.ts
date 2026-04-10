import { NextRequest, NextResponse } from 'next/server';
import { logFormSubmissionNeon } from '@/lib/neon/service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = String(body.page || '/unknown');
    const formName = String(body.formName || 'Form Submission');
    const action = String(body.action || 'submit');
    const payload = body.payload || {};

    const logged = await logFormSubmissionNeon(page, formName, action, payload);
    if (!logged) {
      return NextResponse.json({ error: 'Failed to log form submission' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Admin] Form log error:', err);
    return NextResponse.json({ error: 'Failed to log form submission' }, { status: 500 });
  }
}
