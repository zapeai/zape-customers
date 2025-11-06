#!/bin/bash

# QuadraJá - Create New Migration Script
# Usage: ./create-migration.sh "description of change"

# Check if description provided
if [ -z "$1" ]; then
    echo "❌ Error: Migration description required"
    echo ""
    echo "Usage:"
    echo "  ./create-migration.sh \"description of change\""
    echo ""
    echo "Examples:"
    echo "  ./create-migration.sh \"add reviews table\""
    echo "  ./create-migration.sh \"add verified column to profiles\""
    echo "  ./create-migration.sh \"update bookings rls policies\""
    exit 1
fi

# Get description and sanitize it
DESCRIPTION=$1
SANITIZED=$(echo "$DESCRIPTION" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_//;s/_$//')

# Generate timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Create filename
FILENAME="${TIMESTAMP}_${SANITIZED}.sql"
FILEPATH="supabase/migrations/${FILENAME}"

# Check if migrations directory exists
if [ ! -d "supabase/migrations" ]; then
    echo "❌ Error: supabase/migrations directory not found"
    echo "Are you in the project root directory?"
    exit 1
fi

# Create migration file with template
cat > "$FILEPATH" << EOF
/*
  # ${DESCRIPTION}

  ## Changes
  - TODO: Describe what this migration does

  ## Why
  - TODO: Explain why this change is needed

  ## Security
  - TODO: Document RLS policy changes (if any)

  ## Rollback
  - TODO: Document how to undo this migration if needed
    Example: To rollback, create new migration with:
    -- DROP TABLE IF EXISTS new_table_name;
*/

-- ============================================
-- TODO: Add your SQL migration here
-- ============================================

-- Example: Create a new table
-- CREATE TABLE IF NOT EXISTS new_table (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   name text NOT NULL,
--   created_at timestamptz DEFAULT now()
-- );

-- Example: Add a new column
-- ALTER TABLE existing_table 
-- ADD COLUMN IF NOT EXISTS new_column text;

-- Example: Create an index
-- CREATE INDEX IF NOT EXISTS idx_name ON table_name(column_name);

-- Example: Enable RLS and add policies
-- ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Policy name"
--   ON new_table FOR SELECT
--   TO authenticated
--   USING (true);

-- ============================================
-- End of migration
-- ============================================
EOF

echo "✅ Migration file created successfully!"
echo ""
echo "📄 File: $FILEPATH"
echo ""
echo "📝 Next steps:"
echo "   1. Open the file and replace TODOs with your SQL"
echo "   2. Test locally by running in Supabase SQL Editor"
echo "   3. Commit to version control"
echo "   4. Deploy to production"
echo ""
echo "🔗 Quick links:"
echo "   Edit file:   code $FILEPATH"
echo "   SQL Editor:  https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new"
echo ""
echo "📚 For more help, see: DATABASE_MIGRATION_GUIDE.md"
echo ""

# Offer to open in editor (macOS/Linux)
if command -v code > /dev/null; then
    read -p "Open in VS Code now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        code "$FILEPATH"
    fi
elif command -v vim > /dev/null; then
    read -p "Open in vim now? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vim "$FILEPATH"
    fi
fi

echo "✨ Happy coding!"

