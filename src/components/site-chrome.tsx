import { Link, useRouterState } from "@tanstack/react-router";
import {
  MessageCircle,
  Facebook,
  Instagram,
  Music2,
  LogOut,
  User,
  Menu,
  X,
  LayoutDashboard,
  ShieldAlert,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div
        className={`grid h-10 w-10 place-items-center rounded-xl ${light ? "bg-white/15 ring-1 ring-white/30" : "bg-primary/10"}`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`h-6 w-6 ${light ? "text-white" : "text-primary"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 20l8-16 8 16" />
          <path d="M8 20l4-8 4 8" />
        </svg>
      </div>
      <div className="leading-tight">
        <div
          className={`font-extrabold tracking-tight text-lg ${light ? "text-white" : "text-foreground"}`}
        >
          Sokonyumbani
        </div>
        <div
          className={`text-[10px] uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-muted-foreground"}`}
        >
          Local Market
        </div>
      </div>
    </Link>
  );
}

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: r } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        setIsAdmin(!!r?.some((x) => x.role === "admin"));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setEmail(s?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const navLinks: { to: string; label: string; search?: Record<string, string> }[] = [
    { to: "/", label: "Home" },
    { to: "/browse", label: "Browse" },
    { to: "/browse", label: "Donation Hub", search: { listing_type: "donation" } },
    ...(email ? [{ to: "/dashboard", label: "Dashboard" }] : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  return (
    <header className="bg-primary text-white sticky top-0 z-40 shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5">
        <Logo light />

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/90">
          {navLinks.map((n) => (
            <Link key={n.to} to={n.to} className="hover:text-white transition-colors">
              {n.label}
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-2">
          {email ? (
            <>
              <Link
                to="/sell"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition"
              >
                <Tag className="h-3.5 w-3.5" /> Post Ad
              </Link>
              <button
                onClick={signOut}
                aria-label="Sign out"
                title="Sign out"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/auth"
                className="inline-flex items-center gap-1.5 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition"
              >
                Sell
              </Link>
              <Link
                to="/auth"
                aria-label="Sign in"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <User className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-primary-dark px-5 py-4 space-y-1 animate-in slide-in-from-top duration-200">
          {navLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10 hover:text-white transition"
            >
              {n.to === "/" && <span>🏠</span>}
              {n.to === "/browse" && <span>🔍</span>}
              {n.to === "/dashboard" && <LayoutDashboard className="h-4 w-4" />}
              {n.to === "/admin" && <ShieldAlert className="h-4 w-4" />}
              {n.label}
            </Link>
          ))}
          <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
            {email ? (
              <>
                <Link
                  to="/sell"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-white text-primary py-2.5 text-sm font-bold"
                >
                  <Tag className="h-4 w-4" /> Post an Ad
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-white/10 text-white py-2.5 text-sm font-semibold"
                >
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-white text-primary py-2.5 text-sm font-bold"
              >
                <User className="h-4 w-4" /> Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="relative bg-primary-dark text-white mt-16">
      <div aria-hidden className="absolute inset-y-0 left-0 w-16 kente-pattern opacity-90" />
      <div aria-hidden className="absolute inset-y-0 right-0 w-16 kente-pattern opacity-90" />
      <div className="mx-auto max-w-7xl px-6 md:px-24 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Logo light />
          <p className="mt-4 text-sm text-white/75 max-w-xs">
            Your trusted platform for buying and selling locally across Kenya — safely &amp; honestly.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/sell" className="hover:text-white transition-colors">Sell an Item</Link></li>
            <li><Link to="/browse" className="hover:text-white transition-colors">Browse Listings</Link></li>
            <li><Link to="/auth" className="hover:text-white transition-colors">Sign In / Register</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {[MessageCircle, Facebook, Instagram, Music2].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <p className="mt-4 text-xs text-white/50">M-Pesa Paybill: 247247</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">
        © {new Date().getFullYear()} Sokonyumbani. All rights reserved. · Built for Kenya 🇰🇪
      </div>
    </footer>
  );
}

export function useCurrentRoute() {
  return useRouterState({ select: (s) => s.location.pathname });
}
