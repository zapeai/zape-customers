-- Seed file for local development
-- This file runs automatically after migrations when you run: supabase db reset
-- Use this to populate your local database with test data

-- Note: This only runs on LOCAL development, not production!

-- =====================================================
-- Test Users (Auth)
-- =====================================================
-- First create auth users, then profiles
-- Note: In Supabase, passwords are hashed automatically

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES
  -- Regular users
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'joao@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"João Silva"}',
    false,
    'authenticated'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'maria@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Maria Santos"}',
    false,
    'authenticated'
  ),
  -- Club owners
  (
    '33333333-3333-3333-3333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'carlos@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Carlos Oliveira"}',
    false,
    'authenticated'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'ana@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Ana Costa"}',
    false,
    'authenticated'
  )
ON CONFLICT (id) DO NOTHING;

-- Create identities for the auth users
INSERT INTO auth.identities (
  id,
  user_id,
  provider_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at
) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    '{"sub":"11111111-1111-1111-1111-111111111111","email":"joao@example.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    '{"sub":"22222222-2222-2222-2222-222222222222","email":"maria@example.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    '{"sub":"33333333-3333-3333-3333-333333333333","email":"carlos@example.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    '{"sub":"44444444-4444-4444-4444-444444444444","email":"ana@example.com"}',
    'email',
    NOW(),
    NOW(),
    NOW()
  )
ON CONFLICT (provider_id, provider) DO NOTHING;

-- =====================================================
-- Test User Profiles
-- =====================================================
-- Now create profiles linked to auth.users

