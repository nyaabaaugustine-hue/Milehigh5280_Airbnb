# Neon Database Setup & Migration Guide

## Quick Start

### 1. Set up Neon Connection

Your connection strings are already in `.env.local`:

```
NEON_DATABASE_URL=postgresql://neondb_owner:npg_fJUHwWM71vSg@ep-polished-sound-anvsrui2-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

NEON_DATABASE_URL_READ_REPLICA=postgresql://user:password@host/dbname?sslmode=require
```

### 2. Initialize Database Schema

Run the schema file in Neon SQL Editor:

```bash
# Copy contents of src/lib/neon/schema.sql
# Paste into https://console.neon.tech/app/projects/super-dream-26616154
```

### 3. Verify Tables Created

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Expected tables:
- `users`
- `properties`
- `amenities`
- `reviews`
- `blog_posts`
- `site_content`
- `settings`

## Data Migration Strategy

### Phase 1: Schema Setup (Done ✅)
- [x] Create Neon database tables
- [x] Create Neon client helper

### Phase 2: Service Layer (In Progress)
- [x] Create Neon service (`src/lib/neon/service.ts`)
- [ ] Migrate Airtable service to use Neon
- [ ] Create migration script from Airtable to Neon

### Phase 3: API Routes
- [ ] Create Neon-specific admin endpoints
- [ ] Update AI executor to use Neon
- [ ] Update AI mutations to use Neon

### Phase 4: Cutover
- [ ] Switch all services from Airtable to Neon
- [ ] Archive Airtable data
- [ ] Monitor Neon performance

## Migration Script Template

```typescript
// scripts/migrate-airtable-to-neon.ts
import { getAllProperties as getAirtableProperties } from '@/lib/airtable/service';
import { createPropertyNeon } from '@/lib/neon/service';

async function migratePropertiesToNeon() {
  const properties = await getAirtableProperties();
  
  for (const prop of properties) {
    await createPropertyNeon({
      name: prop.name,
      slug: prop.slug,
      tagline: prop.tagline,
      description: prop.description,
      // ... map remaining fields
    });
  }
  
  console.log(`✅ Migrated ${properties.length} properties to Neon`);
}
```

## Neon Features Enabled

- ✅ Automatic backups
- ✅ Read replicas (via `NEON_DATABASE_URL_READ_REPLICA`)
- ✅ Branch support for testing
- ✅ Connection pooling
- ✅ ROW LEVEL SECURITY ready

## Troubleshooting

### Connection Issues

```bash
# Test connection
psql "postgresql://neondb_owner:npg_fJUHwWM71vSg@ep-polished-sound-anvsrui2-pooler.c-6.us-east-1.aws.neon.tech/neondb"
```

### Query Errors

Check Neon Console for slow query log:
https://console.neon.tech/app/projects/super-dream-26616154

## Next Steps

1. Run schema in Neon console
2. Create migration script
3. Test Neon queries with `npm run test:neon` (when created)
4. Switch Airtable service to Neon
5. Monitor performance
