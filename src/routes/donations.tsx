import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { HeartHandshake, Gift, Eye, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/donations")({
  component: DonationHubLanding,
  head: () => ({
    meta: [
      { title: "Donation Hub — Sokonyumbani" },
      { name: "description", content: "Give and receive donations across Kenya. View available donations or donate excess items to needy families, children's homes, and communities." },
      { property: "og:title", content: "Donation Hub — Sokonyumbani" },
      { property: "og:description", content: "Give and receive donations across Kenya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function DonationHubLanding() {
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <section className="bg-primary-dark text-white py-10">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur px-3 py-1 text-xs font-bold uppercase tracking-wide">
            <HeartHandshake className="h-3.5 w-3.5" /> Donation Hub
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
            Give what you can. Receive with dignity.
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/85 max-w-2xl mx-auto">
            Browse donations from well-wishers across Kenya, or donate excess items to needy families, children's homes and communities.
          </p>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* View donations */}
          <Link
            to="/donations/view"
            className="group rounded-2xl bg-card ring-1 ring-black/5 shadow-sm p-6 flex flex-col hover:shadow-lg transition"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Eye className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-primary-dark">View Donations</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              See all donations available across categories and locations in Kenya. No sign-in required.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
              Browse now <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* Donate */}
          <Link
            to={signedIn ? "/sell" : "/auth"}
            search={signedIn ? undefined : ({ next: "/sell" } as never)}
            className="group rounded-2xl bg-accent/40 ring-1 ring-primary/20 shadow-sm p-6 flex flex-col hover:shadow-lg transition"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white">
              <Gift className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-primary-dark">Donate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Post an item you'd like to donate. {signedIn ? "You're signed in — go ahead." : "Sign in or create an account first."}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-dark group-hover:gap-2 transition-all">
              {signedIn ? "Donate an item" : "Sign in to donate"} <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
