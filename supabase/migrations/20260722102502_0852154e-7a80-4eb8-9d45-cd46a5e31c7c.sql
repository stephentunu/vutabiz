SELECT setval('public.subcounties_id_seq', (SELECT MAX(id) FROM public.subcounties));
SELECT setval('public.wards_id_seq', (SELECT MAX(id) FROM public.wards));