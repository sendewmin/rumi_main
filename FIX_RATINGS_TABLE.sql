-- Drop and recreate ratings table with correct schema
DROP TABLE IF EXISTS public.ratings CASCADE;

CREATE TABLE public.ratings (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID NOT NULL,
  room_id BIGINT NOT NULL,
  stars INT NOT NULL CHECK (stars >= 1 AND stars <= 5),
  tags JSONB,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX idx_ratings_room_id ON public.ratings(room_id);
CREATE INDEX idx_ratings_user_room ON public.ratings(user_id, room_id);

-- Disable RLS (wide open for testing)
ALTER TABLE public.ratings DISABLE ROW LEVEL SECURITY;

SELECT 'Ratings table recreated with correct schema!' as status;
