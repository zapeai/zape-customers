-- ============================================================================
-- QuadraJá Complete Database Migration
-- ============================================================================
-- This file contains all migrations in order. Run this in Supabase SQL Editor.
-- URL: https://supabase.com/dashboard/project/hegqofubmkhmwjvpssdi/sql/new
-- ============================================================================

-- ============================================================================
-- Migration 1: Create QuadraJá Schema
-- ============================================================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create courts table
CREATE TABLE IF NOT EXISTS courts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sport_type text NOT NULL,
  description text,
  address text NOT NULL,
  latitude numeric(10, 8) NOT NULL,
  longitude numeric(11, 8) NOT NULL,
  price_per_hour numeric(10, 2) NOT NULL DEFAULT 0,
  rating numeric(3, 2) DEFAULT 0,
  photo_url text,
  amenities text[] DEFAULT '{}',
  opening_time time DEFAULT '06:00:00',
  closing_time time DEFAULT '23:00:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  court_id uuid NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  booking_date date NOT NULL,
  start_time time NOT NULL,
  end_time time NOT NULL,
  status text NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  total_price numeric(10, 2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  cancelled_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Courts policies (public read access for authenticated users)
CREATE POLICY "Authenticated users can view courts"
  ON courts FOR SELECT
  TO authenticated
  USING (true);

-- Bookings policies (private to each user)
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS courts_location_idx ON courts(latitude, longitude);
CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_court_idx ON bookings(court_id);

-- Insert sample courts data
INSERT INTO courts (name, sport_type, description, address, latitude, longitude, price_per_hour, rating, photo_url, amenities) VALUES
  (
    'Arena Sport Center',
    'Futebol',
    'Quadra de futebol society com grama sintética de última geração',
    'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
    -23.561414,
    -46.655881,
    150.00,
    4.8,
    'https://images.pexels.com/photos/1618269/pexels-photo-1618269.jpeg',
    ARRAY['Vestiário', 'Estacionamento', 'Lanchonete', 'Chuveiro']
  ),
  (
    'Quadra Central de Tênis',
    'Tênis',
    'Quadra profissional de tênis com piso rápido',
    'Rua Augusta, 2500 - Jardins, São Paulo - SP',
    -23.556821,
    -46.660238,
    120.00,
    4.5,
    'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg',
    ARRAY['Vestiário', 'Iluminação', 'Arquibancada']
  ),
  (
    'Beach Vôlei Sunset',
    'Vôlei',
    'Quadra de vôlei de praia com areia importada',
    'Av. Atlântica, 500 - Copacabana, Rio de Janeiro - RJ',
    -22.971177,
    -43.182543,
    100.00,
    4.9,
    'https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg',
    ARRAY['Chuveiro', 'Bar', 'Vista para o mar']
  ),
  (
    'Basket Pro Arena',
    'Basquete',
    'Quadra coberta de basquete com piso oficial',
    'Rua dos Esportes, 300 - Moema, São Paulo - SP',
    -23.602411,
    -46.673027,
    130.00,
    4.7,
    'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg',
    ARRAY['Vestiário', 'Ar condicionado', 'Placar eletrônico']
  ),
  (
    'Futsal Champions',
    'Futsal',
    'Quadra de futsal indoor climatizada',
    'Rua das Laranjeiras, 150 - Pinheiros, São Paulo - SP',
    -23.568197,
    -46.682222,
    110.00,
    4.6,
    'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    ARRAY['Vestiário', 'Estacionamento', 'Wi-Fi']
  ),
  (
    'Padel Elite',
    'Padel',
    'Quadra de padel oficial com paredes de vidro',
    'Av. Faria Lima, 2000 - Itaim Bibi, São Paulo - SP',
    -23.578499,
    -46.687056,
    140.00,
    4.9,
    'https://images.pexels.com/photos/5739394/pexels-photo-5739394.jpeg',
    ARRAY['Vestiário', 'Loja de equipamentos', 'Professor disponível']
  )
ON CONFLICT DO NOTHING;

-- ============================================================================
-- Migration 2: Update Courts RLS for Public Access
-- ============================================================================

-- Drop the existing authenticated-only policy
DROP POLICY IF EXISTS "Authenticated users can view courts" ON courts;

-- Create new policy allowing public read access
CREATE POLICY "Anyone can view courts"
  ON courts FOR SELECT
  TO anon, authenticated
  USING (true);

-- ============================================================================
-- Migration 3: Add Club Owner System
-- ============================================================================

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

-- ============================================================================
-- Migration 4: Fix Profiles RLS Insert Policy
-- ============================================================================

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- Migration Complete!
-- ============================================================================

