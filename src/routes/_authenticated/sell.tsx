import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { computeAdFee, createListing, payListingAd } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import { Loader2, CheckCircle2, ShoppingBag, Wrench, Users } from "lucide-react";
import { STATIC_SUB_COUNTIES } from "@/lib/location-data";

export const Route = createFileRoute("/_authenticated/sell")({ component: SellPage });

type Cat = { id: number; name: string; parent_id: number | null };
type County = { id: number; name: string };
type SubCounty = { id: number; county_id: number; name: string };
type Ward = { id: number; county_id: number; sub_county_id: number | null; name: string };

type ListingType = "sale" | "hire" | "service";
type PriceType = "fixed" | "daily" | "hourly";

const LISTING_TYPE_OPTIONS: { value: ListingType; label: string; icon: typeof ShoppingBag; desc: string }[] = [
  { value: "sale", label: "For Sale", icon: ShoppingBag, desc: "Sell goods at a fixed price" },
  { value: "hire", label: "For Hire", icon: Wrench, desc: "Rent out equipment or space" },
  { value: "service", label: "Service", icon: Users, desc: "Offer your skills & labour" },
];

function SellPage() {
  const navigate = useNavigate();
  const compute = useServerFn(computeAdFee);
  const create = useServerFn(createListing);
  const pay = useServerFn(payListingAd);

  const [cats, setCats] = useState<Cat[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [listingType, setListingType] = useState<ListingType>("sale");
  const [priceType, setPriceType] = useState<PriceType>("fixed");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number>(1000);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [countyId, setCountyId] = useState<number | "">("");
  const [subCountyId, setSubCountyId] = useState<number | "">("");
  const [wardId, setWardId] = useState<number | "">("");
  const [town, setTown] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [distance, setDistance] = useState<number>(0);
  const [risk, setRisk] = useState<"low" | "medium" | "high">("low");
  const [days, setDays] = useState<number>(7);
  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [mpesa, setMpesa] = useState("");

  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,parent_id")
      .order("name")
      .then(({ data }) => setCats((data as Cat[]) ?? []));
    supabase
      .from("counties")
      .select("id,name")
      .order("name")
      .then(({ data }) => setCounties((data as County[]) ?? []));
    supabase
      .from("sub_counties")
      .select("id,county_id,name")
      .order("name")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSubCounties(data as SubCounty[]);
        } else {
          setSubCounties(STATIC_SUB_COUNTIES as SubCounty[]);
        }
      })
      .catch(() => {
        setSubCounties(STATIC_SUB_COUNTIES as SubCounty[]);
      });
    supabase
      .from("wards")
      .select("id,county_id,sub_county_id,name")
      .order("name")
      .then(({ data }) => {
        const dbWards = (data as Ward[]) ?? [];
        const allWards = [...dbWards];
        STATIC_SUB_COUNTIES.forEach((sc) => {
          const hasWard = allWards.some((w) => w.sub_county_id === sc.id);
          if (!hasWard) {
            allWards.push({
              id: 10000 + sc.id,
              county_id: sc.county_id,
              sub_county_id: sc.id,
              name: sc.name,
            });
          }
        });
        setWards(allWards);
      })
      .catch(() => {
        const fallbackWards = STATIC_SUB_COUNTIES.map((sc) => ({
          id: 10000 + sc.id,
          county_id: sc.county_id,
          sub_county_id: sc.id,
          name: sc.name,
        }));
        setWards(fallbackWards);
      });

    // Pre-fill location from profile
    supabase.auth.getUser().then(({ data }) => {
      if (data.user)
        supabase
          .from("profiles")
          .select("county_id,sub_county_id,ward_id,town")
          .eq("id", data.user.id)
          .maybeSingle()
          .then(({ data: p }) => {
            if (p) {
              setCountyId(p.county_id ?? "");
              setSubCountyId((p as { sub_county_id?: number | null }).sub_county_id ?? "");
              setWardId(p.ward_id ?? "");
              setTown(p.town ?? "");
            }
          });
    });
  }, []);

  useEffect(() => {
    if (!price || !countyId) {
      setFee(null);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const res = await compute({
          data: {
            price,
            county_id: Number(countyId),
            distance_km: distance,
            risk,
            duration_days: days,
          },
        });
        setFee(res.fee);
      } catch {
        /* ignore */
      }
    }, 300);
    return () => clearTimeout(t);
  }, [price, countyId, distance, risk, days, compute]);

  // Derived filtered lists
  const subCountiesForCounty = subCounties.filter((sc) => sc.county_id === Number(countyId));
  const wardsForSubCounty = wards.filter(
    (w) =>
      w.county_id === Number(countyId) &&
      (subCountyId ? w.sub_county_id === Number(subCountyId) : true),
  );

  // Filter categories based on listing type: services show skills categories
  const filteredCats = cats.filter((c) => {
    if (listingType === "service") {
      // show semi-pro and unskilled parent/children only
      return true; // let users pick any; skills cats will be prominent
    }
    return true;
  });

  async function submitListing(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await create({
        data: {
          title,
          description: desc,
          price,
          category_id: categoryId ? Number(categoryId) : null,
          county_id: countyId ? Number(countyId) : null,
          sub_county_id: subCountyId ? Number(subCountyId) : null,
          ward_id: wardId ? Number(wardId) : null,
          town,
          image_url: imageUrl || null,
          distance_km: distance,
          risk,
          duration_days: days,
          listing_type: listingType,
          price_type: listingType === "sale" ? "fixed" : priceType,
        },
      });
      setCreatedId(res.id);
      setFee(res.ad_fee_ksh);
      toast.success("Listing created. Please pay the ad fee to publish.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  async function payAd() {
    if (!createdId || !mpesa) return;
    setLoading(true);
    try {
      const res = await pay({ data: { listing_id: createdId, mpesa_ref: mpesa } });
      navigate({ to: "/thank-you", search: { url: res.share_url, listing: createdId } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  const priceLabel =
    listingType === "sale"
      ? "Price (KSh)"
      : priceType === "daily"
        ? "Rate / Day (KSh)"
        : priceType === "hourly"
          ? "Rate / Hour (KSh)"
          : "Price (KSh)";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-5">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-xl font-extrabold text-primary-dark">Post an Ad</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Reach thousands of buyers in your county.</p>

          {!createdId ? (
            <form
              onSubmit={submitListing}
              className="mt-4 bg-card rounded-xl shadow ring-1 ring-black/5 p-4 space-y-3"
            >
              {/* ── Listing Type Tabs ── */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Listing Type
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {LISTING_TYPE_OPTIONS.map(({ value, label, icon: Icon, desc }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setListingType(value);
                        if (value === "sale") setPriceType("fixed");
                        else if (value === "hire") setPriceType("daily");
                        else setPriceType("hourly");
                      }}
                      className={`flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 text-center transition cursor-pointer ${
                        listingType === value
                          ? "border-primary bg-primary/8 text-primary-dark"
                          : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${listingType === value ? "text-primary" : ""}`} />
                      <span className="text-[11px] font-bold leading-tight">{label}</span>
                      <span className="text-[9px] leading-tight hidden sm:block">{desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Price Type (Hire/Service only) ── */}
              {listingType !== "sale" && (
                <div>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Pricing Model
                  </div>
                  <div className="flex gap-2">
                    {(["fixed", "daily", "hourly"] as PriceType[]).map((pt) => (
                      <button
                        key={pt}
                        type="button"
                        onClick={() => setPriceType(pt)}
                        className={`flex-1 rounded-lg border px-2 py-1.5 text-[11px] font-semibold transition cursor-pointer ${
                          priceType === pt
                            ? "border-primary bg-primary/10 text-primary-dark"
                            : "border-border text-muted-foreground hover:border-primary/40"
                        }`}
                      >
                        {pt === "fixed" ? "Fixed" : pt === "daily" ? "Per Day" : "Per Hour"}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Field label="Title" v={title} on={setTitle} required />
              <Field label="Description" v={desc} on={setDesc} textarea />

              <div className="grid grid-cols-2 gap-2.5">
                <NumField label={priceLabel} v={price} on={setPrice} required />
                <Sel
                  label="Category"
                  v={categoryId}
                  on={setCategoryId}
                  opts={[
                    { v: "", l: "Select" },
                    ...filteredCats.map((c) => ({ v: c.id, l: c.parent_id ? `— ${c.name}` : c.name })),
                  ]}
                />
              </div>

              {/* ── 3-tier location: County → Sub-County → Ward ── */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Location
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <Sel
                    label="County"
                    v={countyId}
                    on={(v) => {
                      setCountyId(v);
                      setSubCountyId("");
                      setWardId("");
                    }}
                    opts={[{ v: "", l: "Select county" }, ...counties.map((c) => ({ v: c.id, l: c.name }))]}
                  />
                  <Sel
                    label="Sub-County"
                    v={subCountyId}
                    on={(v) => {
                      setSubCountyId(v);
                      setWardId("");
                    }}
                    opts={[
                      { v: "", l: countyId ? "Select sub-county" : "— pick county first" },
                      ...subCountiesForCounty.map((sc) => ({ v: sc.id, l: sc.name })),
                    ]}
                  />
                  <Sel
                    label="Ward"
                    v={wardId}
                    on={setWardId}
                    opts={[
                      { v: "", l: subCountyId ? "Select ward" : "— pick sub-county first" },
                      ...wardsForSubCounty.map((w) => ({ v: w.id, l: w.name })),
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Town / Estate" v={town} on={setTown} />
                <Field label="Image URL" v={imageUrl} on={setImageUrl} />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Ad settings
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <NumField label="Distance (km)" v={distance} on={setDistance} />
                  <Sel
                    label="Risk"
                    v={risk}
                    on={(v) => setRisk(v as "low" | "medium" | "high")}
                    opts={[
                      { v: "low", l: "Low" },
                      { v: "medium", l: "Medium" },
                      { v: "high", l: "High" },
                    ]}
                  />
                  <NumField label="Duration (days)" v={days} on={setDays} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2">
                <div className="text-xs">Estimated ad fee</div>
                <div className="text-lg font-extrabold text-primary-dark">KSh {fee ?? "—"}</div>
              </div>

              <button
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-dark hover:bg-primary text-white px-4 py-2.5 text-sm font-bold disabled:opacity-60"
              >
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Create listing
              </button>
            </form>
          ) : (
            <div className="mt-4 bg-card rounded-xl shadow ring-1 ring-black/5 p-4">
              <div className="flex items-center gap-2 text-primary-dark">
                <CheckCircle2 className="h-5 w-5" />
                <h2 className="text-base font-bold">Listing saved — complete payment</h2>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Pay <b>KSh {fee}</b> via M-Pesa Paybill <b>247247</b>, Account{" "}
                <b>{createdId.slice(0, 8)}</b>, then paste the M-Pesa confirmation code below.
              </p>
              <div className="mt-3 flex gap-2">
                <input
                  value={mpesa}
                  onChange={(e) => setMpesa(e.target.value.toUpperCase())}
                  placeholder="e.g. QK7XX8Y9ZA"
                  className="flex-1 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  disabled={loading || !mpesa}
                  onClick={payAd}
                  className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-bold disabled:opacity-60"
                >
                  Confirm payment
                </button>
              </div>
              <Link to="/dashboard" className="mt-3 inline-block text-xs text-primary underline">
                Skip for now
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({
  label,
  v,
  on,
  required,
  textarea,
}: {
  label: string;
  v: string;
  on: (v: string) => void;
  required?: boolean;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      {textarea ? (
        <textarea
          value={v}
          onChange={(e) => on(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      ) : (
        <input
          required={required}
          value={v}
          onChange={(e) => on(e.target.value)}
          className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      )}
    </label>
  );
}

function NumField({
  label,
  v,
  on,
  required,
}: {
  label: string;
  v: number;
  on: (v: number) => void;
  required?: boolean;
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      <input
        type="number"
        min={0}
        required={required}
        value={v}
        onChange={(e) => on(Number(e.target.value))}
        className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      />
    </label>
  );
}

function Sel<T extends string | number | "">({
  label,
  v,
  on,
  opts,
}: {
  label: string;
  v: T;
  on: (v: T) => void;
  opts: { v: T; l: string }[];
}) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      <select
        value={v as string | number}
        onChange={(e) => {
          const raw = e.target.value;
          const cast = typeof opts[0]?.v === "number" && raw !== "" ? Number(raw) : raw;
          on(cast as T);
        }}
        className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      >
        {opts.map((o) => (
          <option key={String(o.v)} value={o.v as string | number}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}
