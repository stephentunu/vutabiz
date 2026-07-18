import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, ShoppingCart, User, MessageCircle, Facebook, Instagram, Music2, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${light ? "bg-white/15 ring-1 ring-white/30" : "bg-primary/10"}`}>
        <svg viewBox="0 0 24 24" className={`h-6 w-6 ${light ? "text-white" : "text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l8-16 8 16" /><path d="M8 20l4-8 4 8" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight text-lg ${light ? "text-white" : "text-foreground"}`}>Vutabiz</div>
        <div className={`text-[10px] uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-muted-foreground"}`}>Local Market</div>
      </div>
    </Link>
  );
}

export function Header() {
  const [email, setEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      setEmail(data.user?.email ?? null);
      if (data.user) {
        const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
        setIsAdmin(!!r?.some((x) => x.role === "admin"));
      }
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setEmail(s?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="bg-primary text-white sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
        <Logo light />
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/90">
          <Link to="/" className="hover:text-white">Home</Link>
          <Link to="/browse" className="hover:text-white">Browse</Link>
          {email && <Link to="/dashboard" className="hover:text-white">Dashboard</Link>}
          {isAdmin && <Link to="/admin" className="hover:text-white">Admin</Link>}
        </nav>
        <div className="flex items-center gap-2">
          {email ? (
            <>
              <Link to="/sell" className="inline-flex items-center gap-1.5 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition">Sell</Link>
              <button onClick={signOut} aria-label="Sign out" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><LogOut className="h-4 w-4" /></button>
            </>
          ) : (
            <>
              <Link to="/auth" className="inline-flex items-center gap-1.5 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition">Sell</Link>
              <Link to="/auth" aria-label="Account" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><User className="h-4 w-4" /></Link>
            </>
          )}
        </div>
      </div>
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
          <p className="mt-4 text-sm text-white/75 max-w-xs">Your trusted platform for buying and selling locally across Kenya — safely & honestly.</p>
        </div>
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/sell" className="hover:text-white">Sell an Item</Link></li>
            <li><Link to="/browse" className="hover:text-white">Browse</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <div className="flex gap-3">
            {[MessageCircle, Facebook, Instagram, Music2].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">© {new Date().getFullYear()} Vutabiz. All rights reserved.</div>
    </footer>
  );
}

export function useCurrentRoute() {
  return useRouterState({ select: (s) => s.location.pathname });
}
