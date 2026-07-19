
-- Enums
DO $$ BEGIN CREATE TYPE public.listing_type AS ENUM ('sale','hire','service','donation'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.education_level AS ENUM ('none','kcpe','kcse','certificate','diploma','degree'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Subcounties
CREATE TABLE IF NOT EXISTS public.subcounties (
  id serial PRIMARY KEY,
  county_id smallint NOT NULL REFERENCES public.counties(id) ON DELETE CASCADE,
  name text NOT NULL
);
CREATE INDEX IF NOT EXISTS subcounties_county_idx ON public.subcounties(county_id);
GRANT SELECT ON public.subcounties TO anon, authenticated;
GRANT ALL ON public.subcounties TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.subcounties_id_seq TO authenticated, service_role;
ALTER TABLE public.subcounties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subcounties public read" ON public.subcounties;
CREATE POLICY "Subcounties public read" ON public.subcounties FOR SELECT USING (true);

-- Seed one default subcounty per county with existing wards
INSERT INTO public.subcounties (county_id, name)
SELECT DISTINCT w.county_id, c.name || ' Central'
FROM public.wards w JOIN public.counties c ON c.id = w.county_id
ON CONFLICT DO NOTHING;

-- Wards: link to subcounty (nullable)
ALTER TABLE public.wards ADD COLUMN IF NOT EXISTS subcounty_id integer REFERENCES public.subcounties(id) ON DELETE SET NULL;
UPDATE public.wards w SET subcounty_id = s.id
  FROM public.subcounties s
  WHERE s.county_id = w.county_id AND w.subcounty_id IS NULL;
CREATE INDEX IF NOT EXISTS wards_subcounty_idx ON public.wards(subcounty_id);

-- Listings: new columns
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS listing_type public.listing_type NOT NULL DEFAULT 'sale',
  ADD COLUMN IF NOT EXISTS contact_phone text,
  ADD COLUMN IF NOT EXISTS offers_delivery boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS transport_means text,
  ADD COLUMN IF NOT EXISTS payment_methods text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS job_title text,
  ADD COLUMN IF NOT EXISTS education_level public.education_level,
  ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS experience_years integer,
  ADD COLUMN IF NOT EXISTS self_description text,
  ADD COLUMN IF NOT EXISTS subcounty_id integer REFERENCES public.subcounties(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS listings_type_idx ON public.listings(listing_type);
CREATE INDEX IF NOT EXISTS listings_subcounty_idx ON public.listings(subcounty_id);
CREATE INDEX IF NOT EXISTS listings_ward_idx ON public.listings(ward_id);

-- Allow donations to have price 0 (already allowed by >=0 constraint). No change.
