# 🔮 Handling Future Database Changes

## Quick Answer

When you need to make future database changes:

```bash
# 1. Create a new migration
npm run db:new "description of your change"

# 2. Edit the generated file
# Add your SQL changes to: supabase/migrations/TIMESTAMP_description.sql

# 3. Test it in Supabase SQL Editor
# Copy and paste the SQL to test

# 4. Commit to git
git add supabase/migrations/
git commit -m "Add your change description"

# 5. Deploy to production
# Run the SQL in production Supabase dashboard
```

That's it! ✨

---

## 📚 Complete Workflow

### For Small Changes (Adding a Column, Index, etc.)

```bash
# Step 1: Create migration
npm run db:new "add verified column to profiles"

# Step 2: Edit the file - it will open something like:
# supabase/migrations/20251107150000_add_verified_column_to_profiles.sql

# Add your SQL:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;
CREATE INDEX IF NOT EXISTS profiles_verified_idx ON profiles(verified);

# Step 3: Test in SQL Editor
# https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new

# Step 4: Commit
git add supabase/migrations/
git commit -m "Add verified column to profiles"
git push

# Step 5: Deploy (run the SQL in production)
```

### For Large Features (New Table, Multiple Changes)

```bash
# Step 1: Create migration
npm run db:new "add reviews system"

# Step 2: Add comprehensive SQL (see MIGRATION_EXAMPLES.md for patterns)
# Example: Create table, indexes, RLS policies, triggers

# Step 3: Test thoroughly
# - Test in SQL Editor
# - Verify RLS policies work
# - Check indexes created
# - Test with your app

# Step 4: Document
# Add comments explaining the change
# Document rollback procedure

# Step 5: Commit and deploy
```

---

## 🛠️ Tools Available

### 1. **create-migration.sh** - Create New Migrations

```bash
./create-migration.sh "add reviews table"

# Or using npm:
npm run db:new "add reviews table"
```

**What it does:**
- ✅ Creates timestamped migration file
- ✅ Adds template with TODOs
- ✅ Opens file in your editor
- ✅ Provides helpful next steps

### 2. **setup-database.sh** - Initial Setup Helper

```bash
./setup-database.sh

# Or using npm:
npm run db:setup
```

**Use this for:**
- Setting up database first time
- Helping new developers onboard

### 3. **run-migrations-pg.js** - Automated Migration Runner

```bash
node run-migrations-pg.js

# Or using npm:
npm run db:migrate
```

**Requirements:**
- Need database password in `.env` file
- Add: `SUPABASE_DB_PASSWORD=your_password`

**What it does:**
- Runs all migrations in order
- Handles errors gracefully
- Shows progress

---

## 📖 Documentation Available

### 1. **DATABASE_MIGRATION_GUIDE.md** 
**Complete guide** covering:
- ✅ Best practices
- ✅ Migration patterns
- ✅ Rollback strategies
- ✅ Debugging tips
- ✅ Common pitfalls

### 2. **MIGRATION_EXAMPLES.md**
**Quick reference** with:
- ✅ Copy-paste examples
- ✅ Common patterns (tables, columns, indexes, RLS)
- ✅ Feature additions (reviews, favorites, photos)
- ✅ Performance optimizations

### 3. **MIGRATION_INSTRUCTIONS.md**
**Initial setup guide** for:
- ✅ Running first migrations
- ✅ Troubleshooting setup
- ✅ Verification steps

---

## 🎯 Common Scenarios

### "I need to add a new table"

```bash
# 1. Create migration
npm run db:new "add reviews table"

# 2. Use template from MIGRATION_EXAMPLES.md
# Copy the "Add Reviews System" example

# 3. Customize for your needs

# 4. Test and deploy
```

See: `MIGRATION_EXAMPLES.md` → "Common Feature Additions"

### "I need to add a column"

```bash
# 1. Create migration
npm run db:new "add phone to profiles"

# 2. Add SQL:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;

# 3. Done!
```

See: `MIGRATION_EXAMPLES.md` → "Add a Column"

### "I need to change RLS policies"

```bash
# 1. Create migration
npm run db:new "update court access policies"

# 2. Drop and recreate:
DROP POLICY IF EXISTS "old policy name" ON table_name;
CREATE POLICY "new policy name" ON table_name FOR SELECT ...;

# 3. Test carefully!
```

See: `MIGRATION_EXAMPLES.md` → "RLS Policy Patterns"

### "I need to add an index for performance"

