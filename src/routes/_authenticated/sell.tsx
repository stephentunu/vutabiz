import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { computeAdFee, createListing, payListingAd } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";
import { STATIC_SUB_COUNTIES } from "@/lib/location-data";
import { SKILL_CATEGORIES } from "@/lib/skills-data";

export const Route = createFileRoute("/_authenticated/sell")({ component: SellPage });

type Cat = { id: number; name: string; parent_id: number | null };
type County = { id: number; name: string };
type SubCounty = { id: number; county_id: number; name: string };
type Ward = { id: number; county_id: number; sub_county_id: number | null; name: string };

type ListingType = "sale" | "hire" | "service" | "donation";

const PAYMENT_OPTIONS = [
  "M-Pesa",
  "Pochi la Biashara",
  "Airtel Money",
  "T-Kash",
  "Bank Transfer",
  "Cash on Delivery/Receipt",
];
const WORK_RATE_OPTIONS = [
  { v: "hourly", l: "Hourly" },
  { v: "weekly", l: "Weekly" },
  { v: "monthly", l: "Monthly" },
  { v: "agreed", l: "Agreed with employer" },
];
const EDU_OPTIONS: { v: string; l: string }[] = [
  { v: "none", l: "None" },
  { v: "kcpe", l: "KCPE" },
  { v: "kcse", l: "KCSE" },
  { v: "certificate", l: "Certificate" },
  { v: "diploma", l: "Diploma" },
  { v: "degree", l: "Degree" },
];

