import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { makeOffer } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import { MessageCircle, Phone, Lock, MapPin } from "lucide-react";

export const Route = createFileRoute("/listing/$id")({
  component: ListingPage,
  head: ({ params }) => ({ meta: [
    { title: `Listing on Vutabiz` },
    { name: "description", content: `View listing ${params.id} on Vutabiz — Kenya's local marketplace.` },
  ] }),
});

type Listing = {
  id: string; title: string; description: string | null; price: number;
  image_url: string | null; seller_id: string; status: string;
  county_id: number | null; town: string | null;
};
type Seller = { full_name: string; phone: string; email: string };

function ListingPage() {
  const { id } = Route.useParams();
  const submit = useServerFn(makeOffer);
  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [countyName, setCountyName] = useState<string>("");
  const [me, setMe] = useState<string | null>(null);
  const [myOffer, setMyOffer] = useState<{ id: string; status: string; amount: number } | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data: l } = await supabase.from("listings").select("id,title,description,price,image_url,seller_id,status,county_id,town").eq("id", id).maybeSingle();
    setListing(l as Listing | null);
    if (l) {
      const { data: s } = await supabase.from("profiles").select("full_name,phone,email").eq("id", l.seller_id).maybeSingle();
      setSeller(s as Seller | null);
      if (l.county_id) {
        const { data: c } = await supabase.from("counties").select("name").eq("id", l.county_id).maybeSingle();
        setCountyName((c?.name as string) ?? "");
      }
      setAmount(Number(l.price));
    }
    const { data: u } = await supabase.auth.getUser();
    setMe(u.user?.id ?? null);
    if (u.user) {
      const { data: o } = await supabase.from("offers").select("id,status,amount").eq("listing_id", id).eq("buyer_id", u.user.id).order("created_at", { ascending: false }).limit(1);
      setMyOffer((o?.[0] as { id: string; status: string; amount: number } | undefined) ?? null);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function send() {
    if (!me) { window.location.href = "/auth"; return; }
    setLoading(true);
    try { await submit({ data: { listing_id: id, amount, message: msg } }); toast.success("Offer sent to seller."); await load(); setMsg(""); }
    catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); }
    finally { setLoading(false); }
  }

  if (!listing) return (<div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center">Loading…</main><Footer /></div>);

  const accepted = myOffer?.status === "accepted";
  const contactVisible = accepted || me === listing.seller_id;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-[1.2fr_1fr] gap-8">
          <div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-muted ring-1 ring-black/5">
              {listing.image_url ? <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
                : <div className="w-full h-full grid place-items-center text-muted-foreground">No image</div>}
            </div>
            <h1 className="mt-5 text-3xl font-extrabold text-primary-dark">{listing.title}</h1>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" /> {listing.town} {countyName && `· ${countyName}`}</div>
            <div className="mt-2 text-3xl font-black text-primary">KSh {Number(listing.price).toLocaleString()}</div>
            {listing.description && <p className="mt-4 text-foreground whitespace-pre-wrap">{listing.description}</p>}
          </div>

          <aside className="bg-card rounded-2xl shadow ring-1 ring-black/5 p-6 h-fit sticky top-24">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Seller</div>
            <div className="mt-1 text-lg font-bold">{seller?.full_name ?? "—"}</div>
            <Link to="/store/$userId" params={{ userId: listing.seller_id }} className="text-sm text-primary underline">Visit store</Link>

            <div className="mt-4">
              {contactVisible ? (
                <div className="space-y-2">
                  <a href={`tel:${seller?.phone}`} className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary-dark text-white px-4 py-3 font-bold"><Phone className="h-4 w-4" /> Call {seller?.phone}</a>
                  <a href={`https://wa.me/${(seller?.phone ?? "").replace(/\D/g,"")}`} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 rounded-xl bg-white ring-1 ring-primary text-primary px-4 py-3 font-bold"><MessageCircle className="h-4 w-4" /> WhatsApp</a>
                </div>
              ) : (
                <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground flex items-start gap-2">
                  <Lock className="h-4 w-4 mt-0.5" />
                  <span>Contact unlocks after the seller accepts your offer.</span>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-border pt-4">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Make an offer</div>
              {myOffer && (
                <div className={`mb-3 rounded-lg px-3 py-2 text-sm font-semibold ${myOffer.status === "accepted" ? "bg-primary/10 text-primary-dark" : myOffer.status === "rejected" ? "bg-destructive/10 text-destructive" : "bg-accent/50 text-foreground"}`}>
                  Your offer of KSh {Number(myOffer.amount).toLocaleString()} is {myOffer.status}.
                </div>
              )}
              {me !== listing.seller_id && (
                <>
                  <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full rounded-lg border border-input bg-white px-3 py-2.5 mb-2 outline-none focus:ring-2 focus:ring-primary" />
                  <textarea value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Optional message" rows={2} className="w-full rounded-lg border border-input bg-white px-3 py-2.5 mb-2 outline-none focus:ring-2 focus:ring-primary" />
                  <button disabled={loading} onClick={send} className="w-full rounded-xl bg-primary hover:bg-primary-dark text-white px-4 py-3 font-bold disabled:opacity-60">Send offer</button>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
