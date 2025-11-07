# GitHub Secrets Configuration Template

Use this template when setting up GitHub Secrets for the migration pipeline.

## Required Secrets

### 1. SUPABASE_URL
```
Name: SUPABASE_URL
Value: https://[YOUR-PROJECT-REF].supabase.co
```

**Where to find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the "Project URL"

**Example:**
```
https://abcdefghijklmnop.supabase.co
```

---

### 2. SUPABASE_SERVICE_ROLE_KEY
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: [Your service_role key - starts with 'eyJ...']
```

**Where to find:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Find "service_role" key in the "Project API keys" section
5. Click "Reveal" to show the key
6. Copy the entire key

**⚠️ SECURITY WARNING:**
- This key has admin privileges
- Never commit it to your repository
- Never share it publicly
- Rotate it regularly
- Only use it in secure environments (like GitHub Secrets)

**Example format:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSI...
```

---

## Optional Secrets

### 3. SUPABASE_PROJECT_REF (Optional)
```
Name: SUPABASE_PROJECT_REF
Value: [project-ref]
```

**Where to find:**
The project reference is the subdomain of your Supabase URL.

If your URL is `https://abcdefghijklmnop.supabase.co`, then:
```
abcdefghijklmnop
```

---

## How to Add Secrets to GitHub

### Via Web Interface:

1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Enter the secret name (exactly as shown above)
6. Paste the secret value
7. Click **Add secret**
8. Repeat for each secret

### Via GitHub CLI:

```bash
# Install GitHub CLI if you haven't
# https://cli.github.com/

# Login
gh auth login

# Add secrets
gh secret set SUPABASE_URL
# Paste your URL when prompted

gh secret set SUPABASE_SERVICE_ROLE_KEY
# Paste your service role key when prompted

gh secret set SUPABASE_PROJECT_REF
# Paste your project ref when prompted
```

---

## Verification

After adding secrets, verify they're set correctly:

1. Go to Settings → Secrets and variables → Actions
2. You should see:
   - ✅ SUPABASE_URL
   - ✅ SUPABASE_SERVICE_ROLE_KEY
   - ✅ SUPABASE_PROJECT_REF (optional)

3. Secrets will show as "Updated X time ago" but values are hidden

---

## Testing Secrets

To test if secrets are working:

1. Go to **Actions** tab
2. Click **Deploy Database Migrations**
3. Click **Run workflow**
4. Select `main` branch
5. Click **Run workflow**

If secrets are configured correctly, the workflow should:
- ✅ Connect to Supabase
- ✅ List available migrations
- ✅ Complete successfully (even if no new migrations)

If secrets are missing or incorrect:
- ❌ "Missing secrets" error
- ❌ "Connection failed" error
- ❌ "Authentication failed" error

---

## Troubleshooting

### Secret not found error
```
Error: Secret SUPABASE_URL not found
```
**Solution:** Double-check the secret name matches exactly (case-sensitive)

### Invalid secret value
```
Error: Authentication failed
```
**Solution:** 
- Verify you copied the entire key
- Ensure no extra spaces before/after
- Try revealing and re-copying from Supabase dashboard
- Make sure you're using the service_role key, not anon key

### Connection refused
```
Error: Connection refused to postgres
```
**Solution:**
- Verify Supabase project is active
- Check project URL is correct
- Ensure no firewall blocking GitHub IPs
- Verify Supabase service is not in maintenance

---

## Security Checklist

- [ ] Service role key stored only in GitHub Secrets
- [ ] `.env` files are in `.gitignore`
- [ ] No credentials committed to repository
- [ ] Repository secrets have restricted access
- [ ] Environment protection rules enabled (optional)
- [ ] Team members know not to share keys
- [ ] Keys rotated regularly (recommend every 90 days)

---

## Rotation Schedule

**Recommended:** Rotate service role keys every 90 days

To rotate:
1. Generate new service role key in Supabase dashboard
2. Update GitHub Secret with new key
3. Test the workflow
4. Delete old key from Supabase (after confirming new key works)

---

## Additional Security: Environment Protection

For extra security, set up environment protection:

1. Go to Settings → Environments
2. Create environment: `production`
3. Add protection rules:
   - Required reviewers: Select team members
   - Wait timer: 0-30 minutes
   - Deployment branches: `main` only
4. Move secrets to environment-level (optional)

Benefits:
- Requires approval before migrations run
- Adds audit trail
- Prevents accidental deployments
- Better compliance and governance

---

**Once secrets are configured, you're ready to use the automated migration pipeline! 🚀**