```bash
# 1. Create migration
npm run db:new "add index for court searches"

# 2. Add SQL:
CREATE INDEX IF NOT EXISTS idx_name ON table_name(column_name);

# 3. Deploy
```

See: `MIGRATION_EXAMPLES.md` → "Index Patterns"

### "I made a mistake and need to rollback"

```bash
# 1. Create a new migration to undo the change
npm run db:new "rollback previous change"

# 2. Add SQL to reverse the change:
DROP TABLE IF EXISTS table_you_created;
# or
ALTER TABLE table_name DROP COLUMN column_you_added;

# 3. Deploy the rollback
```

See: `DATABASE_MIGRATION_GUIDE.md` → "Rollback Strategy"

---

## ✅ Best Practices Checklist

Before deploying any migration:

- [ ] Migration file has timestamp in name
- [ ] SQL is idempotent (uses `IF EXISTS`/`IF NOT EXISTS`)
- [ ] Includes helpful comments
- [ ] Tested in SQL Editor
- [ ] RLS policies updated if needed
- [ ] Indexes added for new queries
- [ ] Rollback plan documented
- [ ] Committed to git
- [ ] Reviewed by team (if applicable)

---

## 🚀 Quick Commands Reference

```bash
# Create a new migration
npm run db:new "description"

# Run all migrations (requires DB password)
npm run db:migrate

# Setup database (opens SQL Editor)
npm run db:setup

# Start dev server
npm run dev
```

---

## 📂 File Organization

```
/Users/guilhermesouzagoncalves/Dev/zapeai/zape-customers/
├── supabase/
│   └── migrations/           # All your migrations go here
│       ├── 20251106130020_create_quadra_ja_schema.sql
│       ├── 20251106131138_update_courts_rls_for_public_access.sql
│       ├── 20251106134238_add_club_owner_system.sql
│       ├── 20251106140026_fix_profiles_rls_insert_policy.sql
│       └── [future migrations...]
│
├── create-migration.sh       # Helper to create new migrations
├── run-migrations-pg.js      # Automated migration runner
├── setup-database.sh         # Initial setup helper
│
├── DATABASE_MIGRATION_GUIDE.md    # Complete guide
├── MIGRATION_EXAMPLES.md          # Copy-paste examples
├── MIGRATION_INSTRUCTIONS.md      # Setup guide
└── FUTURE_CHANGES.md             # This file
```

---

## 💡 Pro Tips

1. **Keep migrations small and focused**
   - One logical change per migration
   - Easier to test and rollback

2. **Always use IF EXISTS/IF NOT EXISTS**
   - Makes migrations idempotent
   - Safe to run multiple times

3. **Test before deploying**
   - Use SQL Editor to test first
   - Verify with your app locally

4. **Document your changes**
   - Add comments to SQL
   - Explain WHY, not just WHAT

5. **Version control everything**
   - Commit migrations to git
   - Never modify committed migrations

6. **Keep a rollback plan**
   - Document how to undo changes
   - Test rollbacks in development

---

## 🆘 Getting Help

### Documentation
- `DATABASE_MIGRATION_GUIDE.md` - Comprehensive guide
- `MIGRATION_EXAMPLES.md` - Quick examples
- [Supabase Docs](https://supabase.com/docs/guides/database)

### Tools
- SQL Editor: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new
- Table Editor: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/editor
- Logs: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/logs/explorer

### Common Issues
- **"Table already exists"** - Add `IF NOT EXISTS` to CREATE statements
- **"Policy already exists"** - Add `IF EXISTS` to DROP statements
- **"RLS prevents access"** - Check your policies with `SELECT * FROM pg_policies`
- **"Connection failed"** - Verify `.env` has correct credentials

---

## 🎓 Learning Path

1. **Start Simple**
   - Add a column
   - Create an index
   - Update existing data

2. **Progress to Complex**
   - Create new tables
   - Add relationships
   - Implement RLS policies

3. **Master Advanced**
   - Create triggers
   - Write functions
   - Optimize queries

---

## ✨ Summary

**For future database changes:**

1. 🔧 **Create**: `npm run db:new "description"`
2. ✏️ **Edit**: Add your SQL to the generated file
3. 🧪 **Test**: Run in SQL Editor
4. 💾 **Commit**: `git add` and `git commit`
5. 🚀 **Deploy**: Run in production

**Need help?** Check:
- `MIGRATION_EXAMPLES.md` for copy-paste patterns
- `DATABASE_MIGRATION_GUIDE.md` for detailed guidance

**That's it!** You're ready to handle any future database changes. 🎉

---

**Questions?** Everything is documented in the files above. Happy coding! 🚀

