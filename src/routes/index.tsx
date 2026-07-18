import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  MapPin,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Phone,
  Users,
} from "lucide-react";

import heroAppliances from "@/assets/hero-appliances.png";
import catHome from "@/assets/cat-home.jpg";
import catFurniture from "@/assets/cat-furniture.jpg";
import catConstruction from "@/assets/cat-construction.jpg";
import catFarm from "@/assets/cat-farm.jpg";

export const Route = createFileRoute("/")({ component: Home });

const CATEGORIES_MAPPING = [
  {
    name: "Home & Living",
    slug: "home-living",
    desc: "Appliances, Kitchenware, Home Essentials",
    img: catHome,
  },
  {
    name: "Furniture",
    slug: "furniture",
    desc: "Tables, Sofas, Beds, Cabinets",
    img: catFurniture,
  },
  {
    name: "Construction",
    slug: "construction",
    desc: "Tools, Building Materials, Hardware",
    img: catConstruction,
  },
  {
    name: "Farm & Produce",
    slug: "farm-produce",
    desc: "Fresh Produce, Seeds, Agro Tools",
    img: catFarm,
  },
];

type Listing = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  status: string;
  category_id: number | null;
  town: string | null;
};

function KenteBar() {
  return (
    <div aria-hidden className="hidden md:block absolute inset-y-0 w-16 kente-pattern opacity-90" />
  );
}

