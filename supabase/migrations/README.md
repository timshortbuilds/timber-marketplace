# Database Migrations

This directory contains versioned SQL migration files for the Timber Marketplace database.

## Migration Naming Convention

Migrations are named using the format: `{number}_{description}.sql`

Example: `001_initial_schema.sql`

## Running Migrations

### Option 1: Supabase Dashboard (Manual)
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of the migration file
4. Paste and execute

### Option 2: Supabase CLI (Recommended for Production)
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

## Migration History

| Migration | Description | Date | Status |
|-----------|-------------|------|--------|
| 001 | Initial schema (Profiles, Listings, Bookings, Messages, Audit Logs) | 2026-02-13 | ✅ Ready |

## Creating New Migrations

1. Create a new file: `{next_number}_{description}.sql`
2. Write your SQL migration
3. Test locally first if possible
4. Apply to development environment
5. Document in this README
6. Apply to production when ready

## Rollback Strategy

For each migration, consider creating a corresponding rollback file:
- Migration: `002_add_bookings.sql`
- Rollback: `002_add_bookings_rollback.sql`

## Best Practices

- ✅ Always use `IF NOT EXISTS` for idempotency
- ✅ Include both UP and DOWN migrations
- ✅ Test migrations on a development database first
- ✅ Never modify existing migration files after they've been applied
- ✅ Use transactions where possible
- ✅ Add comments to explain complex logic
- ✅ Create indexes for frequently queried columns
- ✅ Document breaking changes clearly
