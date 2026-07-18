import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/store/$userId")({
  component: StorePage,
  head: ({ params }) => ({
    meta: [
      { title: `Vutabiz Store · ${params.userId.slice(0, 8)}` },
      { name: "description", content: "Shop directly from this Vutabiz seller." },
      { property: "og:title", content: "Vutabiz Seller Store" },
      { property: "og:description", content: "Buy locally on Vutabiz — Kenya's marketplace." },
    ],
  }),
});

type Profile = { full_name: string; town: string | null; county_id: number | null };
type Row = { id: string; title: string; price: number; image_url: string | null; status: string };

function StorePage() {
  const { userId } = Route.useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [items, setItems] = useState<Row[]>([]);
  useEffect(() => {
    supabase
      .from("profiles")
      .select("full_name,town,county_id")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => setProfile(data as Profile | null));
    supabase
      .from("listings")
      .select("id,title,price,image_url,status")
      .eq("seller_id", userId)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .then(({ data }) => setItems((data as Row[]) ?? []));
  }, [userId]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-10">
        <div className="mx-auto max-w-6xl px-4">
          <div className="rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white p-8 shadow-lg">
            <div className="text-xs uppercase tracking-widest text-white/70">Vutabiz Store</div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-1">
              {profile?.full_name ?? "Seller"}
            </h1>
            {profile?.town && (
              <div className="mt-2 flex items-center gap-2 text-white/80">
                <MapPin className="h-4 w-4" /> {profile.town}
              </div>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map((it) => (
              <Link
                key={it.id}
                to="/listing/$id"
                params={{ id: it.id }}
                className="group rounded-2xl overflow-hidden bg-card ring-1 ring-black/5 shadow-sm hover:shadow-lg transition"
              >
                <div className="aspect-[4/3] bg-muted overflow-hidden">
                  {it.image_url && (
                    <img
                      src={it.image_url}
                      alt={it.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
                    />
                  )}
                </div>
                <div className="p-3">
                  <div className="text-sm font-semibold line-clamp-1">{it.title}</div>
                  <div className="mt-1 text-primary-dark font-extrabold">
                    KSh {Number(it.price).toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
            {!items.length && (
              <div className="col-span-full text-muted-foreground">No active listings yet.</div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
