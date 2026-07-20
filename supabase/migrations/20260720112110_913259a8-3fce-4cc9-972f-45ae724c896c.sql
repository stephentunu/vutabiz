
ALTER TABLE public.listings
  ADD COLUMN IF NOT EXISTS landmark text,
  ADD COLUMN IF NOT EXISTS donation_recipient text,
  ADD COLUMN IF NOT EXISTS work_rate_type text;
