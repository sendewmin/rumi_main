-- Check actual rooms table schema and data

-- See table structure
\d public.rooms

-- Count rows
SELECT COUNT(*) as total_rooms FROM public.rooms;

-- Show first few rooms
SELECT * FROM public.rooms LIMIT 5;

-- Show all column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND table_schema = 'public'
ORDER BY ordinal_position;
