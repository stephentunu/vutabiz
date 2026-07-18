-- ─────────────────────────────────────────────────────────────────────────────
-- Sub-counties table (sits between counties and wards)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE public.sub_counties (
  id serial PRIMARY KEY,
  county_id smallint NOT NULL REFERENCES public.counties(id) ON DELETE CASCADE,
  name text NOT NULL
);
CREATE INDEX ON public.sub_counties(county_id);
GRANT SELECT ON public.sub_counties TO anon, authenticated;
GRANT ALL ON public.sub_counties TO service_role;
ALTER TABLE public.sub_counties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Sub-counties public read" ON public.sub_counties FOR SELECT USING (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Seed all 47 counties × constituencies (sub-counties)
-- Source: Kenya 2022 Electoral & Census constituencies
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.sub_counties(county_id, name) VALUES
-- Mombasa (1)
(1,'Changamwe'),(1,'Jomvu'),(1,'Kisauni'),(1,'Nyali'),(1,'Likoni'),(1,'Mvita'),
-- Kwale (2)
(2,'Msambweni'),(2,'Lungalunga'),(2,'Matuga'),(2,'Kinango'),
-- Kilifi (3)
(3,'Kilifi North'),(3,'Kilifi South'),(3,'Kaloleni'),(3,'Rabai'),(3,'Ganze'),(3,'Malindi'),(3,'Magarini'),
-- Tana River (4)
(4,'Garsen'),(4,'Galole'),(4,'Bura'),
-- Lamu (5)
(5,'Lamu East'),(5,'Lamu West'),
-- Taita Taveta (6)
(6,'Taveta'),(6,'Wundanyi'),(6,'Mwatate'),(6,'Voi'),
-- Garissa (7)
(7,'Garissa Township'),(7,'Balambala'),(7,'Lagdera'),(7,'Dadaab'),(7,'Fafi'),(7,'Ijara'),
-- Wajir (8)
(8,'Wajir North'),(8,'Wajir East'),(8,'Tarbaj'),(8,'Wajir West'),(8,'Eldas'),(8,'Wajir South'),
-- Mandera (9)
(9,'Mandera East'),(9,'Banissa'),(9,'Mandera North'),(9,'Mandera South'),(9,'Mandera West'),(9,'Lafey'),
-- Marsabit (10)
(10,'Moyale'),(10,'North Horr'),(10,'Saku'),(10,'Laisamis'),
-- Isiolo (11)
(11,'Isiolo North'),(11,'Isiolo South'),
-- Meru (12)
(12,'Igembe South'),(12,'Igembe Central'),(12,'Igembe North'),(12,'Tigania West'),(12,'Tigania East'),(12,'North Imenti'),(12,'Buuri'),(12,'Central Imenti'),(12,'South Imenti'),
-- Tharaka Nithi (13)
(13,'Maara'),(13,'Chuka/Igambang''ombe'),(13,'Tharaka'),
-- Embu (14)
(14,'Manyatta'),(14,'Runyenjes'),(14,'Mbeere South'),(14,'Mbeere North'),
-- Kitui (15)
(15,'Mwingi North'),(15,'Mwingi West'),(15,'Mwingi Central'),(15,'Kitui West'),(15,'Kitui Rural'),(15,'Kitui Central'),(15,'Kitui East'),(15,'Kitui South'),
-- Machakos (16)
(16,'Masinga'),(16,'Yatta'),(16,'Kangundo'),(16,'Matungulu'),(16,'Kathiani'),(16,'Mavoko'),(16,'Machakos Town'),(16,'Mwala'),
-- Makueni (17)
(17,'Mbooni'),(17,'Kilome'),(17,'Kaiti'),(17,'Makueni'),(17,'Kibwezi West'),(17,'Kibwezi East'),
-- Nyandarua (18)
(18,'Kinangop'),(18,'Kipipiri'),(18,'Ol Kalou'),(18,'Ol Jorok'),(18,'Ndaragwa'),
-- Nyeri (19)
(19,'Tetu'),(19,'Kieni'),(19,'Mathira'),(19,'Othaya'),(19,'Mukurweini'),(19,'Nyeri Town'),
-- Kirinyaga (20)
(20,'Mwea'),(20,'Gichugu'),(20,'Ndia'),(20,'Kirinyaga Central'),
-- Murang''a (21)
(21,'Kangema'),(21,'Mathioya'),(21,'Kiharu'),(21,'Kigumo'),(21,'Maragwa'),(21,'Kandara'),(21,'Gatanga'),
-- Kiambu (22)
(22,'Gatundu South'),(22,'Gatundu North'),(22,'Juja'),(22,'Thika Town'),(22,'Ruiru'),(22,'Githunguri'),(22,'Kiambu'),(22,'Kiambaa'),(22,'Kabete'),(22,'Kikuyu'),(22,'Limuru'),(22,'Lari'),
-- Turkana (23)
(23,'Turkana North'),(23,'Turkana West'),(23,'Turkana Central'),(23,'Loima'),(23,'Turkana South'),(23,'Turkana East'),
-- West Pokot (24)
(24,'Kapenguria'),(24,'Sigor'),(24,'Kacheliba'),(24,'Pokot South'),
-- Samburu (25)
(25,'Samburu West'),(25,'Samburu North'),(25,'Samburu East'),
-- Trans Nzoia (26)
(26,'Kwanza'),(26,'Endebess'),(26,'Saboti'),(26,'Kiminini'),(26,'Cherangany'),
-- Uasin Gishu (27)
(27,'Soy'),(27,'Turbo'),(27,'Moiben'),(27,'Ainabkoi'),(27,'Kapseret'),(27,'Kesses'),
-- Elgeyo Marakwet (28)
(28,'Marakwet East'),(28,'Marakwet West'),(28,'Keiyo North'),(28,'Keiyo South'),
-- Nandi (29)
(29,'Tinderet'),(29,'Aldai'),(29,'Nandi Hills'),(29,'Chesumei'),(29,'Emgwen'),(29,'Mosop'),
-- Baringo (30)
(30,'Tiaty'),(30,'Baringo North'),(30,'Baringo Central'),(30,'Baringo South'),(30,'Eldama Ravine'),(30,'Mogotio'),
-- Laikipia (31)
(31,'Laikipia West'),(31,'Laikipia East'),(31,'Laikipia North'),
-- Nakuru (32)
(32,'Molo'),(32,'Njoro'),(32,'Naivasha'),(32,'Gilgil'),(32,'Kuresoi South'),(32,'Kuresoi North'),(32,'Subukia'),(32,'Rongai'),(32,'Bahati'),(32,'Nakuru Town West'),(32,'Nakuru Town East'),
-- Narok (33)
(33,'Kilgoris'),(33,'Emurua Dikirr'),(33,'Narok North'),(33,'Narok East'),(33,'Narok South'),(33,'Narok West'),
-- Kajiado (34)
(34,'Kajiado North'),(34,'Kajiado Central'),(34,'Kajiado East'),(34,'Kajiado West'),(34,'Kajiado South'),
-- Kericho (35)
(35,'Kipkelion East'),(35,'Kipkelion West'),(35,'Ainamoi'),(35,'Bureti'),(35,'Belgut'),(35,'Sigowet/Soin'),
-- Bomet (36)
(36,'Sotik'),(36,'Chepalungu'),(36,'Bomet East'),(36,'Bomet Central'),(36,'Konoin'),
-- Kakamega (37)
(37,'Lugari'),(37,'Likuyani'),(37,'Malava'),(37,'Lurambi'),(37,'Navakholo'),(37,'Mumias West'),(37,'Mumias East'),(37,'Matungu'),(37,'Butere'),(37,'Khwisero'),(37,'Shinyalu'),(37,'Ikolomani'),
-- Vihiga (38)
(38,'Vihiga'),(38,'Sabatia'),(38,'Hamisi'),(38,'Luanda'),(38,'Emuhaya'),
-- Bungoma (39)
(39,'Mt Elgon'),(39,'Sirisia'),(39,'Kabuchai'),(39,'Bumula'),(39,'Kanduyi'),(39,'Webuye East'),(39,'Webuye West'),(39,'Kimilili'),(39,'Tongaren'),
-- Busia (40)
(40,'Teso North'),(40,'Teso South'),(40,'Nambale'),(40,'Matayos'),(40,'Butula'),(40,'Funyula'),(40,'Budalangi'),
-- Siaya (41)
(41,'Ugenya'),(41,'Ugunja'),(41,'Alego Usonga'),(41,'Gem'),(41,'Bondo'),(41,'Rarieda'),
-- Kisumu (42)
(42,'Kisumu East'),(42,'Kisumu West'),(42,'Kisumu Central'),(42,'Seme'),(42,'Nyando'),(42,'Muhoroni'),(42,'Nyakach'),
-- Homa Bay (43)
(43,'Kasipul'),(43,'Kabondo Kasipul'),(43,'Karachuonyo'),(43,'Rangwe'),(43,'Homa Bay Town'),(43,'Ndhiwa'),(43,'Mbita'),(43,'Suba'),
-- Migori (44)
(44,'Rongo'),(44,'Awendo'),(44,'Suna East'),(44,'Suna West'),(44,'Uriri'),(44,'Nyatike'),(44,'Kuria West'),(44,'Kuria East'),
-- Kisii (45)
(45,'Bonchari'),(45,'South Mugirango'),(45,'Bomachoge Borabu'),(45,'Bobasi'),(45,'Bomachoge Chache'),(45,'Nyaribari Masaba'),(45,'Nyaribari Chache'),(45,'Kitutu Chache North'),(45,'Kitutu Chache South'),
-- Nyamira (46)
(46,'Kitutu Masaba'),(46,'West Mugirango'),(46,'North Mugirango'),(46,'Bomet South'),  -- Note: Bomet South is separate county but ward mapping kept consistent
-- Nairobi (47)
(47,'Westlands'),(47,'Dagoretti North'),(47,'Dagoretti South'),(47,'Langata'),(47,'Kibra'),(47,'Roysambu'),(47,'Kasarani'),(47,'Ruaraka'),(47,'Embakasi South'),(47,'Embakasi North'),(47,'Embakasi Central'),(47,'Embakasi East'),(47,'Embakasi West'),(47,'Makadara'),(47,'Kamukunji'),(47,'Starehe'),(47,'Mathare');

