import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { makeOffer } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import { MessageCircle, Phone, Lock, MapPin, ShoppingBag, Wrench, Users } from "lucide-react";

export const Route = createFileRoute("/listing/$id")({
  component: ListingPage,
  head: ({ params }) => ({
    meta: [
      { title: `Listing on Sokonyumbani` },
      {
        name: "description",
        content: `View listing ${params.id} on Sokonyumbani — Kenya's local marketplace.`,
      },
    ],
  }),
});

type Listing = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  seller_id: string;
  status: string;
  county_id: number | null;
  subcounty_id: number | null;
  ward_id: number | null;
  town: string | null;
  listing_type: "sale" | "hire" | "service" | "donation" | null;
  price_type: "fixed" | "daily" | "hourly" | null;
  offers_delivery: boolean | null;
  transport_means: string | null;
  payment_methods: string[] | null;
  job_title: string | null;
  education_level: string | null;
  languages: string[] | null;
  experience_years: number | null;
  self_description: string | null;
};
type Seller = { full_name: string; phone: string; email: string };

const LISTING_TYPE_CONFIG = {
  sale: {
    label: "For Sale",
    icon: ShoppingBag,
    color: "bg-primary/10 text-primary-dark border-primary/20",
  },
  hire: {
    label: "For Hire",
    icon: Wrench,
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  service: {
    label: "Service",
    icon: Users,
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
};

const PRICE_TYPE_LABEL = {
  fixed: "",
  daily: " / day",
  hourly: " / hr",
};

function ListingPage() {
  const { id } = Route.useParams();
  const submit = useServerFn(makeOffer);
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [countyName, setCountyName] = useState<string>("");
  const [subCountyName, setSubCountyName] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");
  const [me, setMe] = useState<string | null>(null);
  const [myOffer, setMyOffer] = useState<{ id: string; status: string; amount: number } | null>(
    null,
  );
  const [amount, setAmount] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data: l } = await supabase
      .from("listings")
      .select(
        "id,title,description,price,image_url,seller_id,status,county_id,subcounty_id,ward_id,town,listing_type,price_type,offers_delivery,transport_means,payment_methods,job_title,education_level,languages,experience_years,self_description",
      )
      .eq("id", id)
      .maybeSingle();
    setListing(l as Listing | null);
    if (l) {
      const { data: s } = await supabase
        .from("profiles")
        .select("full_name,phone,email")
        .eq("id", l.seller_id)
        .maybeSingle();
      setSeller(s as Seller | null);
      if (l.county_id) {
        const { data: c } = await supabase
          .from("counties")
          .select("name")
          .eq("id", l.county_id)
          .maybeSingle();
        setCountyName((c?.name as string) ?? "");
      }
      if ((l as Listing).subcounty_id) {
        const { data: sc } = await supabase
          .from("subcounties")
          .select("name")
          .eq("id", (l as Listing).subcounty_id!)
          .maybeSingle();
        setSubCountyName((sc?.name as string) ?? "");
      }
      if ((l as Listing).ward_id) {
        const { data: w } = await supabase
          .from("wards")
          .select("name")
          .eq("id", (l as Listing).ward_id!)
          .maybeSingle();
        setWardName((w?.name as string) ?? "");
      }
      setAmount(Number(l.price));
    }
    const { data: u } = await supabase.auth.getUser();
    setMe(u.user?.id ?? null);
    if (u.user) {
      const { data: o } = await supabase
        .from("offers")
        .select("id,status,amount")
        .eq("listing_id", id)
        .eq("buyer_id", u.user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      setMyOffer((o?.[0] as { id: string; status: string; amount: number } | undefined) ?? null);
    }
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [id]);

  async function send() {
    if (!me) {
      window.location.href = "/auth";
      return;
    }
    setLoading(true);
    try {
      await submit({ data: { listing_id: id, amount, message: msg } });
      toast.success(
        listing?.listing_type === "service" ? "Quote request sent to seller." : "Offer sent to seller.",
      );
      await load();
      setMsg("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  }

  if (!listing)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">Loading…</main>
        <Footer />
      </div>
    );

  const accepted = myOffer?.status === "accepted";
  const contactVisible = accepted || me === listing.seller_id;
  const typeConfig = listing.listing_type ? LISTING_TYPE_CONFIG[listing.listing_type] : null;
  const priceSuffix =
    listing.price_type && listing.price_type !== "fixed"
      ? PRICE_TYPE_LABEL[listing.price_type]
      : "";

  // Build location breadcrumb: County › Sub-County › Ward › Town
  const locationParts = [
    listing.town,
    wardName,
    subCountyName,
    countyName,
  ].filter(Boolean);
  const locationLabel = locationParts.reverse().join(" › ");

  const isService = listing.listing_type === "service";

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-4">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-[1.2fr_1fr] gap-5">
          <div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted ring-1 ring-black/5">
              {listing.image_url ? (
                <img
                  src={listing.image_url}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">
                  No image
                </div>
              )}
            </div>
            <div className="mt-3.5 flex items-start gap-2.5">
              {typeConfig && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${typeConfig.color} shrink-0 mt-0.5`}
                >
                  <typeConfig.icon className="h-3 w-3" />
                  {typeConfig.label}
                </span>
              )}
              <h1 className="text-xl font-extrabold text-primary-dark">{listing.title}</h1>
            </div>
            {locationLabel && (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span>{locationLabel}</span>
              </div>
            )}
            <div className="mt-1 text-2xl font-black text-primary">
              KSh {Number(listing.price).toLocaleString()}
              {priceSuffix && (
                <span className="text-sm font-semibold text-muted-foreground ml-1">{priceSuffix}</span>
              )}
            </div>
            {listing.description && (
              <p className="mt-3.5 text-xs md:text-sm text-foreground whitespace-pre-wrap">{listing.description}</p>
            )}

            {listing.listing_type === "service" && (
              <div className="mt-4 rounded-lg bg-accent/20 p-3 space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">Service Provider</div>
                {listing.job_title && <div><b>Job:</b> {listing.job_title}</div>}
                {listing.education_level && <div><b>Education:</b> {listing.education_level.toUpperCase()}</div>}
                {listing.experience_years != null && <div><b>Experience:</b> {listing.experience_years} yr(s)</div>}
                {listing.languages && listing.languages.length > 0 && <div><b>Languages:</b> {listing.languages.join(", ")}</div>}
                {listing.self_description && <div className="pt-1 whitespace-pre-wrap">{listing.self_description}</div>}
              </div>
            )}

            {(listing.offers_delivery || (listing.payment_methods && listing.payment_methods.length > 0)) && (
              <div className="mt-3 rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
                {listing.offers_delivery && (
                  <div><b>Delivery:</b> Available{listing.transport_means ? ` (${listing.transport_means})` : ""}</div>
                )}
                {listing.payment_methods && listing.payment_methods.length > 0 && (
                  <div><b>Payment:</b> {listing.payment_methods.join(", ")}</div>
                )}
              </div>
            )}

          </div>

          <aside className="bg-card rounded-xl shadow ring-1 ring-black/5 p-4.5 h-fit sticky top-20">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Seller
            </div>
            <div className="mt-0.5 text-base font-bold">{seller?.full_name ?? "—"}</div>
            <Link
              to="/store/$userId"
              params={{ userId: listing.seller_id }}
              className="text-xs text-primary underline"
            >
              Visit store
            </Link>

            <div className="mt-3">
              {contactVisible ? (
                <div className="space-y-1.5">
                  <a
                    href={`tel:${seller?.phone}`}
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary-dark text-white px-3 py-2 text-xs font-bold"
                  >
                    <Phone className="h-3.5 w-3.5" /> Call {seller?.phone}
                  </a>
                  <a
                    href={`https://wa.me/${(seller?.phone ?? "").replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-white ring-1 ring-primary text-primary px-3 py-2 text-xs font-bold"
                  >
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </div>
              ) : (
                <div className="rounded-lg bg-muted/60 p-3 text-xs text-muted-foreground flex items-start gap-1.5">
                  <Lock className="h-3.5 w-3.5 mt-0.5" />
                  <span>
                    {isService
                      ? "Contact unlocks after the seller accepts your quote request."
                      : "Contact unlocks after the seller accepts your offer."}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 border-t border-border pt-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                {isService ? "Request a Quote" : "Make an offer"}
              </div>
              {myOffer && (
                <div
                  className={`mb-2 rounded px-2.5 py-1.5 text-xs font-semibold ${myOffer.status === "accepted" ? "bg-primary/10 text-primary-dark" : myOffer.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/50 text-foreground"}`}
                >
                  Your {isService ? "quote" : "offer"} of KSh {Number(myOffer.amount).toLocaleString()} is {myOffer.status}.
                </div>
              )}
              {!me ? (
                <div className="bg-muted/50 rounded-lg p-3 text-center border border-border/50">
                  <p className="text-[11px] text-muted-foreground mb-2">
                    You must be signed in to {isService ? "request a quote" : "make an offer"} or view contact details.
                  </p>
                  <Link
                    to="/auth"
                    search={{ next: `/listing/${id}` }}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-primary text-white py-1.5 text-xs font-bold hover:bg-primary-dark transition"
                  >
                    Sign In
                  </Link>
                </div>
              ) : (
                me !== listing.seller_id && (
                  <>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder={isService ? "Your budget (KSh)" : "Your offer (KSh)"}
                      className="w-full rounded border border-input bg-white px-2.5 py-1.5 mb-1.5 outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                    <textarea
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      placeholder={isService ? "Describe the job / requirements" : "Optional message"}
                      rows={2}
                      className="w-full rounded border border-input bg-white px-2.5 py-1.5 mb-1.5 outline-none focus:ring-2 focus:ring-primary text-xs"
                    />
                    <button
                      disabled={loading}
                      onClick={send}
                      className="w-full rounded bg-primary hover:bg-primary-dark text-white px-3 py-2 text-xs font-bold disabled:opacity-60 cursor-pointer"
                    >
                      {isService ? "Send Quote Request" : "Send offer"}
                    </button>
                  </>
                )
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
