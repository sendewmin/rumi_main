-- QUICK FIX: Drop and recreate bookings table with correct schema
-- Step 1: Drop existing bookings table (this will remove bad schema)
DROP TABLE IF EXISTS public.bookings CASCADE;

-- Step 2: Recreate with correct schema - UUID for user_id, BIGINT for room_id
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  room_id BIGINT NOT NULL,
  status TEXT DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, room_id)
);

-- Step 3: Create indexes for performance
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);

-- Step 4: Disable RLS (no security policies - wide open for testing)
ALTER TABLE public.bookings DISABLE ROW LEVEL SECURITY;

SELECT 'Bookings table recreated with correct schema!' as status;
