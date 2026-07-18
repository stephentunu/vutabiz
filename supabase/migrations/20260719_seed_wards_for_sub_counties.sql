-- Seed a default ward for every sub-county in Kenya to ensure no county or sub-county has an empty wards list.
-- The ward will have the same name as the sub-county.
INSERT INTO public.wards (county_id, sub_county_id, name)
SELECT county_id, id, name
FROM public.sub_counties sc
WHERE NOT EXISTS (
  SELECT 1 FROM public.wards w WHERE w.sub_county_id = sc.id
);

-- Update handle_new_user trigger function to parse and insert sub_county_id
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, county_id, sub_county_id, ward_id, town, building)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone',''),
    NULLIF(NEW.raw_user_meta_data->>'county_id','')::smallint,
    NULLIF(NEW.raw_user_meta_data->>'sub_county_id','')::int,
    NULLIF(NEW.raw_user_meta_data->>'ward_id','')::int,
    NEW.raw_user_meta_data->>'town',
    NEW.raw_user_meta_data->>'building'
  );
  INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id,'user') ON CONFLICT DO NOTHING;
  IF NEW.email = 'admins@gmail.com' THEN
    INSERT INTO public.user_roles(user_id, role) VALUES (NEW.id,'admin') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END $$;
