# QuadraJá - Sports Court Booking Platform

A modern sports court booking platform built with Next.js and Supabase.

## 🚀 Quick Start

### Database Migrations

This project uses **Supabase CLI** for database migrations with automated GitHub Actions deployment.

**👉 [START HERE - Complete Setup Guide](START_HERE.md)**

**Quick setup:**
```bash
# 1. Install dependencies (includes Supabase CLI)
npm install

# 2. Start Docker Desktop (if not running)
open -a Docker

# 3. Start local Supabase
npm run db:start

# 4. Apply migrations
npm run db:push

# 5. Start Next.js
npm run dev
```

**No global installation needed!** Supabase CLI is included as a dev dependency.

**First time?** → See **[FIRST_TIME_SETUP.md](FIRST_TIME_SETUP.md)** for detailed setup guide.

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

### Local Development with Supabase (Recommended)

For a complete local development environment:

```bash
# Install dependencies
npm install

# Install Docker Desktop
brew install --cask docker

# Start local Supabase
npm run db:start

# Run migrations locally
npm run db:push

# Open Studio UI
npm run db:studio

# Run Next.js
npm run dev
```

See **[LOCAL_DEVELOPMENT_SETUP.md](LOCAL_DEVELOPMENT_SETUP.md)** or **[NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md)** for complete guides.

## 📚 Documentation

- **[FIRST_TIME_SETUP.md](FIRST_TIME_SETUP.md)** - 🆕 First time setup (start here!)
- **[NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md)** - ⭐ NPM scripts reference (no global CLI!)
- **[START_HERE.md](START_HERE.md)** - Main setup guide
- **[QUICK_START_SUPABASE_CLI.md](QUICK_START_SUPABASE_CLI.md)** - 5-minute quickstart
- **[LOCAL_DEVELOPMENT_SETUP.md](LOCAL_DEVELOPMENT_SETUP.md)** - Local dev with Docker
- **[SUPABASE_CLI_SETUP.md](SUPABASE_CLI_SETUP.md)** - Complete Supabase CLI guide

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## 🗃️ Database Migrations

Migrations are automated via GitHub Actions:

1. Create migration: `npm run db:migration:new feature_name`
2. Test locally: `npm run db:push`
3. Deploy: `git push origin main` (automatic!)

**No global CLI needed!** All commands available via npm scripts.

See [NPM_SCRIPTS_GUIDE.md](NPM_SCRIPTS_GUIDE.md) for all available commands.

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📂 Project Structure

```
zape-customers/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   └── lib/              # Utilities and Supabase clients
├── supabase/
│   └── migrations/       # Database migration files
└── .github/
    └── workflows/        # GitHub Actions workflows
```

## 🚀 Deployment

### GitHub Actions (Automated)

Migrations deploy automatically when pushed to `main` branch.

**Required GitHub Secrets:**
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_PROJECT_REF`
- `SUPABASE_DB_PASSWORD`

See [SUPABASE_CLI_SETUP.md](SUPABASE_CLI_SETUP.md) for setup instructions.

### Vercel (Frontend)

The Next.js app can be deployed to Vercel:

```bash
vercel deploy
```

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Guide](https://supabase.com/docs/guides/cli)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test migrations locally
4. Submit a pull request

## 📝 License

[Your License Here]

---

**Ready to start?** → [START_HERE.md](START_HERE.md)
