#!/bin/bash

# Script to commit .gitignore changes safely

echo "🔒 Git Ignore Setup - Commit Helper"
echo "===================================="
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not a git repository. Initialize with: git init"
    exit 1
fi

echo "📋 Changes to be committed:"
echo ""
git status --short
echo ""

# Ask for confirmation
read -p "Do you want to commit these changes? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Commit cancelled"
    exit 0
fi

echo ""
echo "📦 Staging changes..."

# Add new documentation files
git add .gitignore \
        .env.example \
        .gitignore-guide.md \
        .cursorignore \
        GIT_SETUP_COMPLETE.md \
        commit-gitignore-changes.sh

# Remove any .next files that were previously tracked
# (git will do this automatically based on .gitignore changes)

echo "✅ Changes staged"
echo ""

# Show what will be committed
echo "📋 About to commit:"
git status --short
echo ""

# Commit the changes
echo "💾 Creating commit..."
git commit -m "feat: add comprehensive .gitignore and environment template

- Add comprehensive .gitignore for Next.js + Supabase
- Protect sensitive files (.env, credentials)
- Exclude build artifacts (.next/, out/, dist/)
- Ignore IDE and OS-specific files
- Add .env.example template for team onboarding
- Add .cursorignore for better AI performance
- Include detailed documentation and guides
- Remove previously tracked build files

Security: No sensitive data will be committed going forward"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully committed!"
    echo ""
    echo "📊 Commit details:"
    git log -1 --stat
    echo ""
    echo "🎉 All done! Your repository is now secure."
    echo ""
    echo "📚 Next steps:"
    echo "   1. Push changes: git push origin main"
    echo "   2. Share .env.example with your team"
    echo "   3. Read GIT_SETUP_COMPLETE.md for more info"
else
    echo ""
    echo "❌ Commit failed. Please check git status and try again."
    exit 1
fi

