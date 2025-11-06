# 📚 Migration Examples - Quick Reference

Common migration patterns you can copy and adapt for your needs.

## 🔧 Table Operations

### Create a New Table

```sql
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS reviews_court_id_idx ON reviews(court_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);

-- Enable RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
```

### Add a Column

```sql
-- Simple column
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS verified boolean DEFAULT false;

-- Column with check constraint
ALTER TABLE courts 
ADD COLUMN IF NOT EXISTS max_capacity int CHECK (max_capacity > 0);

-- Add index if needed for queries
CREATE INDEX IF NOT EXISTS profiles_verified_idx ON profiles(verified);
```

### Rename a Column

```sql
ALTER TABLE courts 
RENAME COLUMN price_per_hour TO hourly_rate;
```

### Drop a Column

```sql
-- Be careful! Make sure nothing references this column
ALTER TABLE courts 
DROP COLUMN IF EXISTS old_column_name;
```

### Add a Unique Constraint

```sql
-- Single column
ALTER TABLE profiles 
ADD CONSTRAINT profiles_phone_unique UNIQUE (phone);

-- Multiple columns (composite)
ALTER TABLE reviews 
ADD CONSTRAINT reviews_user_court_unique UNIQUE (user_id, court_id);
```

---

## 🔐 RLS Policy Patterns

### Public Read, Authenticated Write

```sql
-- Anyone can view
CREATE POLICY "Anyone can view courts"
  ON courts FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can create courts"
  ON courts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);
```

### Owner-Only Access

```sql
-- Users can only see their own data
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can only edit their own data
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
```

### Conditional Access

```sql
-- Only club owners can create courts
CREATE POLICY "Club owners can create courts"
  ON courts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_role = 'club_owner'
    )
  );
```

### Related Table Access

```sql
-- Court owners can see bookings for their courts
CREATE POLICY "Court owners can view their bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courts
      WHERE courts.id = bookings.court_id
      AND courts.owner_id = auth.uid()
    )
  );
```

---

## 📊 Index Patterns

### Single Column Index

```sql
CREATE INDEX IF NOT EXISTS idx_bookings_date 
ON bookings(booking_date);
```

### Multi-Column Index

```sql
-- For queries that filter by both columns
CREATE INDEX IF NOT EXISTS idx_bookings_court_date 
ON bookings(court_id, booking_date);
```

### Partial Index

```sql
-- Only index confirmed bookings
CREATE INDEX IF NOT EXISTS idx_confirmed_bookings 
ON bookings(court_id, booking_date) 
WHERE status = 'confirmed';
```

### GIN Index (for arrays/JSON)

```sql
-- For searching in amenities array
CREATE INDEX IF NOT EXISTS idx_courts_amenities 
ON courts USING GIN(amenities);
```

### Text Search Index

```sql
-- For full-text search on court names
CREATE INDEX IF NOT EXISTS idx_courts_name_search 
ON courts USING GIN(to_tsvector('portuguese', name));
```

---

## 🔄 Data Manipulation

### Update Existing Data

```sql
-- Simple update
UPDATE courts 
SET rating = 4.5 
WHERE rating IS NULL;

-- Conditional update
UPDATE profiles 
SET verified = true 
WHERE user_role = 'club_owner' 
AND created_at < NOW() - INTERVAL '30 days';
```

### Backfill New Column

```sql
-- Add column
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS duration_hours decimal(4,2);

-- Calculate and set values
UPDATE bookings 
SET duration_hours = EXTRACT(EPOCH FROM (end_time - start_time)) / 3600
WHERE duration_hours IS NULL;
```

### Copy Data Between Tables

```sql
-- Insert data from another table
INSERT INTO new_table (column1, column2)
SELECT old_column1, old_column2
FROM old_table
WHERE condition = true
ON CONFLICT DO NOTHING;
```

---

## 🚀 Performance Optimizations

### Add Foreign Key

```sql
ALTER TABLE bookings 
ADD CONSTRAINT fk_bookings_court 
FOREIGN KEY (court_id) 
REFERENCES courts(id) 
ON DELETE CASCADE;
```

### Add Check Constraint

```sql
-- Ensure valid time range
ALTER TABLE bookings 
ADD CONSTRAINT check_time_range 
CHECK (start_time < end_time);

-- Ensure positive price
ALTER TABLE courts 
ADD CONSTRAINT check_positive_price 
CHECK (price_per_hour >= 0);
```

