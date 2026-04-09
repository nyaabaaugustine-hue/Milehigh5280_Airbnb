// ─── Action Logger ────────────────────────────────────────────────────────────
// Stores all AI actions with before/after values for full audit trail + undo.
// Uses in-memory store (survives process lifetime) + JSON file backup.

import { randomUUID } from 'crypto';
import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import type { ActionLog, ToolName, ToolInput } from './types';

// ─── In-memory store ──────────────────────────────────────────────────────────
const logStore = new Map<string, ActionLog>();

// ─── File path for persistence ────────────────────────────────────────────────
const LOG_DIR  = path.join(process.cwd(), '.ai-logs');
const LOG_FILE = path.join(LOG_DIR, 'actions.json');

// ─── Ensure log directory exists ─────────────────────────────────────────────
async function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    await mkdir(LOG_DIR, { recursive: true });
  }
}

// ─── Load logs from file on startup ──────────────────────────────────────────
async function loadLogsFromFile(): Promise<void> {
  try {
    await ensureLogDir();
    if (!existsSync(LOG_FILE)) return;
    const raw = await readFile(LOG_FILE, 'utf-8');
    const logs: ActionLog[] = JSON.parse(raw);
    logs.forEach(log => logStore.set(log.id, log));
  } catch {
    // File might not exist or be malformed — start fresh
  }
}

// ─── Persist logs to file ─────────────────────────────────────────────────────
async function saveLogsToFile(): Promise<void> {
  try {
    await ensureLogDir();
    const logs = Array.from(logStore.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 500); // Keep last 500 actions
    await writeFile(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Logger] Failed to persist logs:', err);
  }
}

// Load logs on module init
loadLogsFromFile().catch(console.error);

// ─── Public API ───────────────────────────────────────────────────────────────

/** Create a new pending log entry */
export async function createLog(params: {
  tool: ToolName;
  input: ToolInput;
  executedBy?: string;
}): Promise<ActionLog> {
  const log: ActionLog = {
    id:          randomUUID(),
    timestamp:   new Date().toISOString(),
    tool:        params.tool,
    input:       params.input,
    status:      'pending',
    executedBy:  params.executedBy ?? 'admin',
  };

  logStore.set(log.id, log);
  await saveLogsToFile();
  return log;
}

/** Update an existing log entry */
export async function updateLog(
  id: string,
  updates: Partial<ActionLog>,
): Promise<ActionLog | null> {
  const existing = logStore.get(id);
  if (!existing) return null;

  const updated = { ...existing, ...updates };
  logStore.set(id, updated);
  await saveLogsToFile();
  return updated;
}

/** Get all logs, newest first */
export function getLogs(limit = 100): ActionLog[] {
  return Array.from(logStore.values())
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}

/** Get a single log by ID */
export function getLog(id: string): ActionLog | null {
  return logStore.get(id) ?? null;
}

/** Mark a log as approved (user confirmed) */
export async function approveLog(id: string): Promise<ActionLog | null> {
  return updateLog(id, { status: 'approved' });
}

/** Mark a log as rejected (user declined) */
export async function rejectLog(id: string): Promise<ActionLog | null> {
  return updateLog(id, { status: 'rejected' });
}

/** Mark a log as successfully executed */
export async function markExecuted(
  id: string,
  params: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
    airtableRecordId?: string;
  },
): Promise<ActionLog | null> {
  return updateLog(id, {
    status:            'executed',
    before:            params.before,
    after:             params.after,
    airtableRecordId:  params.airtableRecordId,
  });
}

/** Mark a log as failed */
export async function markFailed(id: string, error: string): Promise<ActionLog | null> {
  return updateLog(id, { status: 'failed', error });
}

/** Mark a log as undone */
export async function markUndone(id: string): Promise<ActionLog | null> {
  return updateLog(id, { status: 'undone' });
}

/** Get logs for a specific tool */
export function getLogsByTool(tool: ToolName): ActionLog[] {
  return getLogs().filter(l => l.tool === tool);
}

/** Get logs by status */
export function getLogsByStatus(status: ActionLog['status']): ActionLog[] {
  return getLogs().filter(l => l.status === status);
}
