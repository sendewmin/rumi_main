-- Check all ratings in database
SELECT * FROM public.ratings;

-- Count ratings by room_id
SELECT room_id, COUNT(*) as count, AVG(stars) as avg_rating
FROM public.ratings
GROUP BY room_id;

-- Check what room_ids exist in our rooms table
SELECT DISTINCT roomid FROM public.rooms;