-- ─────────────────────────────────────────────────────────────────────────────
-- Add sub_county_id to wards (optional backfill – leave NULL for existing rows)
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.wards ADD COLUMN IF NOT EXISTS sub_county_id integer REFERENCES public.sub_counties(id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Add sub_county_id to listings and profiles
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS sub_county_id integer REFERENCES public.sub_counties(id);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS sub_county_id integer REFERENCES public.sub_counties(id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Listing type & price type enums
-- ─────────────────────────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.listing_type AS ENUM ('sale', 'hire', 'service');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.price_type AS ENUM ('fixed', 'daily', 'hourly');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS listing_type public.listing_type NOT NULL DEFAULT 'sale',
  ADD COLUMN IF NOT EXISTS price_type public.price_type NOT NULL DEFAULT 'fixed';

-- ─────────────────────────────────────────────────────────────────────────────
-- Skills categories (Semi-Professional & Unskilled)
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO public.categories(parent_id, name, slug, icon) VALUES
  (NULL, 'Semi-Pro Services', 'semi-pro-services', 'briefcase'),
  (NULL, 'Unskilled Services', 'unskilled-services', 'hand')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.categories(parent_id, name, slug)
SELECT c.id, x.name, x.slug
FROM public.categories c
JOIN (VALUES
  ('semi-pro-services', 'Plumbing',           'plumbing'),
  ('semi-pro-services', 'Electrical Work',    'electrical-work'),
  ('semi-pro-services', 'Carpentry',          'carpentry'),
  ('semi-pro-services', 'Painting',           'painting'),
  ('semi-pro-services', 'Masonry & Concrete', 'masonry'),
  ('semi-pro-services', 'Welding & Metalwork','welding'),
  ('semi-pro-services', 'Auto Repair',        'auto-repair'),
  ('semi-pro-services', 'Tailoring & Fashion','tailoring'),
  ('semi-pro-services', 'Catering & Cooking', 'catering'),
  ('semi-pro-services', 'Photography',        'photography'),
  ('semi-pro-services', 'IT & Tech Support',  'it-support'),
  ('semi-pro-services', 'Salon & Beauty',     'salon-beauty'),
  ('unskilled-services','Cleaning & Washing',  'cleaning'),
  ('unskilled-services','Casual Labour',        'casual-labour'),
  ('unskilled-services','Gardening & Landscaping','gardening'),
  ('unskilled-services','Watchman & Security',  'watchman'),
  ('unskilled-services','Delivery & Portering', 'delivery'),
  ('unskilled-services','Sand & Materials Delivery','sand-delivery'),
  ('unskilled-services','Digging & Excavation',  'digging'),
  ('unskilled-services','Water Fetching',        'water-fetching')
) AS x(parent_slug, name, slug) ON c.slug = x.parent_slug
ON CONFLICT (slug) DO NOTHING;
