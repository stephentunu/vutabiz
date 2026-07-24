import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { HeartHandshake, Gift, MapPin, Filter } from "lucide-react";

export const Route = createFileRoute("/donations/view")({
  component: DonationList,
  head: () => ({
    meta: [
      { title: "View Donations — Sokonyumbani" },
      { name: "description", content: "Browse available donations across Kenya, filtered by category and location." },
      { property: "og:title", content: "View Donations — Sokonyumbani" },
      { property: "og:description", content: "Browse donations from well-wishers across Kenya." },
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
  category_id: number | null;
  county_id: number | null;
  created_at: string;
};

function DonationList() {
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);
  const [catFilter, setCatFilter] = useState<string>("");
  const [countyFilter, setCountyFilter] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    supabase.from("categories").select("id,name,slug").is("parent_id", null).order("name").then(({ data }) => setCategories(data ?? []));
    supabase.from("counties").select("id,name").order("name").then(({ data }) => setCounties(data ?? []));
    supabase
      .from("listings")
      .select("id,title,description,image_url,town,landmark,donation_recipient,category_id,county_id,created_at")
      .eq("listing_type", "donation")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(120)
      .then(({ data }) => {
        setItems((data as Donation[]) ?? []);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (catFilter && String(i.category_id) !== catFilter) return false;
      if (countyFilter && String(i.county_id) !== countyFilter) return false;
      return true;
    });
  }, [items, catFilter, countyFilter]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <section className="bg-primary-dark text-white py-6">
        <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row md:items-end md:justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wide">
              <HeartHandshake className="h-3.5 w-3.5" /> Available Donations
            </div>
            <h1 className="mt-2 text-2xl md:text-3xl font-extrabold uppercase tracking-tight">
              Donations across Kenya
            </h1>
            <p className="mt-1 text-sm text-white/85 max-w-2xl">
              Filter by category and county to find donations near you.
            </p>
          </div>
          <Link
            to={signedIn ? "/sell" : "/auth"}
            search={signedIn ? undefined : ({ next: "/sell" } as never)}
            className="inline-flex items-center gap-2 rounded-full bg-accent text-primary-dark px-5 py-2.5 text-sm font-bold shadow hover:brightness-105"
          >
            <Gift className="h-4 w-4" /> {signedIn ? "Donate an item" : "Sign in to Donate"}
          </Link>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-6">
        {/* Filters */}
        <div className="rounded-xl bg-card ring-1 ring-black/5 p-3 mb-4 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-dark">
            <Filter className="h-3.5 w-3.5" /> Filter:
          </div>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="text-xs font-semibold rounded-lg border border-border/60 bg-white px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="text-xs font-semibold rounded-lg border border-border/60 bg-white px-3 py-1.5 outline-none cursor-pointer"
          >
            <option value="">All Counties</option>
            {counties.map((co) => (
              <option key={co.id} value={co.id}>{co.name}</option>
            ))}
          </select>
          {(catFilter || countyFilter) && (
            <button
              onClick={() => { setCatFilter(""); setCountyFilter(""); }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Clear
            </button>
          )}
          <div className="ml-auto text-xs text-muted-foreground">
            {filtered.length} donation{filtered.length === 1 ? "" : "s"}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-sm text-muted-foreground">Loading donations…</div>
        ) : filtered.length === 0 ? (
          <div className="rounded-xl bg-card ring-1 ring-black/5 p-8 text-center">
            <HeartHandshake className="h-8 w-8 mx-auto text-primary/60" />
            <p className="mt-2 text-sm text-muted-foreground">
              No donations match your filters yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((d) => (
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
