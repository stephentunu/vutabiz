import { createFileRoute } from "@tanstack/react-router";
import {
  Search, Heart, ShoppingCart, User, MapPin, ChevronDown, ArrowRight,
  ShieldCheck, Sparkles, Phone, Users, Instagram, Facebook, MessageCircle, Music2,
} from "lucide-react";

import heroMarket from "@/assets/hero-market.jpg";
import catHome from "@/assets/cat-home.jpg";
import catFurniture from "@/assets/cat-furniture.jpg";
import catConstruction from "@/assets/cat-construction.jpg";
import catFarm from "@/assets/cat-farm.jpg";
import pTank from "@/assets/p-tank.jpg";
import pSufuria from "@/assets/p-sufuria.jpg";
import pChair from "@/assets/p-chair.jpg";
import pFertilizer from "@/assets/p-fertilizer.jpg";
import pTools from "@/assets/p-tools.jpg";
import pBlender from "@/assets/p-blender.jpg";

export const Route = createFileRoute("/")({ component: Home });

const NAV = ["Home & Living", "Furniture", "Construction", "Farm & Produce", "Featured"];

const CATEGORIES = [
  { name: "Home & Living", desc: "Appliances, Kitchenware, Home Essentials", img: catHome },
  { name: "Furniture",     desc: "Tables, Sofas, Beds, Cabinets",              img: catFurniture },
  { name: "Construction",  desc: "Tools, Building Materials, Hardware",        img: catConstruction },
  { name: "Farm & Produce",desc: "Fresh Produce, Seeds, Agro Tools",           img: catFarm },
];

const TRENDING = [
  { tag: "Home & Living",  name: "4 Cubic Water Tank",   cta: "Contact Seller", img: pTank },
  { tag: "Home & Living",  name: "Mocha Enamel Pot",     cta: "Contact Seller", img: pSufuria },
  { tag: "Furniture",      name: "Wooden Dining Chair",  cta: "Contact Seller", img: pChair },
  { tag: "Farm & Produce", name: "NPK Fertilizer 50kg",  cta: "Order Produce",  img: pFertilizer },
  { tag: "Construction",   name: "Tool Set (Complete)",  cta: "Contact Seller", img: pTools },
  { tag: "Home & Living",  name: "Electric Blender",     cta: "Contact Seller", img: pBlender },
];

const WHY = [
  { icon: ShieldCheck, title: "Local & Authentic", body: "Find quality items from trusted sellers in your community." },
  { icon: Sparkles,    title: "Safe & Secure",     body: "Verified sellers, secure transactions and buyer protection." },
  { icon: Phone,       title: "Easy to Use",       body: "Simple browsing, quick listings and seamless trading." },
  { icon: Users,       title: "Support Local",     body: "Empower local businesses and grow your community." },
];

