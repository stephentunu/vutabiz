import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { STATIC_SUB_COUNTIES } from "@/lib/location-data";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Tag,
  Coins,
  Check,
  X,
  ChevronDown,
  ShoppingBag,
  Wrench,
  Users,
} from "lucide-react";

// Define the search validator schema using zod
const searchSchema = z.object({
  q: z.string().optional().catch(""),
  category: z.string().optional().catch(""),
  county: z.number().optional().catch(undefined),
  sub_county: z.number().optional().catch(undefined),
  listing_type: z.enum(["sale", "hire", "service"]).optional().catch(undefined),
  minPrice: z.number().optional().catch(undefined),
  maxPrice: z.number().optional().catch(undefined),
});

export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  component: Browse,
  head: () => ({
    meta: [
      { title: "Browse Marketplace – Vutabiz" },
      {
        name: "description",
        content: "Browse home appliances, building materials, and services for sale across Kenya.",
      },
    ],
  }),
});

type ListingRow = {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  town: string | null;
  county_id: number | null;
  listing_type: "sale" | "hire" | "service" | null;
  price_type: "fixed" | "daily" | "hourly" | null;
  created_at: string;
};

type Category = {
  id: number;
  name: string;
  slug: string;
  parent_id: number | null;
};

type County = {
  id: number;
  name: string;
};

type SubCounty = {
  id: number;
  county_id: number;
  name: string;
};

const LISTING_TYPE_LABELS: Record<string, { label: string; icon: typeof ShoppingBag; color: string }> = {
  sale: { label: "For Sale", icon: ShoppingBag, color: "bg-primary/10 text-primary-dark" },
  hire: { label: "For Hire", icon: Wrench, color: "bg-amber-500/10 text-amber-700" },
  service: { label: "Service", icon: Users, color: "bg-emerald-500/10 text-emerald-700" },
};

const PRICE_TYPE_SUFFIX: Record<string, string> = {
  fixed: "",
  daily: "/day",
  hourly: "/hr",
};

