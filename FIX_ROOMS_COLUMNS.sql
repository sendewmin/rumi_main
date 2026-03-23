-- Check actual rooms table schema and data
-- See all column names
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'rooms' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Count rows in rooms table
SELECT COUNT(*) as total_rooms FROM public.rooms;

-- Show first few rooms to see what data exists
SELECT * FROM public.rooms LIMIT 5;
