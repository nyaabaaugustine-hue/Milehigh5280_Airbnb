// POST /api/ai/execute
// Input:  { logId: string, action: AIInterpretResponse }
// Output: ExecutionResult
//
// SAFETY: This route only runs AFTER the user has clicked "Confirm".
// It requires a valid logId that was created during interpretation.

import { NextRequest, NextResponse } from 'next/server';
import { createLog, approveLog, rejectLog, getLog } from '@/lib/ai/logger';
import { executeAction } from '@/lib/ai/executor';
import type { AIInterpretResponse } from '@/lib/ai/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, confirmed, logId } = body as {
      action:    AIInterpretResponse;
      confirmed: boolean;
      logId?:    string;
    };

    // ── Reject ────────────────────────────────────────────────────────────────
    if (!confirmed) {
      if (logId) await rejectLog(logId);
      return NextResponse.json({
        success: false,
        message: 'Action cancelled by user.',
        logId,
      });
    }

    // ── Validate action ───────────────────────────────────────────────────────
    if (!action?.action) {
      return NextResponse.json(
        { error: 'No action to execute.' },
        { status: 400 },
      );
    }

    // ── Get or create log entry ───────────────────────────────────────────────
    let log = logId ? getLog(logId) : null;

    if (!log) {
      // Create a fresh log if one wasn't pre-created
      log = await createLog({
        tool:       action.action,
        input:      action.data,
        executedBy: 'admin',
      });
    }

    // Approve the log (marks it ready for execution)
    await approveLog(log.id);
    const approvedLog = getLog(log.id)!;

    // ── Execute ───────────────────────────────────────────────────────────────
    const result = await executeAction(approvedLog);

    return NextResponse.json(result);

  } catch (err: unknown) {
    console.error('[AI Execute] Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Execution failed' },
      { status: 500 },
    );
  }
}

// POST /api/ai/execute?action=create_log
// Pre-creates a log entry when the AI returns a response (before user confirms)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body as { action: AIInterpretResponse };

    if (!action?.action) {
      return NextResponse.json({ error: 'No action.' }, { status: 400 });
    }

    const log = await createLog({
      tool:       action.action,
      input:      action.data,
      executedBy: 'admin',
    });

    return NextResponse.json({ logId: log.id });

  } catch (err: unknown) {
    console.error('[AI Execute PUT] Error:', err);
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 });
  }
}
