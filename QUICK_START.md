# 🚀 QuadraJá Quick Start Guide

## ✅ Setup Status

```
✅ Supabase credentials configured
✅ Environment variables set (.env file)
✅ Supabase API connection verified
✅ Migration files prepared
⏳ DATABASE MIGRATION NEEDED (One final step!)
```

## 🎯 Complete Setup in 2 Minutes

### Option 1: Automated (Easiest) 🌟

Run this command in your terminal:

```bash
./setup-database.sh
```

This will:
- ✅ Open SQL Editor in your browser
- ✅ Copy migration SQL to clipboard (on macOS)
- ✅ Guide you through the process

### Option 2: Manual (Quick)

1. **Open SQL Editor:**
   https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new

2. **Copy migration SQL:**
   ```bash
   # macOS
   cat complete-migration.sql | pbcopy
   
   # Linux  
   cat complete-migration.sql | xclip -selection clipboard
   
   # Or just open the file and copy manually
   ```

3. **Paste and Run** in SQL Editor

4. **Done!** ✨

## 🧪 Test Your Setup

After running the migration:

```bash
# Start dev server
npm run dev

# Visit these pages:
# http://localhost:3000          - Homepage
# http://localhost:3000/courts   - Browse courts (should show 6 courts)
# http://localhost:3000/auth     - Sign up/Login
```

## 📊 What You'll Get

After migration completes:

- **3 Tables:** profiles, courts, bookings
- **6 Sample Courts:** Ready to browse and book
- **Security:** Row Level Security (RLS) fully configured
- **Indexes:** Performance optimized
- **Sample Data:** Courts in São Paulo and Rio

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| SQL Editor | https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new |
| Table Editor | https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/editor |
| Auth Users | https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/auth/users |
| API Docs | https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/api |

## 💡 Pro Tips

- **First time?** Use Option 1 (automated script)
- **Already familiar?** Just copy `complete-migration.sql` to SQL Editor
- **Having issues?** Check `MIGRATION_INSTRUCTIONS.md` for troubleshooting

## 📚 Documentation Files

- `QUICK_START.md` (this file) - Quick 2-minute setup
- `SETUP_SUMMARY.md` - Detailed overview
- `MIGRATION_INSTRUCTIONS.md` - Step-by-step migration guide
- `complete-migration.sql` - All migrations in one file

## ✨ After Setup

Your app will have:

```
📱 Features Ready:
  ✅ User authentication (sign up/login)
  ✅ Profile management
  ✅ Browse 6 sample courts
  ✅ Make bookings
  ✅ View your bookings
  ✅ Club owner system (manage courts)
```

---

**Current Status:** Ready for migration ⏳

**Next Action:** Choose Option 1 or 2 above 👆

**Time Required:** ~2 minutes ⏱️

