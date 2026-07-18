import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { respondOffer, updateListingStatus } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import { Check, X, Trash2, PackageCheck } from "lucide-react";

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

function Dashboard() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [buyers, setBuyers] = useState<Record<string, { full_name: string; phone: string }>>({});
  const [userId, setUserId] = useState<string>("");
  const respond = useServerFn(respondOffer);
  const setStatus = useServerFn(updateListingStatus);

  const load = useCallback(async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) return;
    setUserId(u.user.id);
    const { data: mine } = await supabase
      .from("listings")
      .select("id,title,price,status,ad_paid,ad_fee_ksh,image_url")
      .eq("seller_id", u.user.id)
      .order("created_at", { ascending: false });
    setListings((mine as Listing[]) ?? []);
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
        (bs ?? []).forEach(
          (b) => (map[b.id] = { full_name: b.full_name as string, phone: b.phone as string }),
        );
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
      toast.success("Updated");
      await load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-primary-dark">My dashboard</h1>
            <div className="flex gap-2">
              <Link
                to="/store/$userId"
                params={{ userId }}
                className="rounded-xl bg-white ring-1 ring-primary text-primary px-4 py-2 font-semibold"
              >
                My store
              </Link>
              <Link
                to="/sell"
                className="rounded-xl bg-primary-dark text-white px-4 py-2 font-semibold"
              >
                + New listing
              </Link>
            </div>
          </div>

          <section className="mt-8">
            <h2 className="text-lg font-bold mb-3">Listings</h2>
            <div className="grid gap-3">
              {listings.map((l) => (
                <div
                  key={l.id}
                  className="bg-card rounded-xl ring-1 ring-black/5 shadow-sm p-4 flex items-center gap-4"
                >
                  <div className="h-16 w-16 bg-muted rounded-lg overflow-hidden shrink-0">
                    {l.image_url && (
                      <img src={l.image_url} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/listing/$id"
                      params={{ id: l.id }}
                      className="font-semibold truncate block hover:text-primary"
                    >
                      {l.title}
                    </Link>
                    <div className="text-sm text-muted-foreground">
                      KSh {Number(l.price).toLocaleString()} · Ad KSh {l.ad_fee_ksh} ·{" "}
                      {l.ad_paid ? "paid" : "unpaid"}
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${l.status === "active" ? "bg-primary/10 text-primary-dark" : l.status === "sold" ? "bg-amber-100 text-amber-700" : "bg-muted text-muted-foreground"}`}
                  >
                    {l.status}
                  </span>
                  <div className="flex gap-1">
                    {l.status !== "sold" && (
                      <button
                        onClick={() => change(l.id, "sold")}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100"
                        title="Mark as sold"
                      >
                        <PackageCheck className="h-4 w-4" />
                      </button>
                    )}
                    {l.status !== "deleted" && (
                      <button
                        onClick={() => change(l.id, "deleted")}
                        className="grid h-9 w-9 place-items-center rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {!listings.length && (
                <div className="text-muted-foreground">
                  No listings yet.{" "}
                  <Link to="/sell" className="text-primary underline">
                    Post your first ad
                  </Link>
                  .
                </div>
              )}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="text-lg font-bold mb-3">Received offers</h2>
            <div className="grid gap-2">
              {offers.map((o) => {
                const buyer = buyers[o.buyer_id];
                return (
                  <div
                    key={o.id}
                    className="bg-card rounded-xl ring-1 ring-black/5 p-4 flex items-center gap-4"
                  >
                    <div className="flex-1">
                      <div className="text-sm font-semibold">
                        {buyer?.full_name ?? "Buyer"} offered{" "}
                        <span className="text-primary-dark">
                          KSh {Number(o.amount).toLocaleString()}
                        </span>
                      </div>
                      {o.message && (
                        <div className="text-sm text-muted-foreground italic">"{o.message}"</div>
                      )}
                      <Link
                        to="/listing/$id"
                        params={{ id: o.listing_id }}
                        className="text-xs text-primary underline"
                      >
                        View listing
                      </Link>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-1 rounded-full ${o.status === "accepted" ? "bg-primary/10 text-primary-dark" : o.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-accent text-foreground"}`}
                    >
                      {o.status}
                    </span>
                    {o.status === "pending" && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => act(o.id, "accepted")}
                          className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => act(o.id, "rejected")}
                          className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-muted-foreground"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
              {!offers.length && <div className="text-muted-foreground">No offers yet.</div>}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
