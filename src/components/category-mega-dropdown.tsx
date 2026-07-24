import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronRight } from "lucide-react";
import { CATEGORY_TREE } from "@/lib/category-tree";

/**
 * Two-level accordion / dropdown navigation for the four main categories.
 * - Click a main category → expands its sub-categories.
 * - Click a sub-category → expands the item list, each item links to /browse
 *   pre-filtered by the main-category slug and item query.
 */
export function CategoryMegaDropdown() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [openSub, setOpenSub] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {CATEGORY_TREE.map((group) => {
        const isOpen = openGroup === group.slug;
        return (
          <div
            key={group.slug}
            className="rounded-xl bg-card ring-1 ring-black/5 shadow-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => {
                setOpenGroup(isOpen ? null : group.slug);
                setOpenSub(null);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left font-extrabold text-sm uppercase tracking-wide transition ${
                isOpen ? "bg-primary text-white" : "bg-primary-dark/95 text-white hover:bg-primary"
              }`}
            >
              <span>{group.name}</span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <ul className="divide-y divide-border/40 bg-white">
                {group.children.map((sub) => {
                  const subKey = `${group.slug}:${sub.name}`;
                  const subOpen = openSub === subKey;
                  return (
                    <li key={sub.name}>
                      <button
                        type="button"
                        onClick={() => setOpenSub(subOpen ? null : subKey)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-bold transition ${
                          subOpen ? "bg-accent/40 text-primary-dark" : "hover:bg-muted/40 text-foreground"
                        }`}
                      >
                        <span>{sub.name}</span>
                        <ChevronRight
                          className={`h-3.5 w-3.5 transition-transform ${subOpen ? "rotate-90" : ""}`}
                        />
                      </button>
                      {subOpen && (
                        <ul className="bg-muted/20 px-3 py-2 grid grid-cols-2 gap-1">
                          {sub.items.map((item) => (
                            <li key={item}>
                              <Link
                                to="/browse"
                                search={{ category: group.slug, q: item }}
                                className="block truncate rounded px-2 py-1 text-[11px] text-foreground/80 hover:bg-primary hover:text-white transition"
                                title={item}
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
