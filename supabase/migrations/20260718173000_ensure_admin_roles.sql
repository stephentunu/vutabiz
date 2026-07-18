-- Migration: Add missing admin RLS policies and ensure admin profile/roles backfill works correctly.

-- Allow admins (via has_role) to read ALL profiles (not just public ones)
-- Note: "Profiles public read" already has USING(true), so all profiles are readable.
-- No additional policy needed for profiles.

-- Allow admins to read all offers (already exists: "Buyer or seller see offer" includes admin)
-- Allow admins to read all payments (already exists: "User or admin sees payments" includes admin)

-- IMPORTANT: Ensure admin user_roles entries exist for ANY user with admin email.
-- This runs every deploy to fix missing role rows from seed bypass.
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT u.id
    FROM auth.users u
    WHERE u.email = 'admins@gmail.com'
  LOOP
    -- Ensure profile exists
    INSERT INTO public.profiles (id, full_name, email, phone, county_id, town, building)
    VALUES (r.id, 'System Administrator', 'admins@gmail.com', '0700000000', 47, 'Nairobi CBD', 'Admin')
    ON CONFLICT (id) DO NOTHING;

    -- Ensure user role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (r.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Ensure admin role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (r.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END LOOP;
END $$;
