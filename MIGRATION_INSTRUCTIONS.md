# QuadraJá Database Migration Instructions

## 🎯 Current Status

✅ Environment variables configured (`.env` file created)
✅ Migration files prepared
⏳ **Database migrations need to be run**

## 🚀 Quick Setup (5 minutes)

### Step 1: Open Supabase SQL Editor

Click this link to open your project's SQL Editor:
**[Open SQL Editor](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new)**

### Step 2: Run the Complete Migration

1. Open the file: `complete-migration.sql` (in your project root)
2. Copy **all** its contents
3. Paste into the SQL Editor
4. Click **"Run"** or press `Ctrl+Enter` (or `Cmd+Enter` on Mac)

### Step 3: Verify Setup

After running the migration, you should see:

- ✅ `profiles` table created
- ✅ `courts` table created with 6 sample courts
- ✅ `bookings` table created
- ✅ Row Level Security (RLS) policies applied
- ✅ Indexes created for performance

You can verify by checking the "Table Editor" in your Supabase dashboard:

- [View Tables](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/editor)

## 📋 What's Included in the Migration

### Tables Created

1. **profiles** - User profile information

   - Linked to Supabase Auth users
   - Stores: name, phone, avatar, user role (user/club_owner)

2. **courts** - Sports facilities available for booking

   - Includes 6 pre-loaded sample courts
   - Supports: multiple sports, geolocation, amenities, pricing
   - Can be owned by club owners

3. **bookings** - Court reservations
   - Links users to courts with time slots
   - Tracks booking status and pricing

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only see/modify their own data
- Club owners can manage their courts and view bookings
- Public can browse courts without authentication
- All sensitive operations require authentication

### Sample Data

The migration includes 6 sample courts:

- Arena Sport Center (Futebol) - São Paulo
- Quadra Central de Tênis - São Paulo
- Beach Vôlei Sunset - Rio de Janeiro
- Basket Pro Arena - São Paulo
- Futsal Champions - São Paulo
- Padel Elite - São Paulo

## 🔧 Configuration Details

### Environment Variables (Already Set)

```env
NEXT_PUBLIC_SUPABASE_URL=https://hegqofubmkhmwjvpssdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Migration Files (Already Prepared)

Located in `supabase/migrations/`:

1. `20251106130020_create_quadra_ja_schema.sql` - Base schema
2. `20251106131138_update_courts_rls_for_public_access.sql` - Public access
3. `20251106134238_add_club_owner_system.sql` - Club owner features
4. `20251106140026_fix_profiles_rls_insert_policy.sql` - Profile policies

## 🆘 Troubleshooting

### If migration fails with "already exists" errors

This is normal if you've partially run migrations before. The migrations are idempotent and safe to re-run.

### If you see RLS policy errors

Some policies may already exist. The `DROP POLICY IF EXISTS` statements handle this automatically.

### To reset and start fresh

If you need to start over, you can drop all tables in the Supabase dashboard:

1. Go to Table Editor
2. Delete tables: `bookings`, `courts`, `profiles` (in that order)
3. Run the migration again

## 📚 Next Steps

After migration completes:

1. **Test the setup:**

   ```bash
   npm run dev
   ```

2. **Create a test user:**

   - Sign up through your app
   - Check that profile is created automatically

3. **Browse courts:**

   - Visit the courts page
   - Should see 6 sample courts

4. **Make a booking:**
   - Sign in
   - Select a court and time slot
   - Complete a test booking

## 🔗 Useful Links

- [SQL Editor](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new)
- [Table Editor](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/editor)
- [Authentication](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/users)
- [API Docs](https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/api)

## ✅ Success Indicators

Your database is correctly set up when:

- [x] No errors in SQL Editor after running migration
- [x] 3 tables visible in Table Editor (profiles, courts, bookings)
- [x] 6 rows in `courts` table
- [x] Your Next.js app connects without errors
- [x] You can sign up and create a user
- [x] You can view the courts list

---

**Need Help?** If you encounter any issues, check the Supabase logs or ask for assistance.