function Browse() {
  const { q, category, county, sub_county, listing_type, minPrice, maxPrice } = Route.useSearch();
  const navigate = useNavigate();

  const [items, setItems] = useState<ListingRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [subCounties, setSubCounties] = useState<SubCounty[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter input states
  const [searchVal, setSearchVal] = useState(q || "");
  const [minPriceVal, setMinPriceVal] = useState(minPrice !== undefined ? String(minPrice) : "");
  const [maxPriceVal, setMaxPriceVal] = useState(maxPrice !== undefined ? String(maxPrice) : "");
  const [selectedCounty, setSelectedCounty] = useState<string>(
    county !== undefined ? String(county) : "",
  );
  const [selectedSubCounty, setSelectedSubCounty] = useState<string>(
    sub_county !== undefined ? String(sub_county) : "",
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch static categories, counties and sub_counties once
  useEffect(() => {
    supabase
      .from("categories")
      .select("id,name,slug,parent_id")
      .order("name")
      .then(({ data }) => {
        setCategories((data as Category[]) ?? []);
      });
    supabase
      .from("counties")
      .select("id,name")
      .order("name")
      .then(({ data }) => {
        setCounties((data as County[]) ?? []);
      });
    supabase
      .from("sub_counties")
      .select("id,county_id,name")
      .order("name")
      .then(({ data }) => {
        if (data && data.length > 0) {
          setSubCounties(data as SubCounty[]);
        } else {
          setSubCounties(STATIC_SUB_COUNTIES as SubCounty[]);
        }
      })
      .catch(() => {
        setSubCounties(STATIC_SUB_COUNTIES as SubCounty[]);
      });
  }, []);

  // Sync state with URL updates
  useEffect(() => {
    setSearchVal(q || "");
    setMinPriceVal(minPrice !== undefined ? String(minPrice) : "");
    setMaxPriceVal(maxPrice !== undefined ? String(maxPrice) : "");
    setSelectedCounty(county !== undefined ? String(county) : "");
    setSelectedSubCounty(sub_county !== undefined ? String(sub_county) : "");
  }, [q, category, county, sub_county, listing_type, minPrice, maxPrice]);

  // Main search query execution
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        let query = supabase
          .from("listings")
          .select("id,title,price,image_url,town,county_id,listing_type,price_type,created_at")
          .eq("status", "active");

        if (q) {
          query = query.ilike("title", `%${q}%`);
        }

        if (county) {
          query = query.eq("county_id", county);
        }

        if (sub_county) {
          query = query.eq("sub_county_id", sub_county);
        }

        if (listing_type) {
          query = query.eq("listing_type", listing_type);
        }

        if (minPrice !== undefined) {
          query = query.gte("price", minPrice);
        }

        if (maxPrice !== undefined) {
          query = query.lte("price", maxPrice);
        }

        // Handle category hierarchy (subcategories vs parent categories)
        if (category) {
          // Find if this category is a parent
          const cat = categories.find((c) => c.slug === category);
          if (cat) {
            if (cat.parent_id === null) {
              // It is a parent, get all child category IDs
              const childIds = categories.filter((c) => c.parent_id === cat.id).map((c) => c.id);
              const allIds = [cat.id, ...childIds];
              query = query.in("category_id", allIds);
            } else {
              // It is a child category
              query = query.eq("category_id", cat.id);
            }
          } else {
            // Fetch category row from DB if categories list isn't loaded yet
            const { data: dbCat } = await supabase
              .from("categories")
              .select("id,parent_id")
              .eq("slug", category)
              .maybeSingle();
            if (dbCat) {
              if (dbCat.parent_id === null) {
                const { data: children } = await supabase
                  .from("categories")
                  .select("id")
                  .eq("parent_id", dbCat.id);
                const allIds = [dbCat.id, ...(children?.map((c) => c.id) ?? [])];
                query = query.in("category_id", allIds);
              } else {
                query = query.eq("category_id", dbCat.id);
              }
            }
          }
        }

        const { data } = await query.order("created_at", { ascending: false }).limit(80);
        setItems((data as ListingRow[]) ?? []);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(handler);
  }, [q, category, county, sub_county, listing_type, minPrice, maxPrice, categories]);

  // Construct Category tree (Parent -> Children)
  const categoryTree = useMemo(() => {
    const parents = categories.filter((c) => c.parent_id === null);
    return parents.map((parent) => ({
      ...parent,
      children: categories.filter((c) => c.parent_id === parent.id),
    }));
  }, [categories]);

  // Sub-counties filtered by selected county
  const subCountiesForCounty = useMemo(
    () => subCounties.filter((sc) => sc.county_id === Number(selectedCounty)),
    [subCounties, selectedCounty],
  );

  // Apply filters function
  const applyFilters = (updates: {
    q?: string;
    category?: string;
    county?: number;
    sub_county?: number;
    listing_type?: "sale" | "hire" | "service";
    minPrice?: number;
    maxPrice?: number;
  }) => {
    navigate({
      to: "/browse",
      search: {
        q: updates.q !== undefined ? updates.q || undefined : q || undefined,
        category:
          updates.category !== undefined ? updates.category || undefined : category || undefined,
        county: updates.county !== undefined ? updates.county || undefined : county || undefined,
        sub_county:
          updates.sub_county !== undefined
            ? updates.sub_county || undefined
            : sub_county || undefined,
        listing_type:
          updates.listing_type !== undefined ? updates.listing_type : listing_type || undefined,
        minPrice:
          updates.minPrice !== undefined
            ? updates.minPrice !== -1
              ? updates.minPrice
              : undefined
            : minPrice || undefined,
        maxPrice:
          updates.maxPrice !== undefined
            ? updates.maxPrice !== -1
              ? updates.maxPrice
              : undefined
            : maxPrice || undefined,
      },
    });
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({
      minPrice: minPriceVal ? Number(minPriceVal) : -1,
      maxPrice: maxPriceVal ? Number(maxPriceVal) : -1,
    });
  };

  const handleClearFilters = () => {
    setSearchVal("");
    setMinPriceVal("");
    setMaxPriceVal("");
    setSelectedCounty("");
    setSelectedSubCounty("");
    navigate({
      to: "/browse",
      search: {},
    });
  };

  // Find names of active filters for chips
  const activeCountyName = counties.find((co) => co.id === county)?.name;
  const activeSubCountyName = subCounties.find((sc) => sc.id === sub_county)?.name;
  const activeCategoryName = categories.find((c) => c.slug === category)?.name;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="leading-tight">
            <h1 className="text-xl font-extrabold text-primary-dark tracking-tight">
              Marketplace
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">Find amazing items & services across Kenya</p>
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 rounded-lg bg-primary text-white px-3 py-2 text-xs font-semibold shadow hover:bg-primary-dark transition cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
        </div>

        {/* Listing type quick tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {(["", "sale", "hire", "service"] as const).map((type) => {
            const isActive = (listing_type ?? "") === type;
            const info = type ? LISTING_TYPE_LABELS[type] : null;
            return (
              <button
                key={type || "all"}
                onClick={() =>
                  navigate({
                    to: "/browse",
                    search: {
                      q: q || undefined,
                      category: category || undefined,
                      county: county || undefined,
                      sub_county: sub_county || undefined,
                      listing_type: (type as "sale" | "hire" | "service") || undefined,
                      minPrice: minPrice || undefined,
                      maxPrice: maxPrice || undefined,
                    },
                  })
                }
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition cursor-pointer border ${
                  isActive
                    ? "bg-primary text-white border-primary shadow"
                    : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {info && <info.icon className="h-3 w-3" />}
                {type ? info?.label : "All"}
              </button>
            );
          })}
        </div>

        {/* Search header bar */}
        <div className="mb-4 relative max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilters({ q: searchVal });
            }}
            placeholder="Search solar panels, fridges, plumbing, TVs..."
            className="w-full rounded-xl border border-border/70 bg-card pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs md:text-sm"
          />
        </div>

        {/* Filter chips */}
        {(q ||
          category ||
          county ||
          sub_county ||
          listing_type ||
          minPrice !== undefined ||
          maxPrice !== undefined) && (
          <div className="flex flex-wrap items-center gap-1.5 mb-4">
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Active Filters:
            </span>
            {q && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full">
                "{q}"{" "}
                <X className="h-3 w-3 cursor-pointer" onClick={() => applyFilters({ q: "" })} />
              </span>
            )}
            {listing_type && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full">
                {LISTING_TYPE_LABELS[listing_type]?.label}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: "/browse",
                      search: { q: q || undefined, category: category || undefined, county: county || undefined },
                    })
                  }
                />
              </span>
            )}
            {activeCategoryName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full">
                Category: {activeCategoryName}{" "}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => applyFilters({ category: "" })}
                />
              </span>
            )}
            {activeCountyName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full">
                {activeCountyName}{" "}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    navigate({
                      to: "/browse",
                      search: {
                        q: q || undefined,
                        category: category || undefined,
                        listing_type: listing_type || undefined,
                        minPrice: minPrice || undefined,
                        maxPrice: maxPrice || undefined,
                      },
                    })
                  }
                />
              </span>
            )}
            {activeSubCountyName && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full">
                {activeSubCountyName}{" "}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    applyFilters({ sub_county: undefined })
                  }
                />
              </span>
            )}
            {(minPrice !== undefined || maxPrice !== undefined) && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-primary/10 text-primary-dark px-2.5 py-1 rounded-full">
                Price: KSh {minPrice?.toLocaleString() || "0"} -{" "}
                {maxPrice?.toLocaleString() || "Max"}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => applyFilters({ minPrice: -1, maxPrice: -1 })}
                />
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-destructive hover:underline ml-1.5"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-[230px_1fr] gap-6">
          {/* DESKTOP SIDEBAR FILTERS */}
          <aside className="hidden md:block space-y-4">
            {/* Category Filter */}
            <div className="bg-card rounded-xl ring-1 ring-black/5 shadow-sm p-4 border border-border/40">
              <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary" /> Categories
              </h3>
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                <button
                  onClick={() => applyFilters({ category: "" })}
                  className={`w-full text-left text-xs font-bold flex justify-between items-center ${!category ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
                >
                  <span>All Categories</span>
                  {!category && <Check className="h-3.5 w-3.5" />}
                </button>
                <div className="border-t border-border/50 my-1.5" />
                {categoryTree.map((parent) => {
                  const isParentActive = category === parent.slug;
                  return (
                    <div key={parent.id} className="space-y-1">
                      <button
                        onClick={() => applyFilters({ category: parent.slug })}
                        className={`w-full text-left text-xs font-bold flex justify-between items-center ${isParentActive ? "text-primary" : "text-foreground/90 hover:text-primary"}`}
                      >
                        <span>{parent.name}</span>
                      </button>
                      {parent.children.length > 0 && (
                        <div className="pl-2.5 border-l border-border/80 ml-1 mt-0.5 space-y-0.5">
                          {parent.children.map((child) => {
                            const isChildActive = category === child.slug;
                            return (
                              <button
                                key={child.id}
                                onClick={() => applyFilters({ category: child.slug })}
                                className={`w-full text-left text-[11px] font-semibold py-0.5 block transition ${isChildActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"}`}
                              >
                                {child.name}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Location Filter: County → Sub-County */}
            <div className="bg-card rounded-xl ring-1 ring-black/5 shadow-sm p-4 border border-border/40">
              <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Location
              </h3>
              <div className="space-y-2">
                <select
                  value={selectedCounty}
                  onChange={(e) => {
                    setSelectedCounty(e.target.value);
                    setSelectedSubCounty("");
                    applyFilters({
                      county: e.target.value ? Number(e.target.value) : undefined,
                      sub_county: undefined,
                    });
                  }}
                  className="w-full rounded-lg border border-input bg-white px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary text-xs cursor-pointer"
                >
                  <option value="">All Counties</option>
                  {counties.map((co) => (
                    <option key={co.id} value={co.id}>
                      {co.name}
                    </option>
                  ))}
                </select>

                {selectedCounty && subCountiesForCounty.length > 0 && (
                  <select
                    value={selectedSubCounty}
                    onChange={(e) => {
                      setSelectedSubCounty(e.target.value);
                      applyFilters({
                        sub_county: e.target.value ? Number(e.target.value) : undefined,
                      });
                    }}
                    className="w-full rounded-lg border border-input bg-white px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary text-xs cursor-pointer"
                  >
                    <option value="">All Sub-Counties</option>
                    {subCountiesForCounty.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-card rounded-xl ring-1 ring-black/5 shadow-sm p-4 border border-border/40">
              <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-primary" /> Price Range (KSh)
              </h3>
              <form onSubmit={handlePriceApply} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceVal}
                    onChange={(e) => setMinPriceVal(e.target.value)}
                    className="w-full rounded-lg border border-input bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceVal}
                    onChange={(e) => setMaxPriceVal(e.target.value)}
                    className="w-full rounded-lg border border-input bg-white px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-primary text-white py-1.5 text-xs font-bold hover:bg-primary-dark transition cursor-pointer"
                >
                  Apply Price
                </button>
              </form>
            </div>
          </aside>

          {/* MAIN LISTINGS PANEL */}
          <div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm p-3 space-y-2.5"
                  >
                    <div className="aspect-[16/10] bg-muted rounded-lg w-full" />
                    <div className="h-3.5 bg-muted rounded w-2/3" />
                    <div className="h-2.5 bg-muted rounded w-1/3" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : items.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 animate-in fade-in duration-300">
                {items.map((it) => {
                  const typeInfo = it.listing_type ? LISTING_TYPE_LABELS[it.listing_type] : null;
                  const priceSuffix =
                    it.price_type && it.price_type !== "fixed"
                      ? PRICE_TYPE_SUFFIX[it.price_type]
                      : "";
                  return (
                    <Link
                      key={it.id}
                      to="/listing/$id"
                      params={{ id: it.id }}
                      className="group rounded-xl overflow-hidden bg-card border border-border/40 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        <div className="aspect-[16/10] bg-muted/20 overflow-hidden relative">
                          {it.image_url ? (
                            <img
                              src={it.image_url}
                              alt={it.title}
                              className="w-full h-full object-cover group-hover:scale-102 transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full grid place-items-center text-muted-foreground text-[10px]">
                              No image
                            </div>
                          )}
                          {/* Listing type badge */}
                          {typeInfo && it.listing_type !== "sale" && (
                            <span
                              className={`absolute top-1.5 right-1.5 inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${typeInfo.color}`}
                            >
                              <typeInfo.icon className="h-2.5 w-2.5" />
                              {typeInfo.label}
                            </span>
                          )}
                          <div className="absolute bottom-1.5 left-1.5 bg-black/60 backdrop-blur-sm text-white px-1.5 py-0.5 rounded text-[9px] flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" /> {it.town}
                          </div>
                        </div>
                        <div className="p-2.5">
                          <div className="text-xs font-bold text-foreground line-clamp-2 min-h-[32px] leading-tight group-hover:text-primary transition-colors">
                            {it.title}
                          </div>
                        </div>
                      </div>
                      <div className="px-2.5 pb-2.5 pt-0 flex items-center justify-between border-t border-border/40 mt-0.5">
                        <div className="text-primary-dark font-extrabold text-xs md:text-sm">
                          KSh {Number(it.price).toLocaleString()}
                          {priceSuffix && (
                            <span className="text-[10px] font-semibold text-muted-foreground ml-0.5">
                              {priceSuffix}
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-muted-foreground">
                          {new Date(it.created_at).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-10 bg-card rounded-xl border border-border/40 shadow-sm">
                <p className="text-muted-foreground text-xs font-semibold">
                  No active listings match your filters.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-3 rounded-lg bg-primary text-white px-4 py-2 text-xs font-semibold shadow hover:bg-primary-dark transition cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* MOBILE FILTERS SHEET */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Overlay */}
          <div
            onClick={() => setShowMobileFilters(false)}
            className="absolute inset-0 bg-black/50"
          />
          {/* Drawer Content */}
          <div className="relative w-full max-w-sm bg-background h-full overflow-y-auto p-6 shadow-xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" /> Filter Options
                </h2>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-1 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Listing Type */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Listing Type
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(["sale", "hire", "service"] as const).map((type) => {
                    const info = LISTING_TYPE_LABELS[type];
                    return (
                      <button
                        key={type}
                        onClick={() => {
                          applyFilters({ listing_type: type });
                          setShowMobileFilters(false);
                        }}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-semibold transition cursor-pointer ${
                          listing_type === type
                            ? "border-primary bg-primary/10 text-primary-dark"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        <info.icon className="h-3.5 w-3.5" />
                        {info.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Category Select */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Categories
                </h3>
                <select
                  value={category || ""}
                  onChange={(e) => applyFilters({ category: e.target.value || undefined })}
                  className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.parent_id ? `— ${c.name}` : c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mobile Location Select */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Location
                </h3>
                <select
                  value={selectedCounty}
                  onChange={(e) => {
                    setSelectedCounty(e.target.value);
                    setSelectedSubCounty("");
                    applyFilters({
                      county: e.target.value ? Number(e.target.value) : undefined,
                      sub_county: undefined,
                    });
                  }}
                  className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">All Counties</option>
                  {counties.map((co) => (
                    <option key={co.id} value={co.id}>
                      {co.name}
                    </option>
                  ))}
                </select>
                {selectedCounty && subCountiesForCounty.length > 0 && (
                  <select
                    value={selectedSubCounty}
                    onChange={(e) => {
                      setSelectedSubCounty(e.target.value);
                      applyFilters({
                        sub_county: e.target.value ? Number(e.target.value) : undefined,
                      });
                    }}
                    className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option value="">All Sub-Counties</option>
                    {subCountiesForCounty.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Mobile Price Select */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Price Range (KSh)
                </h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowMobileFilters(false);
                    handlePriceApply(e);
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPriceVal}
                      onChange={(e) => setMinPriceVal(e.target.value)}
                      className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPriceVal}
                      onChange={(e) => setMaxPriceVal(e.target.value)}
                      className="w-full rounded-lg border border-input bg-white px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-primary text-white py-2.5 text-sm font-bold hover:bg-primary-dark transition cursor-pointer"
                  >
                    Apply Price Range
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-6 border-t border-border mt-8 flex gap-2">
              <button
                onClick={() => {
                  handleClearFilters();
                  setShowMobileFilters(false);
                }}
                className="flex-1 rounded-xl bg-muted py-3 text-sm font-bold text-center"
              >
                Reset All
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 rounded-xl bg-primary text-white py-3 text-sm font-bold text-center cursor-pointer"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
