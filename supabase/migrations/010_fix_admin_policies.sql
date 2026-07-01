-- Align admin access with the authenticated user's email.
-- The initial policies compared auth.uid() with admin_users.id, but admin_users.id
-- is an application UUID and does not necessarily match Supabase auth user ids.

DROP POLICY IF EXISTS "Admin full access doctors" ON doctors;
DROP POLICY IF EXISTS "Admin full access hospitals" ON hospitals;
DROP POLICY IF EXISTS "Admin full access treatments" ON treatments;
DROP POLICY IF EXISTS "Admin full access specialties" ON specialties;
DROP POLICY IF EXISTS "Admin full access blogs" ON blogs;
DROP POLICY IF EXISTS "Admin full access insurance" ON insurance_companies;
DROP POLICY IF EXISTS "Admin full access hotels" ON hotels;
DROP POLICY IF EXISTS "Admin full access testimonials" ON testimonials;
DROP POLICY IF EXISTS "Admin full access leads" ON leads;
DROP POLICY IF EXISTS "Admin full access site_settings" ON site_settings;
DROP POLICY IF EXISTS "Admin can read admin_users" ON admin_users;
DROP POLICY IF EXISTS "Super admins can manage admin_users" ON admin_users;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM admin_users
    WHERE lower(email) = lower(auth.jwt() ->> 'email')
      AND role = 'super_admin'
  );
$$;

CREATE POLICY "Admin full access doctors" ON doctors FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access hospitals" ON hospitals FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access treatments" ON treatments FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access specialties" ON specialties FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access blogs" ON blogs FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access insurance" ON insurance_companies FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access hotels" ON hotels FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access testimonials" ON testimonials FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access leads" ON leads FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admin can read admin_users" ON admin_users FOR SELECT USING (public.is_admin());
CREATE POLICY "Super admins can manage admin_users" ON admin_users FOR ALL USING (public.is_super_admin()) WITH CHECK (public.is_super_admin());
