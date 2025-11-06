/*
  # Fix Profiles RLS Insert Policy

  ## Overview
  This migration fixes the RLS policy for the profiles table to allow new users to insert their own profile during signup.

  ## Changes Made

  ### 1. RLS Policies
  - Add policy to allow users to insert their own profile during signup
  - This is critical for the signup flow to work properly

  ## Security
  - Users can only insert their own profile (auth.uid() = id)
  - Cannot insert profiles for other users
*/

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
