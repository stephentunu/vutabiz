-- Seed admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  'a30f6c24-5d51-4e4f-8367-93fb42cb83e5',
  'authenticated',
  'authenticated',
  'admins@gmail.com',
  extensions.crypt('adminpass1234', extensions.gen_salt('bf')),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "System Administrator", "phone": "0700000000", "county_id": "47"}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;
