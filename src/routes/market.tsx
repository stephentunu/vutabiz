import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { MessagesSquare, HelpCircle, Search, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/market")({
  component: MarketInquiryHub,
  head: () => ({
    meta: [
      { title: "Market Inquiry — Sokonyumbani" },
      {
        name: "description",
        content:
          "Ask the market whether an item is still valuable, or explore what other members have already listed and enquired about — no sign-in required to look around.",
      },
      { property: "og:title", content: "Market Inquiry — Sokonyumbani" },
      { property: "og:description", content: "Ask the market or explore existing enquiries across Kenya." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function MarketInquiryHub() {
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
            <MessagesSquare className="h-3.5 w-3.5" /> Market Inquiry
          </div>
          <h1 className="mt-3 text-3xl md:text-4xl font-extrabold uppercase tracking-tight">
            Not sure it's still worth something?
          </h1>
          <p className="mt-2 text-sm md:text-base text-white/85 max-w-2xl mx-auto">
            Ask the market and list what you think buyers might want, or explore what other members have
            already listed and enquired about near you.
          </p>
        </div>
      </section>

      <main className="flex-1 mx-auto max-w-5xl w-full px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Ask the Market — requires sign in, then goes to the independent posting page */}
          <Link
            to={signedIn ? "/sell" : "/auth"}
            search={signedIn ? undefined : ({ next: "/sell" } as never)}
            className="group rounded-2xl bg-accent/40 ring-1 ring-primary/20 shadow-sm p-6 flex flex-col hover:shadow-lg transition"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-white">
              <HelpCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-primary-dark">Ask the Market</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              List an item you're unsure is still valuable and see if the market wants it.{" "}
              {signedIn ? "You're signed in — go ahead." : "Sign in or create a free account first."}
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary-dark group-hover:gap-2 transition-all">
              {signedIn ? "List an item" : "Sign in to list an item"} <ArrowRight className="h-4 w-4" />
            </span>
          </Link>

          {/* Explore Enquiries — fully public, no auth required */}
          <Link
            to="/browse"
            className="group rounded-2xl bg-card ring-1 ring-black/5 shadow-sm p-6 flex flex-col hover:shadow-lg transition"
          >
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Search className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-primary-dark">Explore Enquiries</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              See everything the market has already asked about and listed, across every category and
              county. No sign-in required.
            </p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-primary group-hover:gap-2 transition-all">
              Explore now <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}