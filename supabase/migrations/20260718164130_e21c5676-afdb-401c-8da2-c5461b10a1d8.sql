
CREATE TYPE public.app_role AS ENUM ('admin','user');
CREATE TYPE public.listing_status AS ENUM ('active','sold','deleted');
CREATE TYPE public.offer_status AS ENUM ('pending','accepted','rejected');
CREATE TYPE public.risk_level AS ENUM ('low','medium','high');

CREATE TABLE public.counties (
  id smallint PRIMARY KEY,
  name text NOT NULL UNIQUE,
  code smallint NOT NULL
);
GRANT SELECT ON public.counties TO anon, authenticated;
GRANT ALL ON public.counties TO service_role;
ALTER TABLE public.counties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Counties public read" ON public.counties FOR SELECT USING (true);

INSERT INTO public.counties(id,name,code) VALUES
(1,'Mombasa',1),(2,'Kwale',2),(3,'Kilifi',3),(4,'Tana River',4),(5,'Lamu',5),(6,'Taita Taveta',6),
(7,'Garissa',7),(8,'Wajir',8),(9,'Mandera',9),(10,'Marsabit',10),(11,'Isiolo',11),(12,'Meru',12),
(13,'Tharaka Nithi',13),(14,'Embu',14),(15,'Kitui',15),(16,'Machakos',16),(17,'Makueni',17),
(18,'Nyandarua',18),(19,'Nyeri',19),(20,'Kirinyaga',20),(21,'Murang''a',21),(22,'Kiambu',22),
(23,'Turkana',23),(24,'West Pokot',24),(25,'Samburu',25),(26,'Trans Nzoia',26),(27,'Uasin Gishu',27),
(28,'Elgeyo Marakwet',28),(29,'Nandi',29),(30,'Baringo',30),(31,'Laikipia',31),(32,'Nakuru',32),
(33,'Narok',33),(34,'Kajiado',34),(35,'Kericho',35),(36,'Bomet',36),(37,'Kakamega',37),
(38,'Vihiga',38),(39,'Bungoma',39),(40,'Busia',40),(41,'Siaya',41),(42,'Kisumu',42),
(43,'Homa Bay',43),(44,'Migori',44),(45,'Kisii',45),(46,'Nyamira',46),(47,'Nairobi',47);

CREATE TABLE public.wards (
  id serial PRIMARY KEY,
  county_id smallint NOT NULL REFERENCES public.counties(id) ON DELETE CASCADE,
  name text NOT NULL
);
CREATE INDEX ON public.wards(county_id);
GRANT SELECT ON public.wards TO anon, authenticated;
GRANT ALL ON public.wards TO service_role;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Wards public read" ON public.wards FOR SELECT USING (true);

INSERT INTO public.wards(county_id,name) VALUES
(47,'Westlands'),(47,'Kilimani'),(47,'Embakasi'),(47,'Kasarani'),(47,'Dagoretti'),(47,'Langata'),(47,'Roysambu'),
(42,'Manyatta'),(42,'Kondele'),(42,'Kolwa Central'),(42,'Nyalenda'),
(32,'Nakuru East'),(32,'Nakuru West'),(32,'Naivasha'),
(22,'Ruiru'),(22,'Thika'),(22,'Kikuyu'),(22,'Limuru'),
(1,'Nyali'),(1,'Kisauni'),(1,'Likoni'),(1,'Mvita'),
(37,'Lurambi'),(37,'Mumias'),(45,'Kitutu'),(45,'Bobasi'),
(12,'Meru Central'),(14,'Embu Manyatta'),(19,'Nyeri Town'),(34,'Kitengela'),(34,'Ngong');

