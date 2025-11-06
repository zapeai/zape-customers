# 🎯 QuadraJá Database Setup Summary

## ✅ Completed Steps

### 1. Environment Configuration
- ✅ Created `.env` file with Supabase credentials
- ✅ Configured environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`: https://hegqofubmkhmwjvpssdi.supabase.co
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Configured (service role key)
  - `SUPABASE_SERVICE_ROLE_KEY`: Configured

### 2. Supabase Client Setup
- ✅ Verified client configuration files:
  - `src/lib/supabase/client.ts` - Browser client (correctly configured)
  - `src/lib/supabase/server.ts` - Server client (correctly configured)
  - `src/lib/supabase/middleware.ts` - Middleware (correctly configured)

### 3. Migration Files Prepared
- ✅ All migration files are ready in `supabase/migrations/`:
  1. ✅ Create base schema (profiles, courts, bookings)
  2. ✅ Enable public access to courts
  3. ✅ Add club owner system
  4. ✅ Fix profile RLS policies

### 4. Helper Files Created
- ✅ `complete-migration.sql` - Single file with all migrations
- ✅ `run-migrations-pg.js` - Node.js migration runner
- ✅ `MIGRATION_INSTRUCTIONS.md` - Detailed setup guide
- ✅ `SETUP_SUMMARY.md` - This file

### 5. Dependencies Installed
- ✅ `pg` package installed for database connections

## ⏳ Next Step: Run the Migration (Required)

**The database tables have NOT been created yet.** You need to run the migrations manually.

### 🚀 Quick Action Required

**Option 1: Use Supabase Dashboard (Recommended - 2 minutes)**

1. Open: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new
2. Open file: `complete-migration.sql`
3. Copy all contents and paste into SQL Editor
4. Click "Run" button
5. Done! ✨

**Option 2: Using Command Line (If you have DB password)**

If you have your database password, add it to `.env`:
```bash
echo "SUPABASE_DB_PASSWORD=your_password_here" >> .env
```

Then run:
```bash
node run-migrations-pg.js
```

## 📊 Database Schema Overview

### Tables to be Created

**profiles**
```sql
- id (uuid, primary key) → links to auth.users
- full_name (text, required)
- phone (text, optional)
- avatar_url (text, optional)
- user_role (text) → 'user' or 'club_owner'
- club_name (text, optional)
- club_description (text, optional)
- created_at, updated_at (timestamptz)
```

**courts**
```sql
- id (uuid, primary key)
- name, sport_type, description
- address, latitude, longitude
- price_per_hour (numeric)
- rating (numeric)
- photo_url, amenities (array)
- opening_time, closing_time
- owner_id (uuid) → links to profiles
- club_location (text)
- created_at, updated_at
```

**bookings**
```sql
- id (uuid, primary key)
- user_id (uuid) → links to profiles
- court_id (uuid) → links to courts
- booking_date, start_time, end_time
- status ('confirmed' or 'cancelled')
- total_price
- created_at, cancelled_at
```

### Security (Row Level Security)

**Profiles:**
- ✅ Users can view/edit their own profile
- ✅ Users can insert their profile on signup
- ✅ All authenticated users can view other profiles

**Courts:**
- ✅ Anyone (even anonymous) can view courts
- ✅ Club owners can create/edit/delete their own courts

**Bookings:**
- ✅ Users can only see their own bookings
- ✅ Users can create bookings for themselves
- ✅ Club owners can see all bookings for their courts

### Sample Data Included

6 sample courts will be created:
- Arena Sport Center (Futebol) - R$ 150/hour
- Quadra Central de Tênis - R$ 120/hour
- Beach Vôlei Sunset - R$ 100/hour
- Basket Pro Arena - R$ 130/hour
- Futsal Champions - R$ 110/hour
- Padel Elite - R$ 140/hour

## 🧪 Testing After Migration

### 1. Verify Tables Created
```bash
# Check if tables exist
curl -X GET "https://hegqofubmkhmwjvpssdi.supabase.co/rest/v1/courts?select=*&limit=5" \
  -H "apikey: your_anon_key"
```

Expected: Should return 6 courts

### 2. Start Development Server
```bash
npm run dev
```

Visit: http://localhost:3000

### 3. Test User Flow
1. Visit `/auth` - Sign up with email/password
2. Visit `/courts` - Should see 6 sample courts
3. Visit `/bookings` - Should see empty bookings page
4. Visit `/profile` - Should see your profile

### 4. Test Club Owner Flow
1. Sign up as a new user
2. Manually update your profile in Supabase dashboard:
   ```sql
   UPDATE profiles 
   SET user_role = 'club_owner', 
       club_name = 'Test Club',
       club_description = 'Test description'
   WHERE id = 'your_user_id';
   ```
3. Visit `/owner/courts` - Should be able to create courts
4. Visit `/owner/reservations` - Should see bookings for your courts

## 📁 Important Files

### Configuration
- `.env` - Environment variables (DO NOT commit to git)
- `package.json` - Project dependencies

### Database
- `supabase/migrations/*.sql` - Individual migration files
- `complete-migration.sql` - All migrations in one file
- `run-migrations-pg.js` - Automated migration runner

### Documentation
- `MIGRATION_INSTRUCTIONS.md` - Detailed migration guide
- `SETUP_SUMMARY.md` - This file
- `README.md` - Project readme

### Application Code
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/supabase/middleware.ts` - Auth middleware

## 🔒 Security Notes

### Environment Variables
The `.env` file contains sensitive credentials:
- ✅ Already in `.gitignore` (won't be committed)
- ⚠️ Service role key has FULL access - keep it secret!
- ✅ Anon key is safe for client-side use

### Row Level Security (RLS)
- ✅ All tables have RLS enabled
- ✅ Users can only access their own data
- ✅ Public data (courts) is read-only
- ✅ No bypassing security rules from client

## 🐛 Troubleshooting

### "Could not find table" error
➡️ **Solution:** Migrations haven't been run yet. Follow steps in [Next Step](#-next-step-run-the-migration-required)

### "Policy does not exist" error
➡️ **Solution:** Normal if running migration again. Migrations handle this with `IF EXISTS` clauses

### "Auth user not found" error
➡️ **Solution:** Make sure you're signed in. Visit `/auth` to sign up/login

### Connection errors
➡️ **Solution:** Check that `.env` file exists and has correct credentials

## ✨ Success Checklist

Before considering setup complete:

- [ ] Migrations run without errors
- [ ] Tables visible in Supabase Table Editor
- [ ] 6 sample courts exist in database
- [ ] Development server starts (`npm run dev`)
- [ ] Can sign up/login at `/auth`
- [ ] Can view courts at `/courts`
- [ ] Can view profile at `/profile`
- [ ] Can create bookings (signed in users)
- [ ] Club owners can manage courts

## 🚀 Quick Start After Migration

```bash
# Start development server
npm run dev

# Visit your app
open http://localhost:3000
```

## 📞 Need Help?

- Supabase Dashboard: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi
- SQL Editor: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new
- Table Editor: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/editor
- Logs: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/logs/explorer

---

**Current Status:** ⏳ Waiting for migrations to be run

**Next Action:** [Run the migration](#-next-step-run-the-migration-required)

