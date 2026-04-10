// Hardcoded Admin Users
// Only these two admins can access the dashboard
export const ADMIN_USERS = [
  {
    email: 'admin@milehigh5280.com',
    password: 'Milehigh@2024!',
    firstName: 'Herbert',
    lastName: 'Prempeh',
    role: 'super_admin',
  },
  {
    email: 'manager@milehigh5280.com',
    password: 'Milehigh@2024!',
    firstName: 'Manager',
    lastName: 'Admin',
    role: 'admin',
  },
];

export function isAdminEmail(email: string): boolean {
  return ADMIN_USERS.some(admin => admin.email.toLowerCase() === email.toLowerCase());
}

export function validateAdminCredentials(email: string, password: string): { valid: boolean; admin?: typeof ADMIN_USERS[0] } {
  const admin = ADMIN_USERS.find(
    a => a.email.toLowerCase() === email.toLowerCase() && a.password === password
  );
  
  if (admin) {
    return { valid: true, admin };
  }
  
  return { valid: false };
}

export function getAdminByEmail(email: string): typeof ADMIN_USERS[0] | undefined {
  return ADMIN_USERS.find(a => a.email.toLowerCase() === email.toLowerCase());
}