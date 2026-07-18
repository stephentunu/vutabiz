import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { respondOffer, updateListingStatus } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import {
  Check,
  X,
  Trash2,
  PackageCheck,
  Plus,
  Store,
  User,
  Phone,
  MapPin,
  CheckCircle2,
  Clock,
  XCircle,
  Package,
  HandCoins,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({ component: Dashboard });

type Listing = {
  id: string;
  title: string;
  price: number;
  status: string;
  ad_paid: boolean;
  ad_fee_ksh: number;
  image_url: string | null;
};
type Offer = {
  id: string;
  amount: number;
  message: string | null;
  status: string;
  listing_id: string;
  buyer_id: string;
  created_at: string;
};
type Profile = {
  full_name: string;
  email: string;
  phone: string;
  town: string | null;
  county_id: number | null;
};

function OfferStatusBadge({ status }: { status: string }) {
  if (status === "accepted")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="h-3 w-3" /> Accepted
      </span>
    );
  if (status === "rejected")
    return (
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
        <XCircle className="h-3 w-3" /> Rejected
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-0.5 rounded-full">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}

function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [buyers, setBuyers] = useState<Record<string, { full_name: string; phone: string }>>({});
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"listings" | "offers">("listings");

  const respond = useServerFn(respondOffer);
  const setStatus = useServerFn(updateListingStatus);

  const load = useCallback(async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setUserId(u.user.id);

    const [{ data: mine }, { data: prof }] = await Promise.all([
      supabase
        .from("listings")
        .select("id,title,price,status,ad_paid,ad_fee_ksh,image_url")
        .eq("seller_id", u.user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("profiles")
        .select("full_name,email,phone,town,county_id")
        .eq("id", u.user.id)
        .maybeSingle(),
    ]);

    setListings((mine as Listing[]) ?? []);
    setProfile(prof as Profile | null);

    const ids = (mine ?? []).map((m) => m.id);
    if (ids.length) {
      const { data: offs } = await supabase
        .from("offers")
        .select("id,amount,message,status,listing_id,buyer_id,created_at")
        .in("listing_id", ids)
        .order("created_at", { ascending: false });
      setOffers((offs as Offer[]) ?? []);

      const buyerIds = Array.from(new Set((offs ?? []).map((o) => o.buyer_id)));
      if (buyerIds.length) {
        const { data: bs } = await supabase
          .from("profiles")
          .select("id,full_name,phone")
          .in("id", buyerIds);
        const map: Record<string, { full_name: string; phone: string }> = {};
        (bs ?? []).forEach((b) => (map[b.id] = { full_name: b.full_name as string, phone: b.phone as string }));
        setBuyers(map);
      }
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: "accepted" | "rejected") {
    try {
      await respond({ data: { offer_id: id, action } });
      toast.success(`Offer ${action}`);
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  async function change(id: string, status: "sold" | "deleted") {
    try {
      await setStatus({ data: { listing_id: id, status } });
      toast.success("Listing updated");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  const activeListings = listings.filter((l) => l.status === "active").length;
  const pendingOffers = offers.filter((o) => o.status === "pending").length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-6xl px-4">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-primary-dark tracking-tight">
                My Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Welcome back, {profile?.full_name ?? "Seller"} 👋
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                to="/store/$userId"
                params={{ userId }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-primary text-primary px-4 py-2.5 text-sm font-semibold hover:bg-primary/5 transition"
              >
                <Store className="h-4 w-4" /> My Store
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary-dark text-white px-4 py-2.5 text-sm font-semibold hover:bg-primary transition shadow"
              >
                <Plus className="h-4 w-4" /> New Listing
              </Link>
            </div>
          </div>

          {/* Profile + Stats strip */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 mb-8">
            {/* Profile card */}
            {profile && (
              <div className="bg-card border border-border/40 rounded-2xl shadow-sm p-5 flex items-center gap-4 md:min-w-[260px]">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-base truncate">{profile.full_name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" /> {profile.phone || "—"}
                  </div>
                  {profile.town && (
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {profile.town}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mini stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                { icon: Package, label: "Total Listings", value: listings.length, color: "bg-primary/10 text-primary" },
                { icon: CheckCircle2, label: "Active Listings", value: activeListings, color: "bg-emerald-50 text-emerald-700" },
                { icon: HandCoins, label: "Pending Offers", value: pendingOffers, color: "bg-amber-50 text-amber-700" },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border/40 rounded-2xl shadow-sm p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl grid place-items-center shrink-0 ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xl font-extrabold">{s.value}</div>
                    <div className="text-[11px] text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted p-1 rounded-xl mb-5 w-fit">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "listings" ? "bg-white shadow text-primary-dark" : "text-muted-foreground hover:text-foreground"}`}
            >
              My Listings
              {listings.length > 0 && (
                <span className="ml-2 text-xs bg-primary text-white rounded-full px-1.5 py-0.5">{listings.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${activeTab === "offers" ? "bg-white shadow text-primary-dark" : "text-muted-foreground hover:text-foreground"}`}
            >
              Received Offers
              {pendingOffers > 0 && (
                <span className="ml-2 text-xs bg-amber-500 text-white rounded-full px-1.5 py-0.5">{pendingOffers}</span>
              )}
            </button>
          </div>

          {/* Listings tab */}
          {activeTab === "listings" && (
            <div className="space-y-3">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="bg-card rounded-2xl border border-border/40 shadow-sm p-4 flex items-center gap-4"
                >
                  <div className="h-16 w-16 bg-muted rounded-xl overflow-hidden shrink-0">
                    {l.image_url ? (
                      <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/listing/$id"
                      params={{ id: l.id }}
                      className="font-semibold truncate block hover:text-primary transition-colors"
                    >
                      {l.title}
                    </Link>
                    <div className="text-sm text-muted-foreground mt-0.5">
                      KSh {Number(l.price).toLocaleString()}
                      <span className="mx-1.5 text-border">·</span>
                      Ad fee: KSh {l.ad_fee_ksh}
                      <span className="mx-1.5 text-border">·</span>
                      <span className={l.ad_paid ? "text-emerald-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {l.ad_paid ? "✓ Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                      l.status === "active"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : l.status === "sold"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {l.status}
                  </span>
                  <div className="flex gap-1.5 shrink-0">
                    {l.status !== "sold" && (
                      <button
                        onClick={() => change(l.id, "sold")}
                        title="Mark as sold"
                        className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                      >
                        <PackageCheck className="h-4 w-4" />
                      </button>
                    )}
                    {l.status !== "deleted" && (
                      <button
                        onClick={() => change(l.id, "deleted")}
                        title="Delete listing"
                        className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!listings.length && (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/40">
                  <p className="text-muted-foreground">No listings yet.</p>
                  <Link
                    to="/sell"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-bold shadow hover:bg-primary-dark transition"
                  >
                    <Plus className="h-4 w-4" /> Post your first ad
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Offers tab */}
          {activeTab === "offers" && (
            <div className="space-y-3">
              {offers.map((o) => {
                const buyer = buyers[o.buyer_id];
                return (
                  <div
                    key={o.id}
                    className="bg-card rounded-2xl border border-border/40 shadow-sm p-4 flex items-center gap-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold">
                        <span className="text-foreground">{buyer?.full_name ?? "Buyer"}</span>{" "}
                        offered{" "}
                        <span className="text-primary-dark font-extrabold">
                          KSh {Number(o.amount).toLocaleString()}
                        </span>
                      </div>
                      {o.message && (
                        <div className="text-sm text-muted-foreground italic mt-0.5 truncate">
                          "{o.message}"
                        </div>
                      )}
                      <div className="flex items-center gap-3 mt-1.5">
                        <Link
                          to="/listing/$id"
                          params={{ id: o.listing_id }}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          View listing
                        </Link>
                        {buyer?.phone && (
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {buyer.phone}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString("en-KE", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                    <OfferStatusBadge status={o.status} />
                    {o.status === "pending" && (
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => act(o.id, "accepted")}
                          title="Accept offer"
                          className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => act(o.id, "rejected")}
                          title="Reject offer"
                          className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!offers.length && (
                <div className="text-center py-16 bg-card rounded-2xl border border-border/40">
                  <p className="text-muted-foreground">No offers received yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