function KenteBar() {
  return (
    <div aria-hidden className="hidden md:block absolute inset-y-0 w-16 kente-pattern opacity-90" />
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`grid h-10 w-10 place-items-center rounded-xl ${light ? "bg-white/15 ring-1 ring-white/30" : "bg-primary/10"}`}>
        <svg viewBox="0 0 24 24" className={`h-6 w-6 ${light ? "text-white" : "text-primary"}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l8-16 8 16" /><path d="M8 20l4-8 4 8" />
        </svg>
      </div>
      <div className="leading-tight">
        <div className={`font-extrabold tracking-tight text-lg ${light ? "text-white" : "text-foreground"}`}>Vutabiz</div>
        <div className={`text-[10px] uppercase tracking-[0.18em] ${light ? "text-white/70" : "text-muted-foreground"}`}>Local Market</div>
      </div>
    </div>
  );
}

function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="bg-primary text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
          <Logo light />
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-white/90">
            {NAV.map((n) => (
              <a key={n} href="#" className="hover:text-white transition-colors">{n}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white text-primary px-4 py-2 text-sm font-semibold shadow-sm hover:shadow-md transition">
              Sell
            </button>
            <button aria-label="Wishlist" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><Heart className="h-4.5 w-4.5" /></button>
            <button aria-label="Cart" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><ShoppingCart className="h-4.5 w-4.5" /></button>
            <button aria-label="Account" className="grid h-9 w-9 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition"><User className="h-4.5 w-4.5" /></button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative">
          <img src={heroMarket} alt="Kenyan open-air market" className="absolute inset-0 h-full w-full object-cover" width={1600} height={900} />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/85 to-primary-dark/10" />
          <KenteBar />
          <div className="absolute right-0 inset-y-0 hidden md:block w-16 kente-pattern opacity-90" />

          <div className="relative mx-auto max-w-7xl px-6 md:px-16 py-14 md:py-24 text-white">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] uppercase">
                Your Trusted<br />Local Marketplace
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/85 max-w-md">
                Buy & sell quality used & new items, furniture, appliances, construction materials, farm produce & more — locally across Kenya.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-white text-primary-dark px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl transition">
                  Start Selling <ArrowRight className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/20 transition">
                  Browse Listings
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar — elevated so it doesn't overlap category tiles */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="relative -mt-10 md:-mt-14 z-10 rounded-2xl bg-white shadow-[0_20px_50px_-20px_rgba(30,60,30,0.35)] ring-1 ring-black/5 p-3 md:p-4">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-2 md:gap-3">
              <div className="flex items-center gap-3 px-4 py-3">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input placeholder="What are you looking for?" className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground" />
              </div>
              <div className="hidden md:flex items-center gap-2 border-l px-4 py-3 text-sm cursor-pointer hover:bg-muted rounded-lg">
                <span className="text-muted-foreground">Category</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="hidden md:flex items-center gap-2 border-l px-4 py-3 text-sm cursor-pointer hover:bg-muted rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="leading-tight">
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Location</div>
                  <div className="font-medium">Nairobi, Kisumu, Nakuru</div>
                </div>
              </div>
              <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark hover:bg-primary text-white px-6 py-3.5 text-sm font-bold transition">
                Search Marketplace <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-6 pt-14 pb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((c) => (
            <article key={c.name} className="group overflow-hidden rounded-2xl bg-card ring-1 ring-black/5 shadow-sm hover:shadow-lg transition">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={c.img} alt={c.name} width={800} height={600} loading="lazy" className="h-full w-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.desc}</p>
                <button className="mt-3 inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:bg-primary-dark transition">
                  Browse
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl md:text-2xl font-extrabold uppercase tracking-tight">Top Trending Items</h2>
          <button className="rounded-full bg-primary text-white px-4 py-1.5 text-xs font-semibold hover:bg-primary-dark transition">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRENDING.map((p) => (
            <article key={p.name} className="group rounded-2xl bg-card ring-1 ring-black/5 overflow-hidden hover:shadow-lg transition">
              <div className="px-3 pt-3">
                <span className="inline-block text-[10px] font-semibold text-primary-dark bg-secondary rounded-full px-2 py-0.5">{p.tag}</span>
              </div>
              <div className="aspect-square p-4">
                <img src={p.img} alt={p.name} width={600} height={600} loading="lazy" className="h-full w-full object-contain group-hover:scale-105 transition" />
              </div>
              <div className="px-3 pb-3">
                <h3 className="text-sm font-semibold text-foreground line-clamp-1">{p.name}</h3>
                <button className="mt-2 w-full rounded-lg bg-primary-dark text-white px-3 py-2 text-xs font-semibold hover:bg-primary transition">
                  {p.cta}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-center text-xl md:text-2xl font-extrabold uppercase text-primary-dark tracking-tight">Why Choose Vutabiz?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY.map((w) => (
            <div key={w.title} className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent/15 text-accent">
                <w.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-foreground">{w.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{w.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative bg-primary-dark text-white mt-8">
        <div aria-hidden className="absolute inset-y-0 left-0 w-16 kente-pattern opacity-90" />
        <div aria-hidden className="absolute inset-y-0 right-0 w-16 kente-pattern opacity-90" />
        <div className="mx-auto max-w-7xl px-6 md:px-24 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <Logo light />
            <p className="mt-4 text-sm text-white/75 max-w-xs">
              Your trusted platform for buying and selling locally across Kenya — safely & honestly.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="#" className="hover:text-white">Home</a></li>
              <li><a href="#" className="hover:text-white">Sell an Item</a></li>
              <li><a href="#" className="hover:text-white">Sponsored Items</a></li>
              <li><a href="#" className="hover:text-white">Categories</a></li>
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[MessageCircle, Facebook, Instagram, Music2].map((Icon, i) => (
                <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition">
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Vutabiz. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
