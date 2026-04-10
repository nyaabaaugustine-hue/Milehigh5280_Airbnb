// API Route: GET /api/cms/health
// Health check for Neon Postgres connection

import { NextResponse } from 'next/server';
import { queryOne } from '@/lib/neon/client';

export async function GET() {
  try {
    await queryOne('SELECT 1 AS ok');
    return NextResponse.json(
      {
        status: 'healthy',
        message: 'Neon connection successful',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[CMS Health] Neon health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Connection failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
