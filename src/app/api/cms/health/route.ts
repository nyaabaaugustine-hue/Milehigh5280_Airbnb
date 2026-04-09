// API Route: GET /api/cms/health
// Health check for Airtable connection

import { NextResponse } from 'next/server';
import { checkAirtableHealth } from '@/lib/airtable/service';

export async function GET() {
  const health = await checkAirtableHealth();

  return NextResponse.json({
    status: health.ok ? 'healthy' : 'unhealthy',
    message: health.message,
    timestamp: new Date().toISOString(),
  }, { status: health.ok ? 200 : 503 });
}
