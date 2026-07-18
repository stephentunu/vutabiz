import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { CheckCircle2, Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/thank-you")({
  validateSearch: z.object({ url: z.string().optional(), listing: z.string().optional() }),
  component: ThankYou,
});

function ThankYou() {
  const { url, listing } = Route.useSearch();
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const share = url ? `${origin}${url}` : "";
  const copy = async () => { await navigator.clipboard.writeText(share); toast.success("Link copied!"); };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 grid place-items-center bg-background py-14 px-4">
        <div className="max-w-lg w-full bg-card rounded-2xl shadow-xl ring-1 ring-black/5 p-8 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-primary-dark">Thank you! Your ad is live.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Share your storefront on WhatsApp, Facebook or SMS to reach more buyers.</p>

          {share && (
            <div className="mt-6 rounded-xl bg-muted/60 p-3 flex items-center gap-2">
              <div className="flex-1 truncate text-sm text-left px-2">{share}</div>
              <button onClick={copy} className="grid h-9 w-9 place-items-center rounded-lg bg-white ring-1 ring-black/5"><Copy className="h-4 w-4" /></button>
              <a href={`https://wa.me/?text=${encodeURIComponent(share)}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-white"><MessageCircle className="h-4 w-4" /></a>
            </div>
          )}
          <div className="mt-6 flex gap-2 justify-center">
            {listing && <Link to="/listing/$id" params={{ id: listing }} className="rounded-xl bg-primary-dark text-white px-4 py-2.5 font-bold">View listing</Link>}
            <Link to="/dashboard" className="rounded-xl bg-white ring-1 ring-primary text-primary px-4 py-2.5 font-bold">Go to dashboard</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
