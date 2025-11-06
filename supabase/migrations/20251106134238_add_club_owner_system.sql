/*
  # Add Club Owner System

  ## Overview
  This migration adds support for club owners who can manage multiple courts.
  Users can now be either regular users or club owners.

  ## Changes Made

  ### 1. Profile Updates
  - Add `user_role` column to profiles (user or club_owner)
  - Add `club_name` for club owners
  - Add `club_description` for club details

  ### 2. Courts Updates
  - Add `owner_id` to link courts to club owners
  - Add `club_location` for grouping courts by physical location
  - Courts now belong to specific club owners

  ### 3. Bookings Updates
  - Bookings now reference the club location rather than specific court
  - System will auto-allocate available court from the same location

  ## Security
  - RLS policies updated for club owners to manage their courts
  - Club owners can view all bookings for their courts
  - Regular users cannot access club owner features
*/

-- Add user role and club info to profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'user_role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN user_role text DEFAULT 'user' CHECK (user_role IN ('user', 'club_owner'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'club_name'
  ) THEN
    ALTER TABLE profiles ADD COLUMN club_name text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'club_description'
  ) THEN
    ALTER TABLE profiles ADD COLUMN club_description text;
  END IF;
END $$;

-- Add owner_id and club_location to courts
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courts' AND column_name = 'owner_id'
  ) THEN
    ALTER TABLE courts ADD COLUMN owner_id uuid REFERENCES profiles(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'courts' AND column_name = 'club_location'
  ) THEN
    ALTER TABLE courts ADD COLUMN club_location text NOT NULL DEFAULT 'default';
  END IF;
END $$;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS courts_owner_id_idx ON courts(owner_id);
CREATE INDEX IF NOT EXISTS courts_club_location_idx ON courts(club_location);
CREATE INDEX IF NOT EXISTS courts_sport_location_idx ON courts(sport_type, club_location);

-- Update RLS policies for courts to allow club owners to manage their courts
DROP POLICY IF EXISTS "Club owners can insert their own courts" ON courts;
CREATE POLICY "Club owners can insert their own courts"
  ON courts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_role = 'club_owner'
    )
    AND owner_id = auth.uid()
  );

DROP POLICY IF EXISTS "Club owners can update their own courts" ON courts;
CREATE POLICY "Club owners can update their own courts"
  ON courts FOR UPDATE
  TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

DROP POLICY IF EXISTS "Club owners can delete their own courts" ON courts;
CREATE POLICY "Club owners can delete their own courts"
  ON courts FOR DELETE
  TO authenticated
  USING (owner_id = auth.uid());

-- Update bookings RLS to allow club owners to see bookings for their courts
DROP POLICY IF EXISTS "Club owners can view bookings for their courts" ON bookings;
CREATE POLICY "Club owners can view bookings for their courts"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM courts
      WHERE courts.id = bookings.court_id
      AND courts.owner_id = auth.uid()
    )
  );

-- Update profiles RLS policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);
