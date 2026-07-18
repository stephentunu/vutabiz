import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminStats } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { Users, Package, HandCoins, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({ component: AdminPage });

type Stats = Awaited<ReturnType<typeof adminStats>>;

function AdminPage() {
  const fetchStats = useServerFn(adminStats);
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  useEffect(() => { fetchStats().then(setS).catch((e) => setErr(e instanceof Error ? e.message : "Access denied")); }, [fetchStats]);

  if (err) return (
    <div className="min-h-screen flex flex-col"><Header />
      <main className="flex-1 grid place-items-center"><div className="text-destructive font-bold">{err}</div></main>
    <Footer /></div>
  );
  if (!s) return (<div className="min-h-screen flex flex-col"><Header /><main className="flex-1 grid place-items-center">Loading…</main><Footer /></div>);

  const cards = [
    { icon: Users, label: "Users", value: s.users, tone: "bg-blue-50 text-blue-700" },
    { icon: Package, label: "Listings", value: s.listings, tone: "bg-primary/10 text-primary-dark" },
    { icon: HandCoins, label: "Offers", value: s.offers, tone: "bg-amber-50 text-amber-700" },
    { icon: TrendingUp, label: "Revenue (KSh)", value: s.revenue.toLocaleString(), tone: "bg-emerald-50 text-emerald-700" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-8">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl font-extrabold text-primary-dark">Admin dashboard</h1>
          <p className="text-muted-foreground">Site-wide activity across Vutabiz.</p>

          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {cards.map((c) => (
              <div key={c.label} className="bg-card rounded-2xl ring-1 ring-black/5 shadow-sm p-5">
                <div className={`inline-flex h-10 w-10 rounded-lg items-center justify-center ${c.tone}`}><c.icon className="h-5 w-5" /></div>
                <div className="mt-3 text-2xl font-extrabold">{c.value}</div>
                <div className="text-xs text-muted-foreground">{c.label}</div>
              </div>
            ))}
          </div>

          <section className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl ring-1 ring-black/5 shadow-sm p-5">
              <h2 className="font-bold mb-3">Recent listings</h2>
              <ul className="divide-y divide-border">
                {s.recentListings.map((l) => (
                  <li key={l.id} className="py-2 flex items-center gap-3 text-sm">
                    <div className="flex-1 truncate">{l.title}</div>
                    <div className="text-muted-foreground">KSh {Number(l.price).toLocaleString()}</div>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-muted">{l.status}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card rounded-2xl ring-1 ring-black/5 shadow-sm p-5">
              <h2 className="font-bold mb-3">Recent users</h2>
              <ul className="divide-y divide-border">
                {s.recentUsers.map((u) => (
                  <li key={u.id} className="py-2 flex items-center gap-3 text-sm">
                    <div className="flex-1 truncate">{u.full_name}</div>
                    <div className="text-muted-foreground text-xs">{u.email}</div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
