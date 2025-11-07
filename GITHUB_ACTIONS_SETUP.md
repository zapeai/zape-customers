# GitHub Actions - Database Migration Pipeline Setup

This guide explains how to set up and use the automated database migration pipeline for deploying Supabase migrations on merge to main.

## 📋 Overview

The pipeline automatically runs your Supabase database migrations when:
- Code is merged to the `main` branch
- Changes are detected in `supabase/migrations/` directory
- You manually trigger the workflow

## 🔧 Prerequisites

Before setting up the pipeline, ensure you have:

1. A Supabase project
2. Admin access to your GitHub repository
3. Your Supabase credentials:
   - Project URL
   - Service Role Key (found in Project Settings → API)

## 🚀 Setup Instructions

### Step 1: Configure GitHub Secrets

You need to add Supabase credentials as GitHub Secrets:

1. **Navigate to Repository Settings**
   - Go to your GitHub repository
   - Click on **Settings** → **Secrets and variables** → **Actions**

2. **Add the following secrets:**

   **Secret 1: `SUPABASE_URL`**
   ```
   Name: SUPABASE_URL
   Value: https://[YOUR-PROJECT-REF].supabase.co
   ```
   *Example: `https://abcdefghijklmnop.supabase.co`*

   **Secret 2: `SUPABASE_SERVICE_ROLE_KEY`**
   ```
   Name: SUPABASE_SERVICE_ROLE_KEY
   Value: [Your service role key from Supabase]
   ```
   *Find this in: Supabase Dashboard → Project Settings → API → service_role key (secret)*

   **Optional Secret: `SUPABASE_PROJECT_REF`** (for environment URL)
   ```
   Name: SUPABASE_PROJECT_REF
   Value: [Your project reference]
   ```
   *This is the part before `.supabase.co` in your URL*

3. **Click "Add secret"** for each one

### Step 2: Set Up GitHub Environment (Optional but Recommended)

For better security and deployment tracking:

1. Go to **Settings** → **Environments**
2. Click **New environment**
3. Name it `production`
4. Configure protection rules:
   - ✅ Required reviewers (optional - for extra safety)
   - ✅ Wait timer (optional - add delay before deployment)
5. Add environment secrets if you want different secrets per environment

### Step 3: Verify Workflow File

The workflow file should be at `.github/workflows/deploy-migrations.yml` (already created).

### Step 4: Test the Pipeline

#### Option A: Automatic Trigger (Recommended)

1. Create a new migration file:
   ```bash
   npm run db:new
   ```

2. Edit the generated migration file in `supabase/migrations/`

3. Commit and push to a feature branch:
   ```bash
   git add supabase/migrations/
   git commit -m "Add new migration: [description]"
   git push origin feature/your-branch
   ```

4. Create a Pull Request and merge to `main`

5. The workflow will automatically trigger!

#### Option B: Manual Trigger

1. Go to **Actions** tab in GitHub
2. Select **Deploy Database Migrations** workflow
3. Click **Run workflow**
4. Select `main` branch
5. Enter a reason (optional)
6. Click **Run workflow**

## 📊 Monitoring Deployments

### View Workflow Runs

1. Go to the **Actions** tab in your repository
2. Click on **Deploy Database Migrations**
3. View the list of workflow runs
4. Click on any run to see detailed logs

### Workflow Steps

The pipeline performs these steps:

1. **📥 Checkout code** - Gets the latest code
2. **🔍 Check for changes** - Determines if migrations changed
3. **📋 List changed files** - Shows what triggered the run
4. **🔧 Setup Node.js** - Prepares the runtime environment
5. **📦 Install dependencies** - Installs required packages
6. **🔐 Prepare environment** - Sets up credentials
7. **🗃️ List migrations** - Shows which migrations will run
8. **🚀 Run migrations** - Executes the migration script
9. **✅ Success/❌ Failure** - Reports the outcome
10. **📝 Summary** - Creates a deployment summary

### Understanding the Output

**Successful Run:**
```
✨ Database migrations completed successfully!
Deployed to: https://your-project.supabase.co
```

**Failed Run:**
```
❌ Database migration failed!
Please check the logs above for details
```

## 🔒 Security Best Practices

### Do's ✅

- ✅ Store all credentials in GitHub Secrets
- ✅ Use environment protection rules for production
- ✅ Review migration files before merging to main
- ✅ Test migrations locally first with `npm run db:migrate`
- ✅ Use descriptive commit messages for migrations
- ✅ Keep the service role key secret and rotate regularly

