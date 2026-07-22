
ALTER TABLE public.listings ADD COLUMN IF NOT EXISTS specialties text[] NOT NULL DEFAULT '{}';

UPDATE public.categories SET parent_id = 33 WHERE parent_id = 2;
DELETE FROM public.categories WHERE id = 2;
UPDATE public.categories SET parent_id = 38 WHERE parent_id = 3;
DELETE FROM public.categories WHERE id = 3;
UPDATE public.categories SET parent_id = 42 WHERE parent_id = 4;
DELETE FROM public.categories WHERE id = 4;
UPDATE public.categories SET parent_id = 28 WHERE parent_id = 5;
DELETE FROM public.categories WHERE id = 5;
UPDATE public.categories SET name = 'Home & Living'         WHERE id = 1;
UPDATE public.categories SET name = 'Furniture & Clothing'  WHERE id = 33;
UPDATE public.categories SET name = 'Machinery & Tools'     WHERE id = 38;
UPDATE public.categories SET name = 'Animal & Farm Produce' WHERE id = 42;

ALTER TABLE public.wards DROP CONSTRAINT IF EXISTS wards_subcounty_id_fkey;
UPDATE public.listings SET subcounty_id = NULL, ward_id = NULL;
UPDATE public.profiles SET ward_id = NULL;
DELETE FROM public.wards;
DELETE FROM public.subcounties;
ALTER TABLE public.wards
  ADD CONSTRAINT wards_subcounty_id_fkey
  FOREIGN KEY (subcounty_id) REFERENCES public.subcounties(id) ON DELETE SET NULL;
