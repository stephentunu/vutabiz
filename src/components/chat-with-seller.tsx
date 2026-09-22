import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { ChatThread } from "@/components/chat-thread";
import { toast } from "sonner";
import { MessageSquare, X } from "lucide-react";

/**
 * "Chat with seller" button. Opens an in-page chat panel, creating (or reusing)
 * the single conversation between this buyer and this listing.
 */
export function ChatWithSeller({
  listingId,
  listingTitle,
  sellerId,
  sellerName,
  meId,
}: {
  listingId: string;
  listingTitle: string;
  sellerId: string;
  sellerName: string;
  meId: string | null;
}) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function start() {
    if (!meId) {
      void navigate({ to: "/auth", search: { next: `/listing/${listingId}` } as never });
      return;
    }
    setLoading(true);
    const { data: existing } = await supabase
      .from("conversations")
      .select("id")
      .eq("listing_id", listingId)
      .eq("buyer_id", meId)
      .maybeSingle();
    let id = (existing as { id: string } | null)?.id ?? null;
    if (!id) {
      const { data, error } = await supabase
        .from("conversations")
        .insert({ listing_id: listingId, buyer_id: meId, seller_id: sellerId })
        .select("id")
        .single();
      if (error) {
        setLoading(false);
        toast.error(error.message);
        return;
      }
      id = (data as { id: string }).id;
    }
    setConversationId(id);
    setLoading(false);
    setOpen(true);
  }

  if (meId === sellerId) return null;

  return (
    <>
      <button
        onClick={start}
        disabled={loading}
        className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary-dark text-white px-3 py-2 text-xs font-bold transition cursor-pointer disabled:opacity-60"
      >
        <MessageSquare className="h-3.5 w-3.5" /> {loading ? "Opening…" : "Chat with seller"}
      </button>

      {open && conversationId && meId && (
        <div
          className="fixed inset-0 z-50 grid place-items-end sm:place-items-center bg-black/50 p-0 sm:p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-card p-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h2 className="text-sm font-extrabold text-primary-dark">Chat with {sellerName}</h2>
                <p className="text-[11px] text-muted-foreground mt-0.5">{listingTitle}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ChatThread
              conversationId={conversationId}
              meId={meId}
              otherName={sellerName}
              className="mt-3 h-[60vh] sm:h-80"
            />
          </div>
        </div>
      )}
    </>
  );
}
