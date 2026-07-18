import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { Search } from "lucide-react";

export const Route = createFileRoute("/browse")({
  component: Browse,
  head: () => ({ meta: [
    { title: "Browse Marketplace — Vutabiz" },
    { name: "description", content: "Browse thousands of appliances and building materials for sale across Kenya." },
  ] }),
});

type Row = { id: string; title: string; price: number; image_url: string | null; town: string | null };

function Browse() {
  const [q, setQ] = useState(""); const [items, setItems] = useState<Row[]>([]);
  useEffect(() => {
    const t = setTimeout(async () => {
      let query = supabase.from("listings").select("id,title,price,image_url,town").eq("status", "active").order("created_at", { ascending: false }).limit(60);
      if (q) query = query.ilike("title", `%${q}%`);
      const { data } = await query;
      setItems((data as Row[]) ?? []);
    }, 250);
    return () => clearTimeout(t);
  }, [q]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-extrabold text-primary-dark mb-4">Browse marketplace</h1>
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search iron sheets, TVs, sufurias…"
              className="w-full rounded-xl border border-input bg-white pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((it) => (
              <Link key={it.id} to="/listing/$id" params={{ id: it.id }} className="group rounded-2xl overflow-hidden bg-card ring-1 ring-black/5 shadow-sm hover:shadow-lg transition">
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {it.image_url && <img src={it.image_url} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition" />}
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.town}</div>
                  <div className="mt-1 text-primary-dark font-extrabold">KSh {Number(it.price).toLocaleString()}</div>
                </div>
              </Link>
            ))}
            {!items.length && <div className="col-span-full text-muted-foreground">No listings match.</div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