function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [counties, setCounties] = useState<{ id: number; name: string }[]>([]);
  const [trending, setTrending] = useState<Listing[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCounty, setSelectedCounty] = useState("");

  useEffect(() => {
    // Fetch main categories and counties
    supabase
      .from("categories")
      .select("id,name,slug")
      .is("parent_id", null)
      .order("name")
      .then(({ data }) => {
        setCategories(data ?? []);
      });
    supabase
      .from("counties")
      .select("id,name")
      .order("name")
      .then(({ data }) => {
        setCounties(data ?? []);
      });

    // Fetch top trending (active) items
    supabase
      .from("listings")
      .select("id,title,price,image_url,status,category_id,town")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setTrending((data as Listing[]) ?? []);
      });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/browse",
      search: {
        q: searchQuery || undefined,
        category: selectedCategory || undefined,
        county: selectedCounty ? Number(selectedCounty) : undefined,
      },
    });
  };

  const WHY = [
    {
      icon: ShieldCheck,
      title: "Local & Authentic",
      body: "Find quality items from trusted sellers in your community.",
    },
    {
      icon: Sparkles,
      title: "Safe & Secure",
      body: "Verified sellers, secure transactions and buyer protection.",
    },
    {
      icon: Phone,
      title: "Easy to Use",
      body: "Simple browsing, quick listings and seamless trading.",
    },
    {
      icon: Users,
      title: "Support Local",
      body: "Empower local businesses and grow your community.",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative">
          <img
            src={heroAppliances}
            alt="Kenyan home appliances and solar panels"
            className="absolute inset-0 h-full w-full object-cover"
            width={1600}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/85 to-primary-dark/10" />
          <KenteBar />
          <div className="absolute right-0 inset-y-0 hidden md:block w-16 kente-pattern opacity-90" />

          <div className="relative mx-auto max-w-7xl px-6 md:px-16 pt-20 pb-28 md:pt-32 md:pb-36 text-white">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-6xl font-extrabold leading-[1.05] uppercase">
                Your Trusted
                <br />
                Local Marketplace
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/85 max-w-md font-medium">
                Buy & sell home appliances, solar panels, electronics, and construction materials
                locally across Kenya with safe transactions.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/sell"
                  className="inline-flex items-center gap-2 rounded-full bg-white text-primary-dark px-6 py-3 text-sm font-bold shadow-lg hover:shadow-xl transition"
                >
                  Start Selling <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/browse"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur ring-1 ring-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/20 transition"
                >
                  Browse Listings
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Elevated Search bar */}
        <div className="mx-auto max-w-6xl px-6">
          <form
            onSubmit={handleSearch}
            className="relative -mt-16 md:-mt-20 z-10 rounded-2xl bg-white shadow-[0_20px_50px_-20px_rgba(30,60,30,0.35)] ring-1 ring-black/5 p-3 md:p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] items-center gap-2 md:gap-3">
              <div className="flex items-center gap-3 px-4 py-2 border-b md:border-b-0">
                <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground py-2"
                />
              </div>

              {/* Category Select */}
              <div className="flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-l text-sm text-foreground">
                <span className="text-muted-foreground shrink-0">Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-transparent outline-none font-medium cursor-pointer max-w-[120px] md:max-w-none text-ellipsis overflow-hidden"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location Select */}
              <div className="flex items-center gap-2 px-4 py-2 border-b md:border-b-0 md:border-l text-sm text-foreground">
                <MapPin className="h-4 w-4 text-primary shrink-0" />
                <div className="leading-tight flex flex-col">
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Location
                  </span>
                  <select
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="bg-transparent outline-none font-medium cursor-pointer text-sm"
                  >
                    <option value="">All Counties</option>
                    {counties.map((co) => (
                      <option key={co.id} value={co.id}>
                        {co.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-dark hover:bg-primary text-white px-6 py-3.5 text-sm font-bold transition cursor-pointer"
              >
                Search Marketplace <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl w-full px-6 pt-20 pb-10">
        <h2 className="text-2xl font-extrabold text-primary-dark uppercase tracking-tight mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES_MAPPING.map((c) => (
            <article
              key={c.name}
              className="group overflow-hidden rounded-2xl bg-card ring-1 ring-black/5 shadow-sm hover:shadow-lg transition"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.img}
                  alt={c.name}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-foreground">{c.name}</h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{c.desc}</p>
                <Link
                  to="/browse"
                  search={{ category: c.slug }}
                  className="mt-3 inline-flex items-center rounded-full bg-primary text-primary-foreground px-4 py-1.5 text-xs font-semibold hover:bg-primary-dark transition"
                >
                  Browse
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl w-full px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold uppercase tracking-tight text-primary-dark">
            Top Trending Items
          </h2>
          <Link
            to="/browse"
            className="rounded-full bg-primary text-white px-4 py-1.5 text-xs font-semibold hover:bg-primary-dark transition"
          >
            View All
          </Link>
        </div>

        {trending.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trending.map((p) => (
              <article
                key={p.id}
                className="group rounded-2xl bg-card ring-1 ring-black/5 overflow-hidden hover:shadow-lg transition flex flex-col justify-between"
              >
                <Link to="/listing/$id" params={{ id: p.id }} className="block">
                  <div className="aspect-square p-3 bg-muted/30">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        width={600}
                        height={600}
                        loading="lazy"
                        className="h-full w-full object-cover rounded-lg group-hover:scale-105 transition"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center text-xs text-muted-foreground rounded-lg">
                        No Image
                      </div>
                    )}
                  </div>
                  <div className="px-3 pb-2 pt-1">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 min-h-[40px]">
                      {p.title}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-0.5">{p.town}</div>
                    <div className="text-primary font-bold mt-1 text-sm">
                      KSh {Number(p.price).toLocaleString()}
                    </div>
                  </div>
                </Link>
                <div className="px-3 pb-3">
                  <Link
                    to="/listing/$id"
                    params={{ id: p.id }}
                    className="mt-2 w-full inline-flex items-center justify-center rounded-lg bg-primary-dark text-white py-2 text-xs font-semibold hover:bg-primary transition"
                  >
                    View Details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-2xl ring-1 ring-black/5">
            <p className="text-muted-foreground text-sm">
              No active listings yet. Be the first to post!
            </p>
            <Link
              to="/sell"
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary text-white px-5 py-2.5 text-sm font-semibold shadow hover:bg-primary-dark transition"
            >
              Post an Ad
            </Link>
          </div>
        )}
      </section>

      {/* WHY CHOOSE */}
      <section className="mx-auto max-w-7xl w-full px-6 py-14">
        <h2 className="text-center text-xl md:text-2xl font-extrabold uppercase text-primary-dark tracking-tight">
          Why Choose Vutabiz?
        </h2>
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

      <Footer />
    </div>
  );
}
