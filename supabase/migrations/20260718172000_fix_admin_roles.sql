-- Fix: Ensure the seeded admin user has the required profile and admin role.
-- The seed migration inserted directly into auth.users bypassing the trigger,
-- so we back-fill profiles and user_roles manually.

DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Find the admin user
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admins@gmail.com' LIMIT 1;

  IF admin_id IS NOT NULL THEN
    -- Upsert profile
    INSERT INTO public.profiles (id, full_name, email, phone, county_id, town, building)
    VALUES (admin_id, 'System Administrator', 'admins@gmail.com', '0700000000', 47, 'Nairobi CBD', 'Admin')
    ON CONFLICT (id) DO UPDATE SET
      full_name = EXCLUDED.full_name,
      email = EXCLUDED.email;

    -- Ensure user role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;

    -- Ensure admin role exists
    INSERT INTO public.user_roles (user_id, role)
    VALUES (admin_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;
