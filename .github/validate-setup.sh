#!/bin/bash

# GitHub Actions Migration Pipeline - Setup Validator
# This script validates that the GitHub Actions pipeline is properly configured

set -e

echo "🔍 GitHub Actions Migration Pipeline - Setup Validator"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to print colored output
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ERRORS=$((ERRORS + 1))
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
    WARNINGS=$((WARNINGS + 1))
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

echo "📋 Checking local setup..."
echo ""

# 1. Check if workflow file exists
echo "1. Checking workflow file..."
if [ -f ".github/workflows/deploy-migrations.yml" ]; then
    print_success "Workflow file exists"
else
    print_error "Workflow file not found at .github/workflows/deploy-migrations.yml"
fi

# 2. Check if migrations directory exists
echo ""
echo "2. Checking migrations directory..."
if [ -d "supabase/migrations" ]; then
    MIGRATION_COUNT=$(find supabase/migrations -name "*.sql" | wc -l)
    print_success "Migrations directory exists ($MIGRATION_COUNT migration files)"
else
    print_error "Migrations directory not found at supabase/migrations/"
fi

# 3. Check if migration script exists
echo ""
echo "3. Checking migration script..."
if [ -f "run-migrations-pg.js" ]; then
    print_success "Migration script exists (run-migrations-pg.js)"
elif [ -f "run-migrations-final.js" ]; then
    print_success "Migration script exists (run-migrations-final.js)"
else
    print_error "Migration script not found (expected run-migrations-pg.js)"
fi

# 4. Check if .env file exists (should not be committed)
echo ""
echo "4. Checking environment configuration..."
if [ -f ".env" ]; then
    print_warning ".env file exists (ensure it's in .gitignore)"
else
    print_info ".env file not found (good - using GitHub Secrets)"
fi

# 5. Check if .env is in .gitignore
echo ""
echo "5. Checking .gitignore..."
if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        print_success ".env is in .gitignore"
    else
        print_error ".env is not in .gitignore - add it immediately!"
    fi
else
    print_warning ".gitignore not found"
fi

# 6. Check package.json for migration script
echo ""
echo "6. Checking package.json scripts..."
if [ -f "package.json" ]; then
    if grep -q "db:migrate" package.json; then
        print_success "db:migrate script found in package.json"
    else
        print_warning "db:migrate script not found in package.json"
    fi
else
    print_error "package.json not found"
fi

# 7. Check if pg dependency is installed
echo ""
echo "7. Checking Node.js dependencies..."
if [ -f "package.json" ]; then
    if grep -q '"pg"' package.json; then
        print_success "pg dependency found in package.json"
    else
        print_error "pg dependency not found - run: npm install pg"
    fi
fi

# 8. Check if git repository is configured
echo ""
echo "8. Checking Git configuration..."
if [ -d ".git" ]; then
    print_success "Git repository initialized"
    
    # Check if remote is configured
    if git remote -v | grep -q "origin"; then
        REMOTE_URL=$(git remote get-url origin)
        print_success "Git remote configured: $REMOTE_URL"
        
        # Extract repo info if it's a GitHub URL
        if [[ $REMOTE_URL == *"github.com"* ]]; then
            print_info "GitHub repository detected"
        fi
    else
        print_warning "Git remote 'origin' not configured"
    fi
else
    print_error "Not a git repository"
fi

# 9. Check if on main branch
echo ""
echo "9. Checking current branch..."
if [ -d ".git" ]; then
    CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
    if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "master" ]; then
        print_success "On main branch ($CURRENT_BRANCH)"
    else
        print_info "Current branch: $CURRENT_BRANCH"
    fi
fi

# 10. Check GitHub CLI (optional)
echo ""
echo "10. Checking GitHub CLI..."
if command -v gh &> /dev/null; then
    GH_VERSION=$(gh --version | head -n 1)
    print_success "GitHub CLI installed: $GH_VERSION"
    
    # Try to check if authenticated
    if gh auth status &> /dev/null; then
        print_success "GitHub CLI authenticated"
        
        # Try to list secrets (will work if user has permissions)
        echo ""
        echo "📦 Checking GitHub Secrets (requires repo admin access)..."
        
        if gh secret list &> /dev/null; then
            SECRET_LIST=$(gh secret list 2>&1)
            
            if echo "$SECRET_LIST" | grep -q "SUPABASE_URL"; then
                print_success "SUPABASE_URL secret is configured"
            else
                print_error "SUPABASE_URL secret not found in GitHub"
            fi
            
            if echo "$SECRET_LIST" | grep -q "SUPABASE_SERVICE_ROLE_KEY"; then
                print_success "SUPABASE_SERVICE_ROLE_KEY secret is configured"
            else
                print_error "SUPABASE_SERVICE_ROLE_KEY secret not found in GitHub"
            fi
        else
            print_warning "Cannot check secrets (may need admin permissions)"
            print_info "Verify manually: Settings → Secrets → Actions"
        fi
    else
        print_info "GitHub CLI not authenticated (optional)"
    fi
else
    print_info "GitHub CLI not installed (optional, but recommended)"
    print_info "Install: https://cli.github.com/"
fi

# Summary
echo ""
echo "=================================================="
echo "📊 Validation Summary"
echo "=================================================="

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    print_success "All checks passed! ✨"
    echo ""
    echo "🚀 Your GitHub Actions pipeline is ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Configure GitHub Secrets (if not done yet):"
    echo "     - Go to: Settings → Secrets → Actions"
    echo "     - Add: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY"
    echo "  2. Test the pipeline:"
    echo "     - Create a test migration: npm run db:new"
    echo "     - Push to main: git push origin main"
    echo "     - Check Actions tab: GitHub → Actions"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    print_warning "Passed with $WARNINGS warning(s)"
    echo ""
    echo "⚠️  Review the warnings above and fix if necessary"
    exit 0
else
    print_error "Found $ERRORS error(s) and $WARNINGS warning(s)"
    echo ""
    echo "❌ Please fix the errors above before using the pipeline"
    echo ""
    echo "Need help? Check:"
    echo "  - GITHUB_ACTIONS_SETUP.md (full setup guide)"
    echo "  - .github/QUICK_REFERENCE.md (quick commands)"
    exit 1
fi