CREATE TABLE public.categories (
  id serial PRIMARY KEY,
  parent_id integer REFERENCES public.categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  icon text
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories public read" ON public.categories FOR SELECT USING (true);

INSERT INTO public.categories(parent_id,name,slug,icon) VALUES
(NULL,'Home & Living','home-living','home'),
(NULL,'Furniture','furniture','sofa'),
(NULL,'Construction','construction','hammer'),
(NULL,'Farm & Produce','farm-produce','sprout'),
(NULL,'Electronics','electronics','tv');

INSERT INTO public.categories(parent_id,name,slug)
SELECT c.id, x.name, x.slug FROM public.categories c JOIN (VALUES
  ('home-living','Sufurias & Pots','sufurias'),
  ('home-living','Kettles','kettles'),
  ('home-living','Blenders','blenders'),
  ('home-living','Water Tanks','water-tanks'),
  ('home-living','Solar Panels','solar-panels'),
  ('furniture','Sofas','sofas'),
  ('furniture','Dining Sets','dining-sets'),
  ('furniture','Beds','beds'),
  ('furniture','Cabinets','cabinets'),
  ('construction','Iron Sheets','iron-sheets'),
  ('construction','Cement','cement'),
  ('construction','Sand & Ballast','sand-ballast'),
  ('construction','Nails','nails'),
  ('construction','Hand Tools','hand-tools'),
  ('farm-produce','Fresh Produce','fresh-produce'),
  ('farm-produce','Seeds','seeds'),
  ('farm-produce','Fertilizer','fertilizer'),
  ('farm-produce','Agro Tools','agro-tools'),
  ('electronics','TVs','tvs'),
  ('electronics','Radios','radios'),
  ('electronics','Phones','phones')
) AS x(parent_slug,name,slug) ON c.slug = x.parent_slug;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  county_id smallint REFERENCES public.counties(id),
  ward_id integer REFERENCES public.wards(id),
  town text,
  building text,
  avatar_url text,
  market_share numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles public read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=_user_id AND role=_role) $$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, county_id, ward_id, town, building)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone',''),
    NULLIF(NEW.raw_user_meta_data->>'county_id','')::smallint,
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

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TABLE public.listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price >= 0),
  category_id integer REFERENCES public.categories(id),
  county_id smallint REFERENCES public.counties(id),
  ward_id integer REFERENCES public.wards(id),
  town text,
  image_url text,
  status public.listing_status NOT NULL DEFAULT 'active',
  distance_km numeric NOT NULL DEFAULT 0,
  risk public.risk_level NOT NULL DEFAULT 'low',
  duration_days integer NOT NULL DEFAULT 7,
  ad_fee_ksh integer NOT NULL DEFAULT 0,
  ad_paid boolean NOT NULL DEFAULT false,
  ad_expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.listings(status);
CREATE INDEX ON public.listings(seller_id);
CREATE INDEX ON public.listings(category_id);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT SELECT ON public.listings TO anon;
GRANT ALL ON public.listings TO service_role;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active listings public" ON public.listings FOR SELECT
  USING (status = 'active' OR auth.uid() = seller_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Owner insert listing" ON public.listings FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Owner update listing" ON public.listings FOR UPDATE USING (auth.uid() = seller_id) WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Owner delete listing" ON public.listings FOR DELETE USING (auth.uid() = seller_id);
CREATE POLICY "Admins manage listings" ON public.listings FOR ALL
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id uuid NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
  buyer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric NOT NULL CHECK (amount >= 0),
  message text,
  status public.offer_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX ON public.offers(listing_id);
CREATE INDEX ON public.offers(buyer_id);
GRANT SELECT, INSERT, UPDATE ON public.offers TO authenticated;
GRANT ALL ON public.offers TO service_role;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Buyer or seller see offer" ON public.offers FOR SELECT USING (
  auth.uid() = buyer_id
  OR auth.uid() = (SELECT seller_id FROM public.listings WHERE id = offers.listing_id)
  OR public.has_role(auth.uid(),'admin')
);
CREATE POLICY "Buyer creates offer" ON public.offers FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Seller updates offer" ON public.offers FOR UPDATE USING (
  auth.uid() = (SELECT seller_id FROM public.listings WHERE id = offers.listing_id)
);

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  listing_id uuid REFERENCES public.listings(id) ON DELETE SET NULL,
  amount integer NOT NULL,
  method text NOT NULL DEFAULT 'mpesa',
  mpesa_ref text,
  purpose text NOT NULL DEFAULT 'ad_fee',
  status text NOT NULL DEFAULT 'paid',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "User or admin sees payments" ON public.payments FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "User inserts own payment" ON public.payments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.calc_ad_fee(
  _price numeric, _county_id smallint, _distance_km numeric,
  _market_share numeric, _risk public.risk_level, _duration_days integer
) RETURNS integer LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  base numeric := 50;
  loc_factor numeric := CASE WHEN _county_id = 47 THEN 1.5
                              WHEN _county_id IN (1,32,42,22) THEN 1.25
                              ELSE 1.0 END;
  distance_fee numeric := COALESCE(_distance_km,0) * 2;
  value_fee numeric := COALESCE(_price,0) * 0.005;
  risk_mult numeric := CASE _risk WHEN 'low' THEN 1.0 WHEN 'medium' THEN 1.3 WHEN 'high' THEN 1.6 END;
  duration_mult numeric := GREATEST(COALESCE(_duration_days,7),1) / 7.0;
  share_discount numeric := GREATEST(1 - COALESCE(_market_share,0)/100.0, 0.5);
  total numeric;
BEGIN
  total := (base + distance_fee + value_fee) * loc_factor * risk_mult * duration_mult * share_discount;
  RETURN GREATEST(50, ROUND(total))::integer;
END $$;

CREATE OR REPLACE FUNCTION public.tg_set_updated_at() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER trg_listings_updated BEFORE UPDATE ON public.listings FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_offers_updated BEFORE UPDATE ON public.offers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