### Don'ts ❌

- ❌ Never commit `.env` files with real credentials
- ❌ Don't hardcode credentials in workflow files
- ❌ Avoid running destructive migrations without backup
- ❌ Don't skip local testing before merging
- ❌ Never share service role keys in public channels

## 🐛 Troubleshooting

### Problem: Workflow doesn't trigger

**Solution:**
- Verify the workflow file exists at `.github/workflows/deploy-migrations.yml`
- Ensure changes were made to files in `supabase/migrations/`
- Check that you're pushing to the `main` branch
- Verify GitHub Actions are enabled: Settings → Actions → General

### Problem: "Missing secrets" error

**Solution:**
- Verify both secrets are added: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check for typos in secret names
- Ensure secrets have the correct values (no extra spaces)
- Try re-adding the secrets

### Problem: "Connection failed" error

**Solution:**
- Verify your Supabase project is active
- Check that the service role key is correct and not expired
- Ensure your Supabase project allows connections from GitHub's IPs
- Check Supabase dashboard for any service disruptions

### Problem: "Migration already exists" warnings

**Solution:**
- This is normal if migrations were already applied
- The script skips already-applied migrations
- Check the logs to confirm which migrations ran successfully

### Problem: Permission denied errors

**Solution:**
- Verify the service role key has admin privileges
- Check RLS policies aren't blocking the migration
- Ensure you're using the SERVICE_ROLE_KEY, not the ANON_KEY

## 🔄 Workflow Features

### Automatic Features

- ✅ **Concurrency Control**: Only one migration runs at a time
- ✅ **Change Detection**: Only runs when migrations change
- ✅ **Timeout Protection**: Prevents hanging jobs (10 min limit)
- ✅ **Detailed Logging**: Shows each step clearly
- ✅ **Deployment Summary**: Creates a summary on each run
- ✅ **Error Handling**: Provides clear error messages

### Manual Control

- 🎯 Manual workflow dispatch for emergency deployments
- 🎯 Ability to specify reason for manual runs
- 🎯 Can be triggered from any branch (for testing)

## 📝 Creating New Migrations

### Best Practices

1. **Create migration file:**
   ```bash
   npm run db:new
   ```

2. **Write migration SQL:**
   - Use `CREATE TABLE IF NOT EXISTS`
   - Include rollback comments if needed
   - Test locally first

3. **Name migrations clearly:**
   ```
   20251107120000_add_payment_tables.sql
   20251107130000_add_user_preferences.sql
   ```

4. **Test locally:**
   ```bash
   npm run db:migrate
   ```

5. **Commit and push:**
   ```bash
   git add supabase/migrations/
   git commit -m "feat: add payment tables migration"
   git push origin feature/payment-system
   ```

6. **Create PR and merge** - Pipeline runs automatically!

## 🎯 Advanced Configuration

### Modify Trigger Conditions

Edit `.github/workflows/deploy-migrations.yml`:

```yaml
# Run on specific branches
on:
  push:
    branches:
      - main
      - staging  # Add staging branch
      - production  # Add production branch
```

### Add Slack Notifications

Add a step to notify Slack on completion:

```yaml
- name: Notify Slack
  if: always()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "Migration ${{ job.status }}: ${{ github.sha }}"
      }
```

### Run on Schedule

Add scheduled migrations:

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # Run at 2 AM daily
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Supabase CLI Documentation](https://supabase.com/docs/guides/cli)
- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/local-development#database-migrations)

## 🆘 Support

If you encounter issues:

1. Check the workflow logs in GitHub Actions
2. Review the troubleshooting section above
3. Test migrations locally first: `npm run db:migrate`
4. Verify all secrets are correctly configured
5. Check Supabase project status in dashboard

## 📋 Checklist

Before going live with automated migrations:

- [ ] GitHub Secrets configured (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`)
- [ ] Production environment set up (optional but recommended)
- [ ] Workflow file exists at `.github/workflows/deploy-migrations.yml`
- [ ] Test migration created and verified locally
- [ ] Test workflow triggered successfully
- [ ] Team members notified about automation
- [ ] Backup strategy in place
- [ ] Rollback plan documented

---

**Ready to deploy? Merge to main and watch your migrations run automatically! 🚀**

