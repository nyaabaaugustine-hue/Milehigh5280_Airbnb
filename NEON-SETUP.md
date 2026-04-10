# Environment Variables for Neon CMS Integration

## Required Variables

### Database (Neon)
```env
# Get this from Neon Dashboard → your project → Connection Details
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-1.neon.tech/dbname?sslmode=require
```

### Revalidation (On-Demand ISR)
```env
# Generate a secure random string: openssl rand -base64 32
REVALIDATE_SECRET=your-secure-random-secret-here

# Your site's base URL
NEXT_PUBLIC_SITE_URL=https://thepalmayimensah.com
```

### Authentication (Neon Auth)
```env
# JWT secret for auth tokens
JWT_SECRET=your-jwt-secret-here
```

## Setup Steps

1. **Create Neon Project**
   - Go to https://neon.tech
   - Create new project: `super-dream-26616154`
   - Copy connection string from dashboard

2. **Run Database Schema**
   - Copy contents of `src/lib/neon/schema.sql`
   - Run in Neon SQL Editor

3. **Add Environment Variables**
   ```bash
   # In your .env.local
   DATABASE_URL=postgresql://...
   REVALIDATE_SECRET=your-secret
   NEXT_PUBLIC_SITE_URL=https://thepalmayimensah.com
   ```

4. **Deploy to Vercel**
   - Add same variables in Vercel dashboard
   - Set to production for production builds

## How It Works

1. **Admin updates content** → Saves to Neon DB
2. **API triggers revalidation** → POST to `/api/revalidate`
3. **Next.js invalidates cache** → `revalidatePath()` clears static cache
4. **Next visitor gets fresh content** → ISR serves new data instantly

## Testing Locally

```bash
# Test revalidation API
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-secret" \
  -d '{"path": "/properties"}'
```

## Security Notes

- Keep `REVALIDATE_SECRET` private - never expose in client code
- Only allow paths in `ALLOWED_PATHS` array
- Log all revalidation attempts for audit