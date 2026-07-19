import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const listingInput = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().min(0),
  category_id: z.number().int().nullable(),
  county_id: z.number().int().nullable(),
  sub_county_id: z.number().int().nullable().optional(),
  ward_id: z.number().int().nullable(),
  town: z.string().max(120).optional().nullable(),
  image_url: z.string().url().max(500).optional().nullable(),
  distance_km: z.number().min(0).default(0),
  risk: z.enum(["low", "medium", "high"]).default("low"),
  duration_days: z.number().int().min(1).max(60).default(7),
  listing_type: z.enum(["sale", "hire", "service", "donation"]).default("sale"),
  contact_phone: z.string().max(20).optional().nullable(),
  offers_delivery: z.boolean().default(false),
  transport_means: z.string().max(60).optional().nullable(),
  payment_methods: z.array(z.string().max(30)).default([]),
  job_title: z.string().max(80).optional().nullable(),
  education_level: z.enum(["none","kcpe","kcse","certificate","diploma","degree"]).optional().nullable(),
  languages: z.array(z.string().max(30)).default([]),
  experience_years: z.number().int().min(0).max(80).optional().nullable(),
  self_description: z.string().max(1000).optional().nullable(),
});


export const computeAdFee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      price: number;
      county_id: number | null;
      distance_km: number;
      risk: "low" | "medium" | "high";
      duration_days: number;
    }) => input,
  )
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("market_share")
      .eq("id", context.userId)
      .maybeSingle();
    const { data: fee, error } = await context.supabase.rpc("calc_ad_fee", {
      _price: data.price,
      _county_id: data.county_id as number,
      _distance_km: data.distance_km,
      _market_share: profile?.market_share ?? 0,
      _risk: data.risk,
      _duration_days: data.duration_days,
    });
    if (error) throw new Error(error.message);
    return { fee: Number(fee) };
  });

export const createListing = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: unknown) => listingInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase
      .from("profiles")
      .select("market_share")
      .eq("id", context.userId)
      .maybeSingle();
    const { data: fee } = await context.supabase.rpc("calc_ad_fee", {
      _price: data.price,
      _county_id: data.county_id as number,
      _distance_km: data.distance_km,
      _market_share: profile?.market_share ?? 0,
      _risk: data.risk,
      _duration_days: data.duration_days,
    });
    const ad_fee_ksh = Number(fee ?? 50);
    const { data: row, error } = await context.supabase
      .from("listings")
      .insert({ ...data, seller_id: context.userId, ad_fee_ksh, ad_paid: false, status: "active" })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id, ad_fee_ksh };
  });

export const payListingAd = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: { listing_id: string; mpesa_ref: string }) => raw)
  .handler(async ({ data, context }) => {
    const { data: listing, error: le } = await context.supabase
      .from("listings")
      .select("id, ad_fee_ksh, seller_id, duration_days")
      .eq("id", data.listing_id)
      .eq("seller_id", context.userId)
      .single();
    if (le || !listing) throw new Error("Listing not found");
    const { error: pe } = await context.supabase.from("payments").insert({
      user_id: context.userId,
      listing_id: listing.id,
      amount: listing.ad_fee_ksh,
      method: "mpesa",
      mpesa_ref: data.mpesa_ref,
      purpose: "ad_fee",
      status: "paid",
    });
    if (pe) throw new Error(pe.message);
    const expires = new Date();
    expires.setDate(expires.getDate() + listing.duration_days);
    await context.supabase
      .from("listings")
      .update({ ad_paid: true, ad_expires_at: expires.toISOString() })
      .eq("id", listing.id);
    return { ok: true, share_url: `/store/${context.userId}` };
  });

