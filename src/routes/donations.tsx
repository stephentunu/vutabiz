import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { HeartHandshake, Gift, MapPin } from "lucide-react";

export const Route = createFileRoute("/donations")({
  component: DonationHub,
  head: () => ({
    meta: [
      { title: "Donation Hub — Vutabiz" },
      { name: "description", content: "Donate excess items or find donations for needy families, children's homes, and communities across Kenya." },
      { property: "og:title", content: "Donation Hub — Vutabiz" },
      { property: "og:description", content: "Give and receive donations across Kenya. Support local families, schools, and children's homes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

type Donation = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  town: string | null;
  landmark: string | null;
  donation_recipient: string | null;
  created_at: string;
};

function DonationHub() {
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    supabase
      .from("listings")
      .select("id,title,description,image_url,town,landmark,donation_recipient,created_at")
      .eq("listing_type", "donation")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(60)
      .then(({ data }) => {
        setItems((data as Donation[]) ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <section className="bg-primary-dark text-white py-8">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <HeartHandshake className="h-3.5 w-3.5" /> Donation Hub
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              Give what you can. Receive with dignity.
            </h1>
            <p className="mt-1 text-sm text-white/85 max-w-2xl">
              Browse items being donated by well-wishers across Kenya — clothing, furniture, appliances, food, school supplies and more. Have excess items? Post a donation to help a needy family, children's home, or community.
            </p>
          </div>
          {signedIn ? (
            <Link
              to="/sell"
              className="inline-flex items-center gap-2 rounded-full bg-accent text-primary-dark px-5 py-2.5 text-sm font-bold shadow hover:brightness-105"
            >
              <Gift className="h-4 w-4" /> Donate Now
            </Link>
          ) : (
            <Link
              to="/auth"
              search={{ next: "/sell" }}
              className="inline-flex items-center gap-2 rounded-full bg-accent text-primary-dark px-5 py-2.5 text-sm font-bold shadow hover:brightness-105"
            >
              <Gift className="h-4 w-4" /> Sign in to Donate
            </Link>
          )}
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        <h2 className="text-base font-extrabold text-primary-dark uppercase tracking-tight mb-3">
          Available Donations
        </h2>
        {loading ? (
          <div className="text-center py-10 text-sm text-muted-foreground">Loading donations…</div>
        ) : items.length === 0 ? (
          <div className="rounded-xl bg-card ring-1 ring-black/5 p-8 text-center">
            <HeartHandshake className="h-8 w-8 mx-auto text-primary/60" />
            <p className="mt-2 text-sm text-muted-foreground">
              No active donations yet. Be the first to donate!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {items.map((d) => (
              <Link
                key={d.id}
                to="/listing/$id"
                params={{ id: d.id }}
                className="group rounded-xl bg-card ring-1 ring-black/5 overflow-hidden hover:shadow-md transition flex flex-col"
              >
                <div className="aspect-video bg-muted/30">
                  {d.image_url ? (
                    <img src={d.image_url} alt={d.title} className="h-full w-full object-cover group-hover:scale-105 transition" loading="lazy" />
                  ) : (
                    <div className="h-full w-full grid place-items-center text-xs text-muted-foreground">
                      <HeartHandshake className="h-8 w-8 text-primary/40" />
                    </div>
                  )}
                </div>
                <div className="p-3 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-foreground line-clamp-2">{d.title}</h3>
                  {d.description && (
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{d.description}</p>
                  )}
                  {d.donation_recipient && (
                    <div className="mt-2 text-[11px] text-primary-dark bg-accent/30 rounded-md px-2 py-1">
                      <b>For:</b> {d.donation_recipient}
                    </div>
                  )}
                  {(d.town || d.landmark) && (
                    <div className="mt-auto pt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{[d.town, d.landmark].filter(Boolean).join(" · ")}</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
