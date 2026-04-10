import { query, queryOne } from './client';

const JWT_SECRET = process.env.JWT_SECRET || 'milehigh5280-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
  is_active: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs');
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export function verifyToken(token: string): User | null {
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded as User;
  } catch {
    return null;
  }
}

export async function createUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<User> {
  const passwordHash = await hashPassword(password);
  
  const result = await queryOne<{
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    is_active: boolean;
  }>(
    `INSERT INTO users (email, password_hash, first_name, last_name) 
     VALUES ($1, $2, $3, $4) 
     RETURNING id, email, first_name, last_name, role, is_active`,
    [email, passwordHash, firstName || null, lastName || null]
  );

  if (!result) throw new Error('Failed to create user');
  return result;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const result = await queryOne<{
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    is_active: boolean;
  }>(
    'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE email = $1 AND is_active = true',
    [email]
  );
  return result;
}

export async function findUserById(id: string): Promise<User | null> {
  const result = await queryOne<{
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    is_active: boolean;
  }>(
    'SELECT id, email, first_name, last_name, role, is_active FROM users WHERE id = $1 AND is_active = true',
    [id]
  );
  return result;
}

export async function validateCredentials(email: string, password: string): Promise<User | null> {
  const result = await queryOne<{
    id: string;
    email: string;
    password_hash: string;
    first_name: string | null;
    last_name: string | null;
    role: string;
    is_active: boolean;
  }>(
    'SELECT * FROM users WHERE email = $1 AND is_active = true',
    [email]
  );

  if (!result) return null;

  const isValid = await verifyPassword(password, result.password_hash);
  if (!isValid) return null;

  // Update last login
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [result.id]);

  return {
    id: result.id,
    email: result.email,
    first_name: result.first_name,
    last_name: result.last_name,
    role: result.role,
    is_active: result.is_active,
  };
}

export async function updateLastLogin(userId: string): Promise<void> {
  await query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
}

export function getUserFromRequest(request: Request): User | null {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.substring(7);
  return verifyToken(token);
}
