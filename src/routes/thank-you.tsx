import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Header, Footer } from "@/components/site-chrome";
import {
  CheckCircle2,
  Copy,
  MessageCircle,
  Facebook,
  Twitter,
  ArrowRight,
  Store,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/thank-you")({
  validateSearch: z.object({ url: z.string().optional(), listing: z.string().optional() }),
  component: ThankYou,
});

function ThankYou() {
  const { url, listing } = Route.useSearch();
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const shareUrl = url ? `${origin}${url}` : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Storefront link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 grid place-items-center bg-background/50 py-16 px-4 relative">
        <div
          aria-hidden
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
        />

        <div className="max-w-xl w-full bg-card rounded-2xl shadow-xl border border-border/40 p-8 text-center z-10 relative overflow-hidden">
          <div aria-hidden className="absolute top-0 inset-x-0 h-1.5 kente-pattern" />

          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 mb-5">
            <CheckCircle2 className="h-9 w-9 text-primary" />
          </div>

          <h1 className="text-3xl font-extrabold text-primary-dark tracking-tight">
            Your Ad is Now Live!
          </h1>
          <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto">
            Payment confirmed. Your item has been listed across Kenya. Share your public store link
            to drive traffic and get offers faster!
          </p>

          {shareUrl && (
            <div className="mt-8 bg-muted/60 rounded-2xl p-5 border border-border/40 text-left">
              <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <Store className="h-3.5 w-3.5 text-primary" /> Storefront Link
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl border border-border p-2.5">
                <div className="flex-1 truncate text-sm text-foreground/90 font-medium px-2">
                  {shareUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className={`grid h-9 w-9 place-items-center rounded-lg border transition ${copied ? "bg-primary border-primary text-white" : "bg-muted/30 hover:bg-muted border-border text-muted-foreground hover:text-foreground"} cursor-pointer`}
                  title="Copy link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-4">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Share:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out my items on Sokonyumbani: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white py-2.5 text-xs font-bold transition shadow-sm"
                  >
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1877F2] hover:bg-[#1565cd] text-white py-2.5 text-xs font-bold transition shadow-sm"
                  >
                    <Facebook className="h-4 w-4" /> Facebook
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my storefront on Sokonyumbani!`)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white py-2.5 text-xs font-bold transition shadow-sm"
                  >
                    <Twitter className="h-4 w-4" /> Twitter
                  </a>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-3 justify-center">
            {listing && (
              <Link
                to="/listing/$id"
                params={{ id: listing }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary-dark text-white px-5 py-3 font-bold hover:bg-primary transition shadow"
              >
                View Listing <ArrowRight className="h-4 w-4" />
              </Link>
            )}
            <Link
              to="/dashboard"
              className="flex-1 inline-flex items-center justify-center rounded-xl bg-white border border-primary text-primary px-5 py-3 font-bold hover:bg-primary/5 transition"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