const TYPES: { v: ListingType; l: string; desc: string }[] = [
  { v: "sale", l: "For Sale", desc: "Sell an item" },
  { v: "hire", l: "For Hire", desc: "Rent out an item" },
  { v: "service", l: "Service / Skill", desc: "Offer your skill" },
  { v: "donation", l: "Donate", desc: "Give to someone in need" },
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
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState<number>(1000);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [countyId, setCountyId] = useState<number | "">("");
  const [subCountyId, setSubCountyId] = useState<number | "">("");
  const [wardId, setWardId] = useState<number | "">("");
  const [town, setTown] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [distance, setDistance] = useState<number>(0);
  const [risk, setRisk] = useState<"low" | "medium" | "high">("low");
  const [days, setDays] = useState<number>(7);

  // Item-specific
  const [offersDelivery, setOffersDelivery] = useState(false);
  const [transport, setTransport] = useState("");
  const [payMethods, setPayMethods] = useState<string[]>(["M-Pesa"]);

  // Service-specific
  const [jobTitle, setJobTitle] = useState("");
  const [education, setEducation] = useState<string>("kcse");
  const [languagesText, setLanguagesText] = useState<string>("Swahili, English");
  const [experience, setExperience] = useState<number>(1);
  const [selfDesc, setSelfDesc] = useState("");
  const [workRateType, setWorkRateType] = useState<string>("hourly");
  const [skillCategorySlug, setSkillCategorySlug] = useState<string>("");
  const [skillSpecialty, setSkillSpecialty] = useState<string>("");

  // Donation-specific
  const [donationRecipient, setDonationRecipient] = useState("");

  // Location extra
  const [landmark, setLandmark] = useState("");

  const [fee, setFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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
      .from("subcounties")
      .select("id,county_id,name")
      .order("name")
      .then(
        ({ data }) => {
          if (data && data.length > 0) {
            setSubCounties(data as SubCounty[]);
          } else {
            setSubCounties(STATIC_SUB_COUNTIES as SubCounty[]);
          }
        },
        () => {
          setSubCounties(STATIC_SUB_COUNTIES as SubCounty[]);
        }
      );
    // Load wards in pages (Supabase caps rows at 1000 per response)
    (async () => {
      const pageSize = 1000;
      let from = 0;
      const acc: Ward[] = [];
      // Loop until we get a short page
      // (1,450 wards total → 2 pages)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { data, error } = await supabase
          .from("wards")
          .select("id,county_id,sub_county_id:subcounty_id,name")
          .order("name")
          .range(from, from + pageSize - 1);
        if (error || !data) break;
        acc.push(...(data as Ward[]));
        if (data.length < pageSize) break;
        from += pageSize;
      }
      if (acc.length === 0) {
        // Fallback to synthesised single-ward per subcounty
        setWards(
          STATIC_SUB_COUNTIES.map((sc) => ({
            id: 10000 + sc.id,
            county_id: sc.county_id,
            sub_county_id: sc.id,
            name: sc.name,
          })),
        );
      } else {
        setWards(acc);
      }
    })();

    // Pre-fill location from profile
    supabase.auth.getUser().then(({ data }) => {
      if (data.user)
        supabase
          .from("profiles")
          .select("county_id,ward_id,town,phone")
          .eq("id", data.user.id)
          .maybeSingle()
          .then(({ data: p }) => {
            if (p) {
              setCountyId(p.county_id ?? "");
              
              setWardId(p.ward_id ?? "");
              setTown(p.town ?? "");
              setContactPhone((p as { phone?: string | null }).phone ?? "");
            }
          });
    });
  }, []);

  useEffect(() => {
    if (!price || !countyId) { setFee(null); return; }
    const t = setTimeout(async () => {
      try {
        const res = await compute({ data: { price, county_id: Number(countyId), distance_km: distance, risk, duration_days: days } });
        setFee(res.fee);
      } catch { /* ignore */ }
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

  const togglePay = (m: string) =>
    setPayMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  async function handleImageUpload(file: File) {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${u.user.id}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("listing-images").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: signed } = await supabase.storage.from("listing-images").createSignedUrl(path, 60 * 60 * 24 * 365);
      setImageUrl(signed?.signedUrl || "");
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function submitListing(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const finalPrice = listingType === "donation" ? 0 : price;
      const res = await create({
        data: {
          title,
          description: desc,
          price: finalPrice,
          category_id: categoryId ? Number(categoryId) : null,
          county_id: countyId ? Number(countyId) : null,
          subcounty_id: subCountyId ? Number(subCountyId) : null,
          ward_id: wardId ? Number(wardId) : null,
          town,
          landmark: landmark || null,
          image_url: imageUrl || null,
          distance_km: distance,
          risk,
          duration_days: days,
          listing_type: listingType,
          contact_phone: contactPhone || null,
          offers_delivery: listingType === "sale" || listingType === "hire" ? offersDelivery : false,
          transport_means: offersDelivery ? transport || null : null,
          payment_methods: listingType !== "donation" ? payMethods : [],
          job_title: listingType === "service" ? jobTitle : null,
          education_level: listingType === "service" ? (education as "none"|"kcpe"|"kcse"|"certificate"|"diploma"|"degree") : null,
          languages: listingType === "service"
            ? languagesText.split(",").map((s) => s.trim()).filter(Boolean)
            : [],
          experience_years: listingType === "service" ? experience : null,
          self_description: listingType === "service" ? selfDesc : null,
          work_rate_type: listingType === "service" ? (workRateType as "hourly"|"weekly"|"monthly"|"agreed") : null,
          donation_recipient: listingType === "donation" ? donationRecipient || null : null,
        },
      });
      setCreatedId(res.id);
      setFee(res.ad_fee_ksh);
      if (listingType === "donation" || res.ad_fee_ksh === 0) {
        toast.success("Posted! Thank you for donating.");
        navigate({ to: "/thank-you", search: { url: `/listing/${res.id}`, listing: res.id } });
        return;
      }
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
      <main className="flex-1 bg-background py-5">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="text-xl font-extrabold text-primary-dark">Post an Ad</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Reach thousands of Kenyans in your county.</p>

          {!createdId ? (
            <form onSubmit={submitListing} className="mt-4 bg-card rounded-xl shadow ring-1 ring-black/5 p-4 space-y-3">
              {/* Type selector */}
              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">What are you posting?</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5">
                  {TYPES.map((t) => (
                    <button
                      type="button"
                      key={t.v}
                      onClick={() => setListingType(t.v)}
                      className={`rounded-lg border p-2 text-left transition ${listingType === t.v ? "border-primary bg-primary/10" : "border-border bg-white hover:border-primary/50"}`}
                    >
                      <div className="text-xs font-bold">{t.l}</div>
                      <div className="text-[10px] text-muted-foreground">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <Field label={listingType === "service" ? "Service title (e.g. Reliable Mason in Kisumu)" : "Title"} v={title} on={setTitle} required />

              {listingType === "service" && (
                <>
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field label="Job / Skill (e.g. Masonry, Tailoring, Plumbing)" v={jobTitle} on={setJobTitle} required />
                    <Sel label="Minimum Education" v={education} on={(v) => setEducation(v as string)} opts={EDU_OPTIONS.map((o) => ({ v: o.v, l: o.l }))} />
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <NumField label="Years of Experience" v={experience} on={setExperience} />
                    <NumField label={"Rate (KSh)"} v={price} on={setPrice} required />
                  </div>
                  <Sel
                    label="Work Rate"
                    v={workRateType}
                    on={(v) => setWorkRateType(v as string)}
                    opts={WORK_RATE_OPTIONS}
                  />
                  <Field
                    label="Languages Spoken (comma separated, e.g. Swahili, English, Kikuyu)"
                    v={languagesText}
                    on={setLanguagesText}
                  />
                  <Field label="Brief Self Description (skills, past works)" v={selfDesc} on={setSelfDesc} textarea />
                </>
              )}

              {listingType !== "service" && (
                <>
                  <Field label="Description" v={desc} on={setDesc} textarea />
                  <div className="grid grid-cols-2 gap-2.5">
                    {listingType !== "donation" ? (
                      <NumField label={listingType === "hire" ? "Rental price (KSh)" : "Price (KSh)"} v={price} on={setPrice} required />
                    ) : (
                      <div className="rounded-lg bg-accent/20 px-3 py-2 text-xs text-accent-foreground/80 flex items-center">Donations are free — no price.</div>
                    )}
                    <Sel label="Category" v={categoryId} on={setCategoryId} opts={[{ v: "", l: "Select" }, ...cats.map((c) => ({ v: c.id, l: c.parent_id ? `— ${c.name}` : c.name }))]} />
                  </div>
                </>
              )}

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
                <Field label="Visible Landmark (e.g. Near KCB, Opposite Total)" v={landmark} on={setLandmark} />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Field label="Contact Phone" v={contactPhone} on={setContactPhone} required />
              </div>

              {listingType === "donation" && (
                <Field
                  label="Donation Recipient (who/where — e.g. Nyumbani Children's Home, Kibera families)"
                  v={donationRecipient}
                  on={setDonationRecipient}
                  required
                />
              )}

              <div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Image {listingType === "service" ? "(optional)" : ""}
                </div>
                <div className="flex items-center gap-2.5">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploading}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f);
                    }}
                    className="text-xs"
                  />
                  {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
                  {imageUrl && !uploading && (
                    <img src={imageUrl} alt="preview" className="h-12 w-12 rounded object-cover ring-1 ring-black/10" />
                  )}
                </div>
              </div>

              {(listingType === "sale" || listingType === "hire") && (
                <div className="pt-2 border-t border-border space-y-2.5">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Delivery</div>
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={offersDelivery} onChange={(e) => setOffersDelivery(e.target.checked)} />
                    I offer delivery for this {listingType === "hire" ? "hire" : "item"}
                  </label>
                  {offersDelivery && (
                    <Field
                      label="Means of Transport / Courier (e.g. Boda Boda, Pickup, G4S Courier, Sendy)"
                      v={transport}
                      on={setTransport}
                    />
                  )}
                </div>
              )}

              {listingType !== "donation" && (
                <div className="pt-2 border-t border-border">
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Modes of Payment Accepted</div>
                  <div className="flex flex-wrap gap-1.5">
                    {PAYMENT_OPTIONS.map((p) => (
                      <button type="button" key={p} onClick={() => togglePay(p)} className={`text-[11px] px-2.5 py-1 rounded-full border ${payMethods.includes(p) ? "bg-primary text-white border-primary" : "bg-white border-border"}`}>{p}</button>
                    ))}
                  </div>
                </div>
              )}

              {listingType !== "donation" && (
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
              )}

              {listingType !== "donation" && (
                <div className="flex items-center justify-between rounded-lg bg-accent/40 px-3 py-2">
                  <div className="text-xs">Estimated ad fee</div>
                  <div className="text-lg font-extrabold text-primary-dark">KSh {fee ?? "—"}</div>
                </div>
              )}

              <button disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary-dark hover:bg-primary text-white px-4 py-2.5 text-sm font-bold disabled:opacity-60">
                {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} {listingType === "donation" ? "Post donation" : "Create listing"}
              </button>
            </form>
          ) : (
            <div className="mt-4 bg-card rounded-xl shadow ring-1 ring-black/5 p-4">
              <div className="flex items-center gap-2 text-primary-dark">
                <CheckCircle2 className="h-5 w-5" />
                <h2 className="text-base font-bold">Listing saved — complete payment</h2>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Pay <b>KSh {fee}</b> via M-Pesa Paybill <b>247247</b>, Account <b>{createdId.slice(0, 8)}</b>, then paste the M-Pesa code below.
              </p>
              <div className="mt-3 flex gap-2">
                <input value={mpesa} onChange={(e) => setMpesa(e.target.value.toUpperCase())} placeholder="e.g. QK7XX8Y9ZA" className="flex-1 rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
                <button disabled={loading || !mpesa} onClick={payAd} className="rounded-lg bg-primary-dark text-white px-4 py-2 text-sm font-bold disabled:opacity-60">Confirm payment</button>
              </div>
              <Link to="/dashboard" className="mt-3 inline-block text-xs text-primary underline">Skip for now</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, v, on, required, textarea }: { label: string; v: string; on: (v: string) => void; required?: boolean; textarea?: boolean; }) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      {textarea ? (
        <textarea value={v} onChange={(e) => on(e.target.value)} rows={3} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
      ) : (
        <input required={required} value={v} onChange={(e) => on(e.target.value)} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
      )}
    </label>
  );
}

function NumField({ label, v, on, required }: { label: string; v: number; on: (v: number) => void; required?: boolean; }) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      <input type="number" min={0} required={required} value={v} onChange={(e) => on(Number(e.target.value))} className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary" />
    </label>
  );
}

function Sel<T extends string | number | "">({ label, v, on, opts }: { label: string; v: T; on: (v: T) => void; opts: { v: T; l: string }[]; }) {
  return (
    <label className="block">
      <div className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-wide">{label}</div>
      <select
        value={v as string | number}
        onChange={(e) => {
          const raw = e.target.value;
          const cast = typeof opts.find((o) => o.v !== "")?.v === "number" && raw !== "" ? Number(raw) : raw;
          on(cast as T);
        }}
        className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      >
        {opts.map((o) => (
          <option key={String(o.v)} value={o.v as string | number}>{o.l}</option>
        ))}
      </select>
    </label>
  );
}
