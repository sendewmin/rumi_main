-- Check and fix RoomImages bucket RLS policies
-- Drop existing policies (if any)
DROP POLICY IF EXISTS "Allow public read" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow all for RoomImages" ON storage.objects;

-- Create new permissive policies for RoomImages bucket
CREATE POLICY "Allow all reads RoomImages"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'RoomImages');

CREATE POLICY "Allow authenticated uploads to RoomImages"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'RoomImages' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated deletes from RoomImages"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'RoomImages' AND auth.role() = 'authenticated');

SELECT 'Storage RLS policies configured!' as status;
