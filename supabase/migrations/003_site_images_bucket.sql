-- Storage bucket used by the admin panel for editable site and content images.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'site-images',
  'site-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE
SET public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "Public can read site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can insert site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update site images" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete site images" ON storage.objects;

CREATE POLICY "Public can read site images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'site-images');

CREATE POLICY "Admins can insert site images"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'site-images' AND public.is_admin());

CREATE POLICY "Admins can update site images"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'site-images' AND public.is_admin())
WITH CHECK (bucket_id = 'site-images' AND public.is_admin());

CREATE POLICY "Admins can delete site images"
ON storage.objects
FOR DELETE
USING (bucket_id = 'site-images' AND public.is_admin());
