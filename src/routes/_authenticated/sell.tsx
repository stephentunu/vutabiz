import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { computeAdFee, createListing, payListingAd } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/sell")({ component: SellPage });

type Cat = { id: number; name: string; parent_id: number | null };
type County = { id: number; name: string };
type Ward = { id: number; county_id: number; name: string };

function SellPage() {
  const navigate = useNavigate();
  const compute = useServerFn(computeAdFee);
  const create = useServerFn(createListing);
  const pay = useServerFn(payListingAd);

  const [cats, setCats] = useState<Cat[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number>(1000);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [countyId, setCountyId] = useState<number | "">("");
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
      .from("wards")
      .select("id,county_id,name")
      .order("name")
      .then(({ data }) => setWards((data as Ward[]) ?? []));
    supabase.auth.getUser().then(({ data }) => {
      if (data.user)
        supabase
          .from("profiles")
          .select("county_id,ward_id,town")
          .eq("id", data.user.id)
          .maybeSingle()
          .then(({ data: p }) => {
            if (p) {
              setCountyId(p.county_id ?? "");
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

  const wardsForCounty = wards.filter((w) => w.county_id === Number(countyId));

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
          ward_id: wardId ? Number(wardId) : null,
          town,
          image_url: imageUrl || null,
          distance_km: distance,
          risk,
          duration_days: days,
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-10">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="text-3xl font-extrabold text-primary-dark">Post an ad</h1>
          <p className="text-muted-foreground">Reach thousands of buyers in your county.</p>

          {!createdId ? (
            <form
              onSubmit={submitListing}
              className="mt-6 bg-card rounded-2xl shadow ring-1 ring-black/5 p-6 space-y-4"
            >
              <Field label="Title" v={title} on={setTitle} required />
              <Field label="Description" v={desc} on={setDesc} textarea />
              <div className="grid grid-cols-2 gap-3">
                <NumField label="Price (KSh)" v={price} on={setPrice} required />
                <Sel
                  label="Category"
                  v={categoryId}
                  on={setCategoryId}
                  opts={[
                    { v: "", l: "Select" },
                    ...cats.map((c) => ({ v: c.id, l: c.parent_id ? `— ${c.name}` : c.name })),
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Sel
                  label="County"
                  v={countyId}
                  on={(v) => {
                    setCountyId(v);
                    setWardId("");
                  }}
                  opts={[{ v: "", l: "Select" }, ...counties.map((c) => ({ v: c.id, l: c.name }))]}
                />
                <Sel
                  label="Ward"
                  v={wardId}
                  on={setWardId}
                  opts={[{ v: "", l: "—" }, ...wardsForCounty.map((w) => ({ v: w.id, l: w.name }))]}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Town / Estate" v={town} on={setTown} />
                <Field label="Image URL" v={imageUrl} on={setImageUrl} />
              </div>

              <div className="pt-2 border-t border-border">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Ad settings
                </div>
                <div className="grid grid-cols-3 gap-3">
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

              <div className="flex items-center justify-between rounded-xl bg-accent/40 px-4 py-3">
                <div className="text-sm">Estimated ad fee</div>
                <div className="text-2xl font-extrabold text-primary-dark">KSh {fee ?? "—"}</div>
              </div>

              <button
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark hover:bg-primary text-white px-4 py-3 font-bold disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />} Create listing
              </button>
            </form>
          ) : (
            <div className="mt-6 bg-card rounded-2xl shadow ring-1 ring-black/5 p-6">
              <div className="flex items-center gap-2 text-primary-dark">
                <CheckCircle2 className="h-6 w-6" />
                <h2 className="text-xl font-bold">Listing saved — complete payment</h2>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Pay <b>KSh {fee}</b> via M-Pesa Paybill <b>247247</b>, Account{" "}
                <b>{createdId.slice(0, 8)}</b>, then paste the M-Pesa confirmation code below.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  value={mpesa}
                  onChange={(e) => setMpesa(e.target.value.toUpperCase())}
                  placeholder="e.g. QK7XX8Y9ZA"
                  className="flex-1 rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  disabled={loading || !mpesa}
                  onClick={payAd}
                  className="rounded-xl bg-primary-dark text-white px-5 py-2.5 font-bold disabled:opacity-60"
                >
                  Confirm payment
                </button>
              </div>
              <Link to="/dashboard" className="mt-4 inline-block text-sm text-primary underline">
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
    <label className="block text-sm">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      {textarea ? (
        <textarea
          value={v}
          onChange={(e) => on(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
        />
      ) : (
        <input
          required={required}
          value={v}
          onChange={(e) => on(e.target.value)}
          className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
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
    <label className="block text-sm">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <input
        type="number"
        min={0}
        required={required}
        value={v}
        onChange={(e) => on(Number(e.target.value))}
        className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
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
    <label className="block text-sm">
      <div className="text-xs font-semibold text-muted-foreground mb-1">{label}</div>
      <select
        value={v as string | number}
        onChange={(e) => {
          const raw = e.target.value;
          const cast = typeof opts[0]?.v === "number" && raw !== "" ? Number(raw) : raw;
          on(cast as T);
        }}
        className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary"
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
