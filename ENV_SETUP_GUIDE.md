# Environment Variables Setup Guide

This guide explains how to configure environment variables for local and production environments.

## 📁 Environment Files

### `.env.local` - Local Development (Docker)

Used when running `supabase start` with local Supabase.

**Create this file:**
```bash
cp .env.local.example .env.local
```

**Then fill in values from `supabase start` output:**

```bash
# Local Supabase (from 'supabase start' output)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### `.env.production` - Production Supabase

Used when testing against production Supabase.

**Create this file:**
```bash
cp .env.production.example .env.production
```

**Then fill in from Supabase Dashboard:**

```bash
# Production Supabase (from Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://hegqofubmkhmwjvpssdi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 🔄 Switching Between Environments

### Option 1: Use Different Files

```bash
# For local development
cp .env.local .env
npm run dev

# For production testing
cp .env.production .env
npm run dev
```

### Option 2: Use Next.js Environment System

Next.js automatically loads `.env.local` in development:

```bash
# Automatically uses .env.local if it exists
npm run dev
```

For production:
```bash
# Uses .env.production
npm run build
npm start
```

## 🔐 Security Best Practices

### ✅ DO

- ✅ Add `.env`, `.env.local`, `.env.production` to `.gitignore`
- ✅ Keep example files (`.env.local.example`) in git
- ✅ Use different keys for local and production
- ✅ Rotate production keys regularly
- ✅ Never commit real keys to git

### ❌ DON'T

- ❌ Don't commit `.env` files with real values
- ❌ Don't share production keys in chat/email
- ❌ Don't use production keys locally
- ❌ Don't expose service role key in client code
- ❌ Don't hard-code credentials

## 📝 Getting Values

### Local Supabase Keys

Start local Supabase and copy values:

```bash
supabase start
```

Output shows:
```
API URL: http://localhost:54321
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Production Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → `anon` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API keys** → `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 Quick Setup

### For Local Development

```bash
# 1. Start Supabase
supabase start

# 2. Create .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<copy from supabase start output>
SUPABASE_SERVICE_ROLE_KEY=<copy from supabase start output>
EOF

# 3. Run Next.js
npm run dev
```

### For Production Testing

```bash
# 1. Link to production
supabase link --project-ref hegqofubmkhmwjvpssdi

# 2. Create .env.production with real keys from Dashboard

# 3. Use production env
cp .env.production .env
npm run dev
```

## 🔍 Verifying Setup

### Check Current Environment

```javascript
// Add this to any page temporarily
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
```

- **Local**: Should show `http://localhost:54321`
- **Production**: Should show `https://hegqofubmkhmwjvpssdi.supabase.co`

### Test Connection

```bash
# In browser console
console.log(supabase.supabaseUrl);
```

## 📦 Deployment (Vercel)

Don't use `.env` files in production! Set environment variables in Vercel:

1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Production URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Production anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = Production service role key
3. Deploy!

Vercel automatically injects these at build time.

## 🐛 Troubleshooting

### "Failed to fetch" errors

Check your `.env` file:
```bash
cat .env | grep SUPABASE_URL
```

Should match where you're trying to connect.

### "Invalid API key"

Make sure you're using the right keys:
- **Local**: Keys from `supabase start`
- **Production**: Keys from Supabase Dashboard

### "CORS errors"

If using local Supabase, ensure:
- URL is `http://localhost:54321` (not `http://127.0.0.1:54321`)
- Supabase is running (`supabase status`)

## 📋 Checklist

- [ ] Created `.env.local` with local Supabase keys
- [ ] Created `.env.production` with production keys
- [ ] Verified `.env*` is in `.gitignore`
- [ ] Tested local development works
- [ ] Never committed real keys to git
- [ ] Set environment variables in Vercel (for deployment)

## 📚 Related Documentation

- [LOCAL_DEVELOPMENT_SETUP.md](LOCAL_DEVELOPMENT_SETUP.md) - Full local dev guide
- [SUPABASE_CLI_SETUP.md](SUPABASE_CLI_SETUP.md) - Supabase CLI guide
- [START_HERE.md](START_HERE.md) - Main setup guide

---

**🔐 Remember: Never commit real credentials to version control!**

