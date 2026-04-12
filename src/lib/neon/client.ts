import { neon, neonConfig } from '@neondatabase/serverless';

// Support both DATABASE_URL and NEON_DATABASE_URL
const connectionString =
  process.env.DATABASE_URL ||
  process.env.NEON_DATABASE_URL ||
  null;

if (!connectionString) {
  console.warn('[Neon] DATABASE_URL / NEON_DATABASE_URL not set. DB calls will be no-ops.');
}

// Enable connection pooling for serverless
neonConfig.fetchConnectionCache = true;

// Create the sql tagged-template function
export const sql = connectionString ? neon(connectionString) : null;

/**
 * Execute a parameterised query and return all rows.
 * Uses neon's low-level query() which accepts a plain SQL string + params array.
 */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  if (!sql) return [];
  try {
    return await sql(text, params ?? []) as T[];
  } catch (error) {
    console.error('[Neon] Query error:', error);
    console.error('[Neon] SQL:', text);
    return [];
  }
}

/**
 * Execute a parameterised query and return the first row, or null.
 */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/**
 * Execute a statement that doesn't return rows (INSERT/UPDATE/DELETE).
 * Returns true on success, false on error.
 */
export async function execute(text: string, params?: unknown[]): Promise<boolean> {
  if (!sql) return false;
  try {
    await sql(text, params ?? []);
    return true;
  } catch (error) {
    console.error('[Neon] Execute error:', error);
    console.error('[Neon] SQL:', text);
    return false;
  }
}

/** Returns true when a real DB connection is available */
export function isDbConnected(): boolean {
  return sql !== null;
}