INSERT INTO public.profiles (id, full_name, phone, user_role, club_name, club_description, created_at) VALUES
  -- Regular users
  ('11111111-1111-1111-1111-111111111111', 'João Silva', '+55 11 98765-4321', 'user', NULL, NULL, NOW()),
  ('22222222-2222-2222-2222-222222222222', 'Maria Santos', '+55 11 91234-5678', 'user', NULL, NULL, NOW()),
  
  -- Club owners
  ('33333333-3333-3333-3333-333333333333', 'Carlos Oliveira', '+55 11 99999-8888', 'club_owner', 'Arena Sport Center', 'Centro esportivo com quadras de futebol e tênis', NOW()),
  ('44444444-4444-4444-4444-444444444444', 'Ana Costa', '+55 21 98888-7777', 'club_owner', 'Beach Sports Club', 'Complexo esportivo na praia', NOW())
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Test Courts
-- =====================================================
INSERT INTO public.courts (
  id, 
  name, 
  sport_type, 
  description, 
  address, 
  latitude, 
  longitude, 
  price_per_hour, 
  rating,
  amenities,
  owner_id,
  club_location,
  created_at
) VALUES
  -- Courts owned by Carlos (Arena Sport Center)
  (
    'c0000001-0000-0000-0000-000000000001',
    'Quadra 1 - Futebol Society',
    'Futebol',
    'Quadra de futebol society com grama sintética',
    'Av. Paulista, 1000 - São Paulo, SP',
    -23.561414,
    -46.655881,
    150.00,
    4.8,
    ARRAY['Vestiário', 'Estacionamento', 'Chuveiro'],
    '33333333-3333-3333-3333-333333333333',
    'Arena Sport Center - Paulista',
    NOW()
  ),
  (
    'c0000002-0000-0000-0000-000000000002',
    'Quadra 2 - Tênis',
    'Tênis',
    'Quadra de tênis profissional',
    'Av. Paulista, 1000 - São Paulo, SP',
    -23.561414,
    -46.655881,
    120.00,
    4.7,
    ARRAY['Vestiário', 'Iluminação', 'Arquibancada'],
    '33333333-3333-3333-3333-333333333333',
    'Arena Sport Center - Paulista',
    NOW()
  ),
  
  -- Courts owned by Ana (Beach Sports Club)
  (
    'c0000003-0000-0000-0000-000000000003',
    'Quadra Beach Vôlei 1',
    'Vôlei',
    'Quadra de vôlei de praia com areia importada',
    'Av. Atlântica, 500 - Rio de Janeiro, RJ',
    -22.971177,
    -43.182543,
    100.00,
    4.9,
    ARRAY['Chuveiro', 'Bar', 'Vista para o mar'],
    '44444444-4444-4444-4444-444444444444',
    'Beach Sports - Copacabana',
    NOW()
  ),
  (
    'c0000004-0000-0000-0000-000000000004',
    'Quadra Futevôlei',
    'Futevôlei',
    'Quadra de futevôlei na praia',
    'Av. Atlântica, 500 - Rio de Janeiro, RJ',
    -22.971177,
    -43.182543,
    80.00,
    4.6,
    ARRAY['Chuveiro', 'Bar'],
    '44444444-4444-4444-4444-444444444444',
    'Beach Sports - Copacabana',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Test Bookings
-- =====================================================
-- Future bookings for testing
INSERT INTO public.bookings (
  id,
  user_id,
  court_id,
  booking_date,
  start_time,
  end_time,
  total_price,
  status,
  created_at
) VALUES
  -- João's bookings
  (
    'b0000001-0000-0000-0000-000000000001',
    '11111111-1111-1111-1111-111111111111',
    'c0000001-0000-0000-0000-000000000001',
    CURRENT_DATE + INTERVAL '1 day',
    '14:00:00',
    '16:00:00',
    300.00,
    'confirmed',
    NOW()
  ),
  (
    'b0000002-0000-0000-0000-000000000002',
    '11111111-1111-1111-1111-111111111111',
    'c0000003-0000-0000-0000-000000000003',
    CURRENT_DATE + INTERVAL '3 days',
    '10:00:00',
    '11:00:00',
    100.00,
    'confirmed',
    NOW()
  ),
  
  -- Maria's bookings
  (
    'b0000003-0000-0000-0000-000000000003',
    '22222222-2222-2222-2222-222222222222',
    'c0000002-0000-0000-0000-000000000002',
    CURRENT_DATE + INTERVAL '2 days',
    '18:00:00',
    '20:00:00',
    240.00,
    'confirmed',
    NOW()
  ),
  
  -- Past booking (for history)
  (
    'b0000004-0000-0000-0000-000000000004',
    '11111111-1111-1111-1111-111111111111',
    'c0000001-0000-0000-0000-000000000001',
    CURRENT_DATE - INTERVAL '5 days',
    '16:00:00',
    '18:00:00',
    300.00,
    'confirmed',
    NOW() - INTERVAL '5 days'
  ),
  
  -- Cancelled booking
  (
    'b0000005-0000-0000-0000-000000000005',
    '22222222-2222-2222-2222-222222222222',
    'c0000004-0000-0000-0000-000000000004',
    CURRENT_DATE + INTERVAL '7 days',
    '15:00:00',
    '16:00:00',
    80.00,
    'cancelled',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- Success message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '✅ ═══════════════════════════════════════════════════════';
  RAISE NOTICE '✅ Seed data loaded successfully!';
  RAISE NOTICE '✅ ═══════════════════════════════════════════════════════';
  RAISE NOTICE '';
  RAISE NOTICE '👥 Test Users Created:';
  RAISE NOTICE '   • João Silva (user)';
  RAISE NOTICE '   • Maria Santos (user)';
  RAISE NOTICE '   • Carlos Oliveira (club_owner) - Arena Sport Center';
  RAISE NOTICE '   • Ana Costa (club_owner) - Beach Sports Club';
  RAISE NOTICE '';
  RAISE NOTICE '🏟️  Test Courts Created:';
  RAISE NOTICE '   • 2 courts at Arena Sport Center (Futebol, Tênis)';
  RAISE NOTICE '   • 2 courts at Beach Sports Club (Vôlei, Futevôlei)';
  RAISE NOTICE '';
  RAISE NOTICE '📅 Test Bookings Created:';
  RAISE NOTICE '   • 3 upcoming bookings';
  RAISE NOTICE '   • 1 past booking (history)';
  RAISE NOTICE '   • 1 cancelled booking';
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Your local database is ready for development!';
  RAISE NOTICE '📖 Open Studio UI: npm run db:studio';
  RAISE NOTICE '';
END $$;
