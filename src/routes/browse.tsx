import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Tag,
  Coins,
  Check,
  X,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

// Define the search validator schema using zod
const searchSchema = z.object({
  q: z.string().optional().catch(""),
  category: z.string().optional().catch(""),
  county: z.number().optional().catch(undefined),
  subcounty: z.number().optional().catch(undefined),
  ward: z.number().optional().catch(undefined),
  type: z.string().optional().catch(""),
  minPrice: z.number().optional().catch(undefined),
  maxPrice: z.number().optional().catch(undefined),
});


export const Route = createFileRoute("/browse")({
  validateSearch: searchSchema,
  component: Browse,
  head: () => ({
    meta: [
      { title: "Browse Marketplace — Vutabiz" },
      {
        name: "description",
        content: "Browse home appliances and building materials for sale across Kenya.",
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

type SubCounty = { id: number; county_id: number; name: string };
type Ward = { id: number; county_id: number; subcounty_id: number | null; name: string };

function Browse() {
  const { q, category, county, subcounty, ward, type, minPrice, maxPrice } = Route.useSearch();
  const navigate = useNavigate();

  const [items, setItems] = useState<ListingRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [counties, setCounties] = useState<County[]>([]);
  const [subcounties, setSubcounties] = useState<SubCounty[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [browseMode, setBrowseMode] = useState<"category" | "location">("category");


  // Filter input states
  const [searchVal, setSearchVal] = useState(q || "");
  const [minPriceVal, setMinPriceVal] = useState(minPrice !== undefined ? String(minPrice) : "");
  const [maxPriceVal, setMaxPriceVal] = useState(maxPrice !== undefined ? String(maxPrice) : "");
  const [selectedCounty, setSelectedCounty] = useState<string>(
    county !== undefined ? String(county) : "",
  );
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    supabase.from("categories").select("id,name,slug,parent_id").order("name").then(({ data }) => setCategories((data as Category[]) ?? []));
    supabase.from("counties").select("id,name").order("name").then(({ data }) => setCounties((data as County[]) ?? []));
    supabase.from("subcounties").select("id,county_id,name").order("name").then(({ data }) => setSubcounties((data as SubCounty[]) ?? []));
    supabase.from("wards").select("id,county_id,subcounty_id,name").order("name").then(({ data }) => setWards((data as Ward[]) ?? []));
  }, []);


  // Sync state with URL updates
  useEffect(() => {
    setSearchVal(q || "");
    setMinPriceVal(minPrice !== undefined ? String(minPrice) : "");
    setMaxPriceVal(maxPrice !== undefined ? String(maxPrice) : "");
    setSelectedCounty(county !== undefined ? String(county) : "");
  }, [q, category, county, minPrice, maxPrice]);

  // Main search query execution
  useEffect(() => {
    setLoading(true);
    const handler = setTimeout(async () => {
      try {
        let query = supabase
          .from("listings")
          .select("id,title,price,image_url,town,county_id,created_at")
          .eq("status", "active");

        if (q) {
          query = query.ilike("title", `%${q}%`);
        }

        if (county) query = query.eq("county_id", county);
        if (subcounty) query = query.eq("subcounty_id", subcounty);
        if (ward) query = query.eq("ward_id", ward);
        if (type) query = query.eq("listing_type", type as "sale" | "hire" | "service" | "donation");


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
  }, [q, category, county, subcounty, ward, type, minPrice, maxPrice, categories]);

  // Construct Category tree (Parent -> Children)
  const categoryTree = useMemo(() => {
    const parents = categories.filter((c) => c.parent_id === null);
    return parents.map((parent) => ({
      ...parent,
      children: categories.filter((c) => c.parent_id === parent.id),
    }));
  }, [categories]);

  // Apply filters function
  const applyFilters = (updates: {
    q?: string;
    category?: string;
    county?: number;
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
    navigate({
      to: "/browse",
      search: {},
    });
  };

  // Find names of active filters for chips
  const activeCountyName = counties.find((co) => co.id === county)?.name;
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
            <p className="text-xs text-muted-foreground mt-0.5">Find amazing items across Kenya</p>
          </div>
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-1.5 rounded-lg bg-primary text-white px-3 py-2 text-xs font-semibold shadow hover:bg-primary-dark transition cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>
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
            placeholder="Search solar panels, fridges, iron sheets, TVs..."
            className="w-full rounded-xl border border-border/70 bg-card pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-primary shadow-sm text-xs md:text-sm"
          />
        </div>

        {/* Filter chips */}
        {(q || category || county || minPrice !== undefined || maxPrice !== undefined) && (
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
                County: {activeCountyName}{" "}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => applyFilters({ county: undefined })}
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

            {/* Location (County) Filter */}
            <div className="bg-card rounded-xl ring-1 ring-black/5 shadow-sm p-4 border border-border/40">
              <h3 className="text-xs font-bold text-foreground mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Location
              </h3>
              <select
                value={selectedCounty}
                onChange={(e) =>
                  applyFilters({ county: e.target.value ? Number(e.target.value) : undefined })
                }
                className="w-full rounded-lg border border-input bg-white px-2.5 py-2 outline-none focus:ring-2 focus:ring-primary text-xs cursor-pointer"
              >
                <option value="">All Counties</option>
                {counties.map((co) => (
                  <option key={co.id} value={co.id}>
                    {co.name}
                  </option>
                ))}
              </select>
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
                {items.map((it) => (
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
                      </div>
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(it.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
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
                  Location (County)
                </h3>
                <select
                  value={selectedCounty}
                  onChange={(e) =>
                    applyFilters({ county: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="w-full rounded-lg border border-input bg-white px-3 py-2.5 outline-none focus:ring-2 focus:ring-primary text-sm"
                >
                  <option value="">All Counties</option>
                  {counties.map((co) => (
                    <option key={co.id} value={co.id}>
                      {co.name}
                    </option>
                  ))}
                </select>
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
