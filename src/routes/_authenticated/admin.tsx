import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminStats, updateListingStatus } from "@/lib/marketplace.functions";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import {
  Users,
  Package,
  HandCoins,
  TrendingUp,
  CheckCircle2,
  Trash2,
  PackageCheck,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  RefreshCw,
  ShieldAlert,
  BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Vutabiz" },
      { name: "description", content: "Vutabiz site-wide admin control panel." },
    ],
  }),
});

type Stats = Awaited<ReturnType<typeof adminStats>>;

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  tone: string;
  sub?: string;
}) {
  return (
    <div className="bg-card rounded-xl border border-border/40 shadow-sm p-3.5 flex flex-col gap-2">
      <div className={`inline-flex h-9 w-9 rounded-lg items-center justify-center ${tone}`}>
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <div className="text-lg font-extrabold tracking-tight">{value}</div>
        <div className="text-[10px] font-semibold text-muted-foreground mt-0.5">{label}</div>
        {sub && <div className="text-[9px] text-muted-foreground/70 mt-0.5">{sub}</div>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: "bg-orange-50 text-orange-700 border-orange-200",
    sold: "bg-amber-50 text-amber-700 border-amber-200",
    deleted: "bg-red-50 text-red-600 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status === "active" && <CheckCircle2 className="h-3 w-3" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function AdminPage() {
  const fetchStats = useServerFn(adminStats);
  const markStatus = useServerFn(updateListingStatus);
  const [s, setS] = useState<Stats | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"listings" | "users">("listings");

  const load = async () => {
    setRefreshing(true);
    try {
      const data = await fetchStats();
      setS(data);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Access denied");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (listingId: string, status: "sold" | "deleted") => {
    try {
      await markStatus({ data: { listing_id: listingId, status } });
      toast.success(`Listing marked as ${status}`);
      await load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to update");
    }
  };

  if (err)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center px-4 py-20">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-destructive/10 mb-4">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <h2 className="text-xl font-bold text-destructive mb-2">Access Denied</h2>
            <p className="text-muted-foreground text-sm">{err}</p>
            <Link to="/" className="mt-6 inline-flex rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-bold">
              Return Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );

  if (!s)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Loading admin data…</p>
          </div>
        </main>
        <Footer />
      </div>
    );

  const cards = [
    { icon: Users, label: "Total Users", value: s.users, tone: "bg-blue-50 text-blue-700", sub: "Registered accounts" },
    { icon: Package, label: "Total Listings", value: s.listings, tone: "bg-primary/10 text-primary-dark", sub: "All time" },
    { icon: HandCoins, label: "Total Offers", value: s.offers, tone: "bg-amber-50 text-amber-700", sub: "Buyer proposals" },
    { icon: TrendingUp, label: "Revenue (KSh)", value: Number(s.revenue).toLocaleString(), tone: "bg-orange-50 text-orange-700", sub: "Ad fees collected" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-4">
        <div className="mx-auto max-w-7xl px-4">
          {/* Page header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Admin Control Panel</span>
              </div>
              <h1 className="text-xl font-extrabold text-primary-dark tracking-tight">Site Dashboard</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Real-time activity across all of Vutabiz Kenya.</p>
            </div>
            <button
              onClick={load}
              disabled={refreshing}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 text-primary-dark border border-primary/20 px-3 py-1.5 text-xs font-semibold hover:bg-primary/20 transition disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {cards.map((c) => (
              <StatCard key={c.label} {...c} />
            ))}
          </div>

          {/* Revenue bar viz */}
          <div className="bg-card rounded-xl border border-border/40 shadow-sm p-3.5 mb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <h2 className="font-bold text-xs">Revenue at a Glance</h2>
            </div>
            <div className="flex items-end gap-1 h-16">
              {[
                { label: "Users", val: s.users, color: "bg-blue-400" },
                { label: "Listings", val: s.listings, color: "bg-primary" },
                { label: "Offers", val: s.offers, color: "bg-amber-400" },
                { label: "Revenue ÷100", val: Math.round(s.revenue / 100), color: "bg-orange-400" },
              ].map((bar) => {
                const max = Math.max(s.users, s.listings, s.offers, Math.round(s.revenue / 100), 1);
                const pct = Math.max(8, Math.round((bar.val / max) * 100));
                return (
                  <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-muted-foreground">{bar.val}</span>
                    <div className="w-full rounded-t-md" style={{ height: `${pct}%` }}>
                      <div className={`w-full h-full rounded-t-md ${bar.color}`} />
                    </div>
                    <span className="text-[8px] text-muted-foreground text-center">{bar.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabs: Listings | Users */}
          <div className="flex gap-1 bg-muted p-1 rounded-lg mb-3 w-fit">
            <button
              onClick={() => setActiveTab("listings")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "listings" ? "bg-white shadow text-primary-dark" : "text-muted-foreground hover:text-foreground"}`}
            >
              Recent Listings
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${activeTab === "users" ? "bg-white shadow text-primary-dark" : "text-muted-foreground hover:text-foreground"}`}
            >
              Recent Users
            </button>
          </div>

          {/* Listings table */}
          {activeTab === "listings" && (
            <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/40">
                <h2 className="font-bold text-sm flex items-center gap-1.5">
                  <Package className="h-3.5 w-3.5 text-primary" /> Recent Listings (last 10)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-2">Title</th>
                      <th className="px-4 py-2">Price</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {s.recentListings.map((l) => (
                      <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-medium max-w-[180px] truncate">
                          <Link
                            to="/listing/$id"
                            params={{ id: l.id }}
                            className="hover:text-primary hover:underline flex items-center gap-1"
                          >
                            {l.title}
                            <ExternalLink className="h-2.5 w-2.5 shrink-0" />
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-primary-dark font-bold">
                          KSh {Number(l.price).toLocaleString()}
                        </td>
                        <td className="px-4 py-2.5">
                          <StatusBadge status={l.status} />
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">
                          {new Date(l.created_at).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-4 py-2.5">
                          <div className="flex items-center gap-1">
                            {l.status !== "sold" && (
                              <button
                                onClick={() => handleStatusChange(l.id, "sold")}
                                title="Mark as sold"
                                className="grid h-7 w-7 place-items-center rounded-md bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200 transition cursor-pointer"
                              >
                                <PackageCheck className="h-3 w-3" />
                              </button>
                            )}
                            {l.status !== "deleted" && (
                              <button
                                onClick={() => handleStatusChange(l.id, "deleted")}
                                title="Delete listing"
                                className="grid h-7 w-7 place-items-center rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition cursor-pointer"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {s.recentListings.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-xs">
                          No listings yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Users table */}
          {activeTab === "users" && (
            <div className="bg-card rounded-xl border border-border/40 shadow-sm overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border/40">
                <h2 className="font-bold text-sm flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-primary" /> Recent Users (last 10)
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-muted/40 text-left text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Phone</th>
                      <th className="px-4 py-2">Joined</th>
                      <th className="px-4 py-2">Store</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {s.recentUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-2.5 font-semibold">{u.full_name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Mail className="h-2.5 w-2.5 shrink-0" /> {u.email}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5 shrink-0" /> {u.phone || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground text-[10px]">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5 shrink-0" />
                            {new Date(u.created_at).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-2.5">
                          <Link
                            to="/store/$userId"
                            params={{ userId: u.id }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:underline"
                          >
                            View Store <ExternalLink className="h-2.5 w-2.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {s.recentUsers.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground text-xs">
                          No users yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
