-- =========================================================================
-- BANARAS DARSHAN: SUPABASE STORAGE BUCKETS & POLICIES SETUP
-- Execute this script in your Supabase Project SQL Editor
-- =========================================================================

-- 1. Create Public Storage Buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('places', 'places', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']),
  ('promotions', 'promotions', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']),
  ('gallery', 'gallery', true, 15728640, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif', 'image/avif']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
  ('feedback', 'feedback', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage RLS Policies: Public View Access
DROP POLICY IF EXISTS "Public View Places Bucket" ON storage.objects;
CREATE POLICY "Public View Places Bucket"
ON storage.objects FOR SELECT
USING (bucket_id IN ('places', 'promotions', 'gallery', 'avatars'));

-- 3. Storage RLS Policies: Service Role / Admin Upload & Management
DROP POLICY IF EXISTS "Admin Full Storage Access" ON storage.objects;
CREATE POLICY "Admin Full Storage Access"
ON storage.objects FOR ALL
USING (auth.role() = 'service_role' OR auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');
