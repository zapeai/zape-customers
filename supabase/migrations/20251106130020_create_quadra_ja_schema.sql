/*
  # QuadraJá Database Schema

  ## Overview
  Complete database schema for the QuadraJá sports court booking application.
  Supports user profiles, courts management, and booking system.

  ## New Tables
  
  ### `profiles`
  User profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users.id
  - `full_name` (text) - User's full name
  - `phone` (text, optional) - Contact phone number
  - `avatar_url` (text, optional) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last profile update

  ### `courts`
  Sports courts available for booking
  - `id` (uuid, primary key) - Unique court identifier
  - `name` (text) - Court name
  - `sport_type` (text) - Type of sport (futebol, tênis, vôlei, etc)
  - `description` (text) - Detailed description
  - `address` (text) - Full street address
  - `latitude` (numeric) - Geographic coordinate
  - `longitude` (numeric) - Geographic coordinate
  - `price_per_hour` (numeric) - Hourly rate in BRL
  - `rating` (numeric) - Average rating (0-5)
  - `photo_url` (text) - Main court photo
  - `amenities` (text[]) - Available facilities (chuveiro, estacionamento, etc)
  - `opening_time` (time) - Daily opening time
  - `closing_time` (time) - Daily closing time
  - `created_at` (timestamptz) - Record creation
  - `updated_at` (timestamptz) - Last update

  ### `bookings`
  Court reservations made by users
  - `id` (uuid, primary key) - Unique booking identifier
  - `user_id` (uuid) - References profiles.id
  - `court_id` (uuid) - References courts.id
  - `booking_date` (date) - Date of reservation
  - `start_time` (time) - Booking start time
  - `end_time` (time) - Booking end time
  - `status` (text) - Status: confirmed, cancelled
  - `total_price` (numeric) - Total booking cost
  - `created_at` (timestamptz) - Booking creation time
  - `cancelled_at` (timestamptz, optional) - Cancellation timestamp

  ## Security
  
  ### Row Level Security (RLS)
  All tables have RLS enabled with restrictive policies:
  
  #### profiles table
  - Users can view their own profile
  - Users can update their own profile
  - Users can insert their own profile (on signup)
  
  #### courts table
  - All authenticated users can view courts (public data)
  - Only system admins can modify courts (future feature)
  
  #### bookings table
  - Users can only view their own bookings
  - Users can create bookings for themselves
  - Users can update their own bookings (for cancellation)
  - Users cannot see other users' bookings

  ## Indexes
  - Geographic search on courts (latitude, longitude)
  - Booking date queries for availability checks
  - User booking history queries

  ## Notes
  - All timestamps use timestamptz for proper timezone handling
  - Prices stored as numeric for precision
  - Sport types use text for flexibility (can be enum later)
  - Coordinates use numeric for precision in geolocation
*/

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