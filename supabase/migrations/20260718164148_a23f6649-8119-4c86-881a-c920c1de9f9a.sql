
CREATE OR REPLACE FUNCTION public.calc_ad_fee(
  _price numeric, _county_id smallint, _distance_km numeric,
  _market_share numeric, _risk public.risk_level, _duration_days integer
) RETURNS integer LANGUAGE plpgsql IMMUTABLE SET search_path = public AS $$
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

CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
