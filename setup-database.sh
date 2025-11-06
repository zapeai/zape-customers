#!/bin/bash

# QuadraJá Database Setup Helper Script
# This script helps you complete the database setup

echo "🚀 QuadraJá Database Setup"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with your Supabase credentials first."
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Check if migration file exists
if [ ! -f complete-migration.sql ]; then
    echo "❌ Error: complete-migration.sql not found!"
    exit 1
fi

echo "✅ Migration file found"
echo ""

# Extract project ref from .env
PROJECT_REF=$(grep NEXT_PUBLIC_SUPABASE_URL .env | cut -d'/' -f3 | cut -d'.' -f1)

if [ -z "$PROJECT_REF" ]; then
    echo "❌ Error: Could not extract project reference from .env"
    exit 1
fi

echo "📍 Supabase Project: $PROJECT_REF"
echo ""

# Display the SQL file location
echo "📄 Migration file ready: complete-migration.sql"
echo ""

# Instructions
echo "🎯 Next Steps:"
echo "======================================"
echo ""
echo "1. I will open the Supabase SQL Editor in your browser"
echo "2. Copy the contents of 'complete-migration.sql'"
echo "3. Paste into the SQL Editor"
echo "4. Click 'Run' to execute"
echo ""
echo "Press ENTER to open SQL Editor in your browser..."
read

# Open SQL Editor
SQL_EDITOR_URL="https://supabase.com/dashboard/project/$PROJECT_REF/sql/new"
echo "🌐 Opening: $SQL_EDITOR_URL"
echo ""

# Try to open in browser (works on macOS, Linux, and WSL)
if command -v open > /dev/null; then
    # macOS
    open "$SQL_EDITOR_URL"
elif command -v xdg-open > /dev/null; then
    # Linux
    xdg-open "$SQL_EDITOR_URL"
elif command -v wslview > /dev/null; then
    # WSL
    wslview "$SQL_EDITOR_URL"
else
    echo "⚠️  Could not open browser automatically."
    echo "Please manually open: $SQL_EDITOR_URL"
fi

echo ""
echo "📋 Copy the migration SQL:"
echo "======================================"
echo ""

# Display first few lines of the migration file
head -20 complete-migration.sql
echo ""
echo "... (see complete-migration.sql for full content)"
echo ""

# Option to copy to clipboard
echo "💡 Quick copy options:"
echo ""
echo "  macOS:   cat complete-migration.sql | pbcopy"
echo "  Linux:   cat complete-migration.sql | xclip -selection clipboard"
echo "  Windows: type complete-migration.sql | clip"
echo ""

# Option to automatically copy (macOS only)
if command -v pbcopy > /dev/null; then
    echo "📋 Copy to clipboard now? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        cat complete-migration.sql | pbcopy
        echo "✅ Copied to clipboard! Now paste into SQL Editor and run."
    fi
fi

echo ""
echo "✨ After running the migration:"
echo "======================================"
echo ""
echo "  1. Verify tables created:"
echo "     https://supabase.com/dashboard/project/$PROJECT_REF/editor"
echo ""
echo "  2. Start development server:"
echo "     npm run dev"
echo ""
echo "  3. Visit your app:"
echo "     http://localhost:3000"
echo ""
echo "🎉 Happy coding!"

