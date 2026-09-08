import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Header, Footer } from "./site-chrome";

interface LegalSection {
  id?: string;
  heading: string;
  body: ReactNode;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  intro?: ReactNode;
  sections: LegalSection[];
}

/**
 * Shared layout for the legal / policy pages linked from the site footer.
 * Renders the standard Header/Footer chrome with a clean, readable prose column.
 */
export function LegalPage({
  title,
  lastUpdated,
  effectiveDate,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page banner */}
        <div className="bg-primary text-white">
          <div className="mx-auto max-w-4xl px-5 md:px-8 py-12">
            <nav className="text-[11px] uppercase tracking-[0.18em] text-white/60 mb-3">
              <Link to="/" className="hover:text-white">Home</Link>
              <span className="mx-1.5">/</span>
              <span className="text-white/90">Legal</span>
              <span className="mx-1.5">/</span>
              <span className="text-white">{title}</span>
            </nav>
            <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
              {title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-1 text-sm text-white/80">
              <span>
                <span className="text-white/55">Last Updated:</span>{" "}
                {lastUpdated}
              </span>
              <span>
                <span className="text-white/55">Effective Date:</span>{" "}
                {effectiveDate}
              </span>
            </div>
          </div>
        </div>

        {/* Prose body */}
        <div className="mx-auto max-w-4xl px-5 md:px-8 py-10 md:py-14">
          {intro && (
            <div className="legal-intro mb-8 text-foreground/85 leading-relaxed">
              {intro}
            </div>
          )}

          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={i} id={s.id} className="scroll-mt-24">
                <h2 className="font-display text-lg md:text-xl font-bold text-foreground mb-3 tracking-tight">
                  {s.heading}
                </h2>
                <div className="legal-body text-[15px] leading-7 text-foreground/80">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          {/* Back-to-top */}
          <div className="mt-14 pt-6 border-t border-border">
            <Link
              to="/"
              className="text-sm font-semibold text-primary hover:text-primary-dark transition"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/** Small helpers to keep the policy bodies readable in route files. */
export function P({ children }: { children: ReactNode }) {
  return <p className="mb-3">{children}</p>;
}

export function OL({ children }: { children: ReactNode }) {
  return (
    <ol className="list-decimal pl-6 space-y-2 marker:text-muted-foreground">
      {children}
    </ol>
  );
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="list-disc pl-6 space-y-2 marker:text-muted-foreground">
      {children}
    </ul>
  );
}

export function LI({ children }: { children: ReactNode }) {
  return <li>{children}</li>;
}

export function Sub({ children }: { children: ReactNode }) {
  return (
    <div className="mt-3 mb-2 font-semibold text-foreground text-[14px]">
      {children}
    </div>
  );
}
