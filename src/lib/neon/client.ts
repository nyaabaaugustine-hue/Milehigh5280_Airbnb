import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.warn('DATABASE_URL not set. Using demo mode.');
}

export const sql = neon(connectionString || 'postgresql://demo:demo@localhost:5432/demo');

export async function query<T = unknown>(text: string, params?: unknown[]): Promise<T[]> {
  try {
    const result = await sql(text, params);
    return result as T[];
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function queryOne<T = unknown>(text: string, params?: unknown[]): Promise<T | null> {
  const results = await query<T>(text, params);
  return results[0] || null;
}

export async function execute(text: string, params?: unknown[]): Promise<{ count: number }> {
  try {
    await sql(text, params);
    return { count: 1 };
  } catch (error) {
    console.error('Database execute error:', error);
    throw error;
  }
}
