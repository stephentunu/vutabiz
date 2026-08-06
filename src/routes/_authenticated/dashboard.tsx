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
      <span className="inline-flex items-center gap-1 text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200 px-2 py-0.5 rounded-full">
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
      <main className="flex-1 py-4">
        <div className="mx-auto max-w-6xl px-4">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h1 className="text-xl font-extrabold text-primary-dark tracking-tight">
                My Dashboard
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Welcome back, {profile?.full_name ?? "Seller"} 👋
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Link
                to="/store/$userId"
                params={{ userId }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-primary text-primary px-3 py-1.8 text-xs font-semibold hover:bg-primary/5 transition"
              >
                <Store className="h-3.5 w-3.5" /> My Store
              </Link>
              <Link
                to="/sell"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary-dark text-white px-3 py-1.8 text-xs font-semibold hover:bg-primary transition shadow"
              >
                <Plus className="h-3.5 w-3.5" /> New Listing
              </Link>
            </div>
          </div>

          {/* Profile + Stats strip */}
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-3 mb-4">
            {/* Profile card */}
            {profile && (
              <div className="bg-card border border-border/40 rounded-xl shadow-sm p-3.5 flex items-center gap-3 md:min-w-[240px]">
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary shrink-0">
                  <User className="h-5.5 w-5.5" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm truncate">{profile.full_name}</div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Phone className="h-3 w-3" /> {profile.phone || "—"}
                  </div>
                  {profile.town && (
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" /> {profile.town}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Mini stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { icon: Package, label: "Total Listings", value: listings.length, color: "bg-primary/10 text-primary" },
                { icon: CheckCircle2, label: "Active Listings", value: activeListings, color: "bg-orange-50 text-orange-700" },
                { icon: HandCoins, label: "Pending Offers", value: pendingOffers, color: "bg-amber-50 text-amber-700" },
              ].map((s) => (
                <div key={s.label} className="bg-card border border-border/40 rounded-xl shadow-sm p-3 flex items-center gap-2.5">
                  <div className={`h-9 w-9 rounded-lg grid place-items-center shrink-0 ${s.color}`}>
                    <s.icon className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <div className="text-lg font-extrabold">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-0.5 bg-muted p-0.5 rounded-lg mb-4.5 w-fit">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "listings" ? "bg-white shadow text-primary-dark" : "text-muted-foreground hover:text-foreground"}`}
            >
              My Listings
              {listings.length > 0 && (
                <span className="ml-1.5 text-[10px] bg-primary text-white rounded-full px-1 py-0.2">{listings.length}</span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("offers")}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "offers" ? "bg-white shadow text-primary-dark" : "text-muted-foreground hover:text-foreground"}`}
            >
              Received Offers
              {pendingOffers > 0 && (
                <span className="ml-1.5 text-[10px] bg-amber-500 text-white rounded-full px-1 py-0.2">{pendingOffers}</span>
              )}
            </button>
          </div>

          {/* Listings tab */}
          {activeTab === "listings" && (
            <div className="space-y-2">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="bg-card rounded-xl border border-border/40 shadow-sm p-2.5 flex items-center gap-3"
                >
                  <div className="h-12 w-12 bg-muted rounded-lg overflow-hidden shrink-0">
                    {l.image_url ? (
                       <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full grid place-items-center text-muted-foreground text-[10px]">No img</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/listing/$id"
                      params={{ id: l.id }}
                      className="font-bold text-xs truncate block hover:text-primary transition-colors"
                    >
                      {l.title}
                    </Link>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      KSh {Number(l.price).toLocaleString()}
                      <span className="mx-1 text-border">·</span>
                      Ad: KSh {l.ad_fee_ksh}
                      <span className="mx-1 text-border">·</span>
                      <span className={l.ad_paid ? "text-orange-600 font-semibold" : "text-amber-600 font-semibold"}>
                        {l.ad_paid ? "✓ Paid" : "Unpaid"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      l.status === "active"
                        ? "bg-orange-50 text-orange-700 border-orange-200"
                        : l.status === "sold"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-muted text-muted-foreground border-border"
                    }`}
                  >
                    {l.status}
                  </span>
                  <div className="flex gap-1 shrink-0">
                    {l.status !== "sold" && (
                      <button
                        onClick={() => change(l.id, "sold")}
                        title="Mark as sold"
                        className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                      >
                        <PackageCheck className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {l.status !== "deleted" && (
                      <button
                        onClick={() => change(l.id, "deleted")}
                        title="Delete listing"
                        className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!listings.length && (
                <div className="text-center py-10 bg-card rounded-xl border border-border/40">
                  <p className="text-muted-foreground text-xs">No listings yet.</p>
                  <Link
                    to="/sell"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary text-white px-4 py-2 text-xs font-bold shadow hover:bg-primary-dark transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> Post your first ad
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Offers tab — grouped per listing so the seller can compare and pick one */}
          {activeTab === "offers" && (
            <div className="space-y-4">
              {listings
                .map((l) => ({ listing: l, list: offers.filter((o) => o.listing_id === l.id) }))
                .filter((g) => g.list.length > 0)
                .map(({ listing, list }) => {
                  const sorted = [...list].sort((a, b) => Number(b.amount) - Number(a.amount));
                  const best = sorted.find((o) => o.status === "pending")?.id;
                  const hasAccepted = list.some((o) => o.status === "accepted");
                  return (
                    <div
                      key={listing.id}
                      className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden"
                    >
                      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-muted/40 border-b border-border/40">
                        <div className="h-9 w-9 rounded-lg bg-muted overflow-hidden shrink-0">
                          {listing.image_url && (
                            <img src={listing.image_url} alt={listing.title} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate">{listing.title}</div>
                          <div className="text-[10px] text-muted-foreground">
                            Asking KSh {Number(listing.price).toLocaleString()} · {list.length} offer
                            {list.length > 1 ? "s" : ""}
                          </div>
                        </div>
                        {hasAccepted && (
                          <span className="text-[10px] font-bold text-orange-700 bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5">
                            Offer accepted
                          </span>
                        )}
                      </div>
                      <div className="divide-y divide-border/40">
                        {sorted.map((o) => {
                          const buyer = buyers[o.buyer_id];
                          return (
                            <div key={o.id} className="p-2.5 flex items-center gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold flex items-center gap-1.5 flex-wrap">
                                  <span className="text-foreground">{buyer?.full_name ?? "Buyer"}</span> offered{" "}
                                  <span className="text-primary-dark font-extrabold">
                                    KSh {Number(o.amount).toLocaleString()}
                                  </span>
                                  {o.id === best && !hasAccepted && (
                                    <span className="text-[9px] font-bold uppercase tracking-wide bg-primary/10 text-primary-dark border border-primary/20 rounded-full px-1.5 py-0.5">
                                      Highest
                                    </span>
                                  )}
                                </div>
                                {o.message && (
                                  <div className="text-[11px] text-muted-foreground italic mt-0.5 truncate">
                                    "{o.message}"
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {buyer?.phone && (
                                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                      <Phone className="h-2.5 w-2.5" /> {buyer.phone}
                                    </span>
                                  )}
                                  <span className="text-[10px] text-muted-foreground">
                                    {new Date(o.created_at).toLocaleDateString("en-KE", {
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </span>
                                </div>
                              </div>
                              <OfferStatusBadge status={o.status} />
                              {o.status === "pending" && (
                                <div className="flex gap-1 shrink-0">
                                  <button
                                    onClick={() => act(o.id, "accepted")}
                                    title="Accept this offer"
                                    className="grid h-8 w-8 place-items-center rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 transition cursor-pointer"
                                  >
                                    <Check className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => act(o.id, "rejected")}
                                    title="Reject offer"
                                    className="grid h-8 w-8 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="px-3 py-1.5 bg-muted/20 text-[10px] text-muted-foreground">
                        Accepting one offer automatically declines the rest and unlocks your contact for that buyer.{" "}
                        <Link to="/listing/$id" params={{ id: listing.id }} className="text-primary hover:underline font-bold">
                          View listing
                        </Link>
                      </div>
                    </div>
                  );
                })}
              {!offers.length && (
                <div className="text-center py-10 bg-card rounded-xl border border-border/40">
                  <p className="text-muted-foreground text-xs">No offers received yet.</p>
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