### Create Trigger for Updated_At

```sql
-- Create function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_courts_updated_at
  BEFORE UPDATE ON courts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## 🎯 Common Feature Additions

### Add Reviews System

```sql
-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(court_id, user_id) -- One review per user per court
);

-- Indexes
CREATE INDEX IF NOT EXISTS reviews_court_id_idx ON reviews(court_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);

-- RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Update court ratings (trigger)
CREATE OR REPLACE FUNCTION update_court_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE courts
  SET rating = (
    SELECT AVG(rating)::numeric(3,2)
    FROM reviews
    WHERE court_id = NEW.court_id
  )
  WHERE id = NEW.court_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_court_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_court_rating();
```

### Add Favorites System

```sql
-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  court_id uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, court_id)
);

-- Index
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON favorites(user_id);

-- RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can add favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can remove favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

### Add Photo Gallery

```sql
-- Create photos table
CREATE TABLE IF NOT EXISTS court_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  photo_url text NOT NULL,
  caption text,
  display_order int DEFAULT 0,
  is_primary boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS court_photos_court_id_idx ON court_photos(court_id);
CREATE INDEX IF NOT EXISTS court_photos_display_order_idx ON court_photos(court_id, display_order);

-- RLS
ALTER TABLE court_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos"
  ON court_photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Court owners can manage photos"
  ON court_photos FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM courts
      WHERE courts.id = court_photos.court_id
      AND courts.owner_id = auth.uid()
    )
  );
```

### Add Notifications System

```sql
-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL CHECK (type IN ('booking', 'review', 'system')),
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_unread_idx ON notifications(user_id, read) WHERE read = false;

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());
```

---

## 🧪 Testing Migrations

### Check Table Structure

```sql
-- View table columns
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_name = 'your_table'
ORDER BY ordinal_position;
```

### Check Constraints

```sql
-- View all constraints
SELECT
  con.conname AS constraint_name,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
WHERE rel.relname = 'your_table';
```

### Check Indexes

```sql
-- View all indexes
SELECT
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'your_table';
```

### Check RLS Policies

```sql
-- View all policies
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'your_table';
```

---

## 💡 Pro Tips

### Use Transactions for Complex Migrations

```sql
BEGIN;

-- Your migration statements here
CREATE TABLE ...;
ALTER TABLE ...;
CREATE POLICY ...;

-- If everything looks good
COMMIT;

-- If something went wrong
-- ROLLBACK;
```

### Safe Column Type Changes

```sql
-- Add new column
ALTER TABLE courts ADD COLUMN new_price numeric(10,2);

-- Copy data with conversion
UPDATE courts SET new_price = price_per_hour::numeric(10,2);

-- Drop old column
ALTER TABLE courts DROP COLUMN price_per_hour;

-- Rename new column
ALTER TABLE courts RENAME COLUMN new_price TO price_per_hour;
```

### Batch Updates for Large Tables

```sql
-- Update in batches to avoid locking
DO $$
DECLARE
  batch_size INT := 1000;
  rows_updated INT;
BEGIN
  LOOP
    UPDATE your_table
    SET new_column = 'value'
    WHERE id IN (
      SELECT id 
      FROM your_table
      WHERE new_column IS NULL
      LIMIT batch_size
    );
    
    GET DIAGNOSTICS rows_updated = ROW_COUNT;
    EXIT WHEN rows_updated = 0;
    
    RAISE NOTICE 'Updated % rows', rows_updated;
    PERFORM pg_sleep(0.1); -- Brief pause
  END LOOP;
END $$;
```

---

## 📖 Quick Workflow

1. **Create migration file:**
   ```bash
   ./create-migration.sh "add reviews table"
   ```

2. **Edit the file:** Add your SQL using patterns above

3. **Test in SQL Editor:**
   https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new

4. **Commit:**
   ```bash
   git add supabase/migrations/
   git commit -m "Add reviews table"
   ```

5. **Deploy:** Run the migration on production

---

**Need more examples?** Check out:
- `DATABASE_MIGRATION_GUIDE.md` - Full guide
- `supabase/migrations/` - Existing migrations
- [Supabase Docs](https://supabase.com/docs/guides/database)

Happy migrating! 🚀

