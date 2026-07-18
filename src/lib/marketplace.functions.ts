import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const listingInput = z.object({
  title: z.string().min(3).max(140),
  description: z.string().max(2000).optional().nullable(),
  price: z.number().min(0),
  category_id: z.number().int().nullable(),
  county_id: z.number().int().nullable(),
  ward_id: z.number().int().nullable(),
  town: z.string().max(120).optional().nullable(),
  image_url: z.string().url().max(500).optional().nullable(),
  distance_km: z.number().min(0).default(0),
  risk: z.enum(["low", "medium", "high"]).default("low"),
  duration_days: z.number().int().min(1).max(60).default(7),
});

export const computeAdFee = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { price: number; county_id: number | null; distance_km: number; risk: "low"|"medium"|"high"; duration_days: number }) => input)
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase.from("profiles").select("market_share").eq("id", context.userId).maybeSingle();
    const { data: fee, error } = await context.supabase.rpc("calc_ad_fee", {
      _price: data.price,
      _county_id: data.county_id,
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
  .inputValidator((raw: unknown) => listingInput.parse(raw))
  .handler(async ({ data, context }) => {
    const { data: profile } = await context.supabase.from("profiles").select("market_share").eq("id", context.userId).maybeSingle();
    const { data: fee } = await context.supabase.rpc("calc_ad_fee", {
      _price: data.price,
      _county_id: data.county_id,
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
  .inputValidator((raw: { listing_id: string; mpesa_ref: string }) => raw)
  .handler(async ({ data, context }) => {
    const { data: listing, error: le } = await context.supabase
      .from("listings").select("id, ad_fee_ksh, seller_id, duration_days")
      .eq("id", data.listing_id).eq("seller_id", context.userId).single();
    if (le || !listing) throw new Error("Listing not found");
    const { error: pe } = await context.supabase.from("payments").insert({
      user_id: context.userId, listing_id: listing.id, amount: listing.ad_fee_ksh,
      method: "mpesa", mpesa_ref: data.mpesa_ref, purpose: "ad_fee", status: "paid",
    });
    if (pe) throw new Error(pe.message);
    const expires = new Date(); expires.setDate(expires.getDate() + listing.duration_days);
    await context.supabase.from("listings").update({ ad_paid: true, ad_expires_at: expires.toISOString() }).eq("id", listing.id);
    return { ok: true, share_url: `/store/${context.userId}` };
  });

export const updateListingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { listing_id: string; status: "active" | "sold" | "deleted" }) => raw)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("listings").update({ status: data.status }).eq("id", data.listing_id).eq("seller_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const makeOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { listing_id: string; amount: number; message?: string }) => raw)
  .handler(async ({ data, context }) => {
    const { data: listing } = await context.supabase.from("listings").select("seller_id, status").eq("id", data.listing_id).single();
    if (!listing || listing.status !== "active") throw new Error("Listing unavailable");
    if (listing.seller_id === context.userId) throw new Error("You cannot offer on your own listing");
    const { data: row, error } = await context.supabase.from("offers").insert({
      listing_id: data.listing_id, buyer_id: context.userId,
      amount: data.amount, message: data.message ?? null, status: "pending",
    }).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const respondOffer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((raw: { offer_id: string; action: "accepted" | "rejected" }) => raw)
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("offers").update({ status: data.action }).eq("id", data.offer_id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    return { roles: (data ?? []).map((r) => r.role), userId: context.userId };
  });

export const adminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: isAdminData } = await context.supabase.rpc("has_role" as never, { _user_id: context.userId, _role: "admin" } as never);
    // Fallback: query user_roles under RLS (users can see own roles)
    let isAdmin = Boolean(isAdminData);
    if (!isAdmin) {
      const { data: rows } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin");
      isAdmin = (rows?.length ?? 0) > 0;
    }
    if (!isAdmin) throw new Error("Forbidden");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ count: users }, { count: listings }, { count: offers }, { data: payments }] = await Promise.all([
      supabaseAdmin.from("profiles").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("listings").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("offers").select("*", { count: "exact", head: true }),
      supabaseAdmin.from("payments").select("amount"),
    ]);
    const revenue = (payments ?? []).reduce((s, p) => s + (p.amount ?? 0), 0);
    const { data: recent } = await supabaseAdmin
      .from("listings").select("id,title,price,status,created_at,seller_id").order("created_at", { ascending: false }).limit(10);
    const { data: recentUsers } = await supabaseAdmin
      .from("profiles").select("id,full_name,email,phone,created_at").order("created_at", { ascending: false }).limit(10);
    return {
      users: users ?? 0, listings: listings ?? 0, offers: offers ?? 0, revenue,
      recentListings: recent ?? [], recentUsers: recentUsers ?? [],
    };
  });
