# GitHub Actions Badge Template

Add this workflow status badge to your README.md to show the deployment status.

## 📛 Badge Templates

### Option 1: Simple Badge
Replace `USERNAME` and `REPO` with your GitHub username and repository name:

```markdown
![Deploy Migrations](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml/badge.svg)
```

### Option 2: Badge with Branch
Show status for main branch specifically:

```markdown
![Deploy Migrations](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml/badge.svg?branch=main)
```

### Option 3: Badge with Link
Make the badge clickable to view workflow runs:

```markdown
[![Deploy Migrations](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml)
```

### Option 4: Custom Style Badge (shields.io)
More styling options:

```markdown
[![Database Migrations](https://img.shields.io/github/actions/workflow/status/USERNAME/REPO/deploy-migrations.yml?branch=main&label=migrations&logo=github)](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml)
```

## 📋 Full README Section Template

Copy this entire section to your README.md:

```markdown
## 🗃️ Database Migrations

This project uses automated database migrations with GitHub Actions.

[![Deploy Migrations](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml)

### Quick Start

```bash
# Create new migration
npm run db:new

# Test locally
npm run db:migrate

# Deploy (push to main)
git add supabase/migrations/
git commit -m "feat: add new migration"
git push origin main
```

### Features

- ✅ Automatic deployment on merge to main
- ✅ Safe migration execution with error handling
- ✅ Detailed deployment logs and summaries
- ✅ Concurrency control to prevent conflicts
- ✅ Manual trigger option for emergency deployments

### Documentation

- [Setup Guide](GITHUB_ACTIONS_SETUP.md) - Complete setup instructions
- [Quick Reference](.github/QUICK_REFERENCE.md) - Common commands and workflows
- [Deployment Summary](DEPLOYMENT_PIPELINE_SUMMARY.md) - Overview of the pipeline

### Monitoring

View deployment status and history in the [Actions tab](https://github.com/USERNAME/REPO/actions/workflows/deploy-migrations.yml).
```

## 🎨 Badge Preview

The badge will show:

- ✅ **Green "passing"** - Last migration succeeded
- ❌ **Red "failing"** - Last migration failed
- 🟡 **Yellow "running"** - Migration in progress
- ⚪ **Gray "no status"** - No runs yet

## 📍 Where to Place Badge

Common locations in README.md:

### 1. At the top (with other badges)
```markdown
# Project Name

![Build](https://github.com/user/repo/actions/workflows/build.yml/badge.svg)
![Deploy Migrations](https://github.com/user/repo/actions/workflows/deploy-migrations.yml/badge.svg)
![Tests](https://github.com/user/repo/actions/workflows/test.yml/badge.svg)
```

### 2. In a badges section
```markdown
## Badges

| Build | Deploy | Migrations | Tests |
|-------|--------|------------|-------|
| ![Build](https://github.com/user/repo/actions/workflows/build.yml/badge.svg) | ![Deploy](https://github.com/user/repo/actions/workflows/deploy.yml/badge.svg) | ![Migrations](https://github.com/user/repo/actions/workflows/deploy-migrations.yml/badge.svg) | ![Tests](https://github.com/user/repo/actions/workflows/test.yml/badge.svg) |
```

### 3. In the database section
```markdown
## Database

[![Database Migrations](https://github.com/user/repo/actions/workflows/deploy-migrations.yml/badge.svg)](https://github.com/user/repo/actions/workflows/deploy-migrations.yml)

Our database migrations are automatically deployed using GitHub Actions.
```

## 🔗 Getting Your URLs

### Find Your Repository Info:

1. **GitHub Username**: Your GitHub profile name
   - Example: `octocat`

2. **Repository Name**: Your repo name
   - Example: `my-awesome-app`

3. **Full Badge URL**:
   ```
   https://github.com/octocat/my-awesome-app/actions/workflows/deploy-migrations.yml/badge.svg
   ```

### Quick Copy Template

Replace these placeholders:
- `[USERNAME]` - Your GitHub username
- `[REPO]` - Your repository name

```markdown
[![Deploy Migrations](https://github.com/[USERNAME]/[REPO]/actions/workflows/deploy-migrations.yml/badge.svg)](https://github.com/[USERNAME]/[REPO]/actions/workflows/deploy-migrations.yml)
```

## 💡 Pro Tips

### Multiple Badges
Show different metrics:

```markdown
![Migrations](https://github.com/user/repo/actions/workflows/deploy-migrations.yml/badge.svg)
![Uptime](https://img.shields.io/uptimerobot/ratio/7/m789780716-40bb63d15e0d91a3c94c8e73)
![License](https://img.shields.io/github/license/user/repo)
```

### Custom Colors
Use shields.io for custom colors:

```markdown
![Migrations](https://img.shields.io/github/actions/workflow/status/user/repo/deploy-migrations.yml?style=flat-square&logo=postgresql&logoColor=white&label=database&color=blue)
```

### Dynamic Status Message

```markdown
[![Migrations](https://github.com/user/repo/actions/workflows/deploy-migrations.yml/badge.svg)](https://github.com/user/repo/actions/workflows/deploy-migrations.yml)

*Database migrations are automatically deployed when changes are merged to main.*
```

## 📊 Advanced Badge Options (shields.io)

Visit [shields.io](https://shields.io/) for more options:

```markdown
![Migrations](https://img.shields.io/github/actions/workflow/status/USER/REPO/deploy-migrations.yml?
  branch=main&
  style=for-the-badge&
  logo=github&
  label=Migrations&
  color=success)
```

**Style options:**
- `flat` (default)
- `flat-square`
- `plastic`
- `for-the-badge`
- `social`

**Logo options:**
- `github`
- `postgresql`
- `supabase`
- `database`
- [More at simple-icons.org](https://simpleicons.org/)

## 🎉 Example README

Here's a complete example:

```markdown
# QuadraJá - Sports Court Booking App

[![Deploy Migrations](https://github.com/myuser/quadra-ja/actions/workflows/deploy-migrations.yml/badge.svg)](https://github.com/myuser/quadra-ja/actions/workflows/deploy-migrations.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern platform for booking sports courts in Brazil.

## Features

- 🎯 Real-time court availability
- 📅 Easy booking management
- 💳 Secure payment processing
- 📱 Mobile-responsive design

## Database

Database migrations are automatically deployed using GitHub Actions when changes are merged to main.

[View deployment history →](https://github.com/myuser/quadra-ja/actions/workflows/deploy-migrations.yml)

## Documentation

- [Setup Guide](GITHUB_ACTIONS_SETUP.md)
- [API Docs](docs/API.md)
- [Contributing](CONTRIBUTING.md)
```

---

**Ready to add the badge? Copy one of the templates above and update with your repository details!**

