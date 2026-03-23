-- ============================================
-- RUMI RENTAL PLATFORM - SUPABASE SQL SCHEMA
-- ============================================
-- Run this SQL in your Supabase editor to create all tables
-- Copy all of this and paste it into Supabase SQL Editor

-- 1. CREATE ROOMS TABLE
CREATE TABLE IF NOT EXISTS public.rooms (
  id BIGSERIAL PRIMARY KEY,
  roomId BIGINT NOT NULL UNIQUE,
  roomTitle TEXT NOT NULL,
  roomDescription TEXT,
  roomStatus TEXT DEFAULT 'AVAILABLE',
  amount NUMERIC,
  maxRoommates BIGINT,
  bedrooms BIGINT,
  bathrooms BIGINT,
  totalRoomArea NUMERIC,
  roomType TEXT,
  addressLine TEXT,
  city TEXT,
  country TEXT,
  amenities JSONB,
  allergies JSONB,
  renterName TEXT,
  renterImage TEXT,
  avgRating NUMERIC DEFAULT 0,
  totalReviews BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CREATE BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id BIGINT NOT NULL REFERENCES public.rooms(roomId) ON DELETE CASCADE,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. CREATE RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id BIGINT NOT NULL REFERENCES public.rooms(roomId) ON DELETE CASCADE,
  stars NUMERIC CHECK (stars >= 0 AND stars <= 5),
  tags JSONB,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, room_id)
);

-- 4. CREATE INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_ratings_room_id ON public.ratings(room_id);

-- 5. INSERT SAMPLE ROOMS DATA
INSERT INTO public.rooms (roomId, roomTitle, roomDescription, roomStatus, amount, maxRoommates, bedrooms, bathrooms, totalRoomArea, roomType, addressLine, city, country, amenities, allergies, renterName, renterImage, avgRating, totalReviews)
VALUES
  (
    1,
    'Private Room in Modern Shared Apartment',
    'Cozy private bedroom in a well-maintained shared apartment. Perfect for students or professionals. Located in the heart of the city with easy access to public transport.',
    'AVAILABLE',
    450,
    2,
    1,
    1,
    25,
    'Apartment',
    '123 Main Street',
    'San Francisco',
    'USA',
    '["WiFi", "Air Conditioning", "Hot Water", "Furnished"]'::jsonb,
    '["No pets", "No smoking"]'::jsonb,
    'John Landlord',
    'https://via.placeholder.com/80',
    4.5,
    12
  ),
  (
    2,
    'Spacious Suite with Balcony',
    'Large bedroom with en-suite bathroom and private balcony. Modern amenities and furnished.',
    'AVAILABLE',
    650,
    1,
    1,
    1,
    35,
    'Suite',
    '456 Oak Avenue',
    'San Francisco',
    'USA',
    '["WiFi", "Parking", "Furnished", "Sea View"]'::jsonb,
    '[]'::jsonb,
    'Jane Smith',
    'https://via.placeholder.com/80',
    4.8,
    24
  ),
  (
    3,
    'Cozy Studio in Downtown',
    'Compact studio apartment perfect for solo travelers or short-term stays. Fully equipped kitchen.',
    'AVAILABLE',
    550,
    1,
    1,
    1,
    20,
    'Studio',
    '789 Market Street',
    'San Francisco',
    'USA',
    '["WiFi", "Furnished", "Shared Kitchen", "Common Area"]'::jsonb,
    '["No pets"]'::jsonb,
    'Mike Johnson',
    'https://via.placeholder.com/80',
    4.2,
    8
  )
ON CONFLICT (roomId) DO UPDATE SET
  roomTitle = EXCLUDED.roomTitle,
  roomDescription = EXCLUDED.roomDescription,
  amount = EXCLUDED.amount,
  updated_at = NOW();

-- 6. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- 7. CREATE RLS POLICIES - ROOMS (Public Read)
CREATE POLICY "Public can read rooms" ON public.rooms
  FOR SELECT USING (true);

-- 8. CREATE RLS POLICIES - BOOKINGS
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. CREATE RLS POLICIES - RATINGS
CREATE POLICY "Public can read ratings" ON public.ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create ratings" ON public.ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings" ON public.ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- 10. VERIFY SETUP
SELECT 'Setup Complete!' as status;

-- Check what we created:
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
