/*
  # Update Courts RLS for Public Access

  ## Changes
  Allow anonymous (non-authenticated) users to view courts data.
  This enables browsing courts without requiring login.

  ## Security
  - Courts table remains read-only for anonymous users
  - No insert, update, or delete permissions for anonymous users
  - Bookings table remains fully protected (authenticated only)
*/

-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "Authenticated users can view courts" ON courts;

-- Create new policy allowing public read access
CREATE POLICY "Anyone can view courts"
  ON courts FOR SELECT
  TO anon, authenticated
  USING (true);