export const updateListingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: { listing_id: string; status: "active" | "sold" | "deleted" }) => raw)
  .handler(async ({ data, context }) => {
    // Check if the caller is an admin — admins can modify any listing
    const { data: isAdminData } = await context.supabase.rpc(
      "has_role" as never,
      { _user_id: context.userId, _role: "admin" } as never,
    );
    const isAdmin = Boolean(isAdminData);

    const query = context.supabase
      .from("listings")
      .update({ status: data.status })
      .eq("id", data.listing_id);

    // Non-admins can only update their own listings
    const { error } = isAdmin ? await query : await query.eq("seller_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const makeOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: { listing_id: string; amount: number; message?: string }) => raw)
  .handler(async ({ data, context }) => {
    const { data: listing } = await context.supabase
      .from("listings")
      .select("seller_id, status")
      .eq("id", data.listing_id)
      .single();
    if (!listing || listing.status !== "active") throw new Error("Listing unavailable");
    if (listing.seller_id === context.userId)
      throw new Error("You cannot offer on your own listing");
    const { data: row, error } = await context.supabase
      .from("offers")
      .insert({
        listing_id: data.listing_id,
        buyer_id: context.userId,
        amount: data.amount,
        message: data.message ?? null,
        status: "pending",
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const respondOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((raw: { offer_id: string; action: "accepted" | "rejected" }) => raw)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("offers")
      .update({ status: data.action })
      .eq("id", data.offer_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    return { roles: (data ?? []).map((r) => r.role), userId: context.userId };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    // Get the user's email from the JWT claims (no service-role key needed)
    // Supabase JWT claims include the `email` field.
    const userEmail: string =
      (context.claims as Record<string, unknown>)?.["email"] as string ?? "";
    const isAdminEmail = userEmail === "admins@gmail.com";

    // Primary check: has_role RPC (SECURITY DEFINER, uses the user's session)
    const { data: isAdminData } = await context.supabase.rpc(
      "has_role" as never,
      { _user_id: context.userId, _role: "admin" } as never,
    );
    // Fallback: direct user_roles query (users can see their own roles via RLS)
    let isAdmin = Boolean(isAdminData);
    if (!isAdmin) {
      const { data: rows } = await context.supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", context.userId)
        .eq("role", "admin");
      isAdmin = (rows?.length ?? 0) > 0;
    }
    // Final fallback: admin email match (handles seeded admin whose trigger was bypassed).
    // We grant access and backfill missing records using context.supabase.
    // The profiles INSERT policy allows auth.uid() = id, so this works.
    if (!isAdmin && isAdminEmail) {
      isAdmin = true;
      // Backfill profile (INSERT policy: auth.uid() = id)
      await context.supabase.from("profiles").upsert(
        {
          id: context.userId,
          full_name: "System Administrator",
          email: "admins@gmail.com",
          phone: "0700000000",
          county_id: 47,
          town: "Nairobi CBD",
          building: "Admin",
        },
        { onConflict: "id", ignoreDuplicates: true },
      );
    }
    if (!isAdmin) throw new Error("Forbidden: Admin access required");

    // ── Fetch dashboard data using the authenticated admin session ──────────
    // RLS policies allow admins to see all listings, offers, payments, profiles.
    const [
      { count: users },
      { count: listings },
      { count: offers },
      { data: payments },
      { data: recent },
      { data: recentUsers },
    ] = await Promise.all([
      context.supabase.from("profiles").select("*", { count: "exact", head: true }),
      context.supabase.from("listings").select("*", { count: "exact", head: true }),
      context.supabase.from("offers").select("*", { count: "exact", head: true }),
      context.supabase.from("payments").select("amount"),
      context.supabase
        .from("listings")
        .select("id,title,price,status,created_at,seller_id")
        .order("created_at", { ascending: false })
        .limit(10),
      context.supabase
        .from("profiles")
        .select("id,full_name,email,phone,created_at")
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    const revenue = (payments ?? []).reduce((s, p) => s + ((p as { amount: number }).amount ?? 0), 0);

    return {
      users: users ?? 0,
      listings: listings ?? 0,
      offers: offers ?? 0,
      revenue,
      recentListings: (recent ?? []) as Array<{
        id: string;
        title: string;
        price: number;
        status: string;
        created_at: string;
        seller_id: string;
      }>,
      recentUsers: (recentUsers ?? []) as Array<{
        id: string;
        full_name: string;
        email: string;
        phone: string;
        created_at: string;
      }>,
    };
  });

// Public site statistics for the homepage. No auth required.
export const siteStats = createServerFn({ method: "GET" }).handler(async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  const url = process.env.SUPABASE_URL!;
  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, storage: undefined },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`)
          h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const [{ count: users }, { count: active }, { count: sold }, { count: donations }] =
    await Promise.all([
      sb.from("profiles").select("*", { count: "exact", head: true }),
      sb.from("listings").select("*", { count: "exact", head: true }).eq("status", "active"),
      sb.from("listings").select("*", { count: "exact", head: true }).eq("status", "sold"),
      sb
        .from("listings")
        .select("*", { count: "exact", head: true })
        .eq("listing_type", "donation"),
    ]);
  return {
    users: users ?? 0,
    activeListings: active ?? 0,
    itemsSold: sold ?? 0,
    donations: donations ?? 0,
  };
});


