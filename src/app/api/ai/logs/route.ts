// GET /api/ai/logs — Fetch action history
// DELETE /api/ai/logs?id=xxx — Clear specific log (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getLogs, getLogsByStatus, getLogsByTool, getLog } from '@/lib/ai/logger';
import type { ToolName, ActionLog } from '@/lib/ai/types';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit  = parseInt(searchParams.get('limit')  ?? '50', 10);
  const status = searchParams.get('status') as ActionLog['status'] | null;
  const tool   = searchParams.get('tool') as ToolName | null;
  const id     = searchParams.get('id');

  // Single log lookup
  if (id) {
    const log = getLog(id);
    if (!log) return NextResponse.json({ error: 'Log not found' }, { status: 404 });
    return NextResponse.json(log);
  }

  // Filtered lists
  let logs = getLogs(limit);
  if (status) logs = logs.filter(l => l.status === status);
  if (tool)   logs = logs.filter(l => l.tool === tool);

  return NextResponse.json({
    logs,
    total: logs.length,
    timestamp: new Date().toISOString(),
  });
}
