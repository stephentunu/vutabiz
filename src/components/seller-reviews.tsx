import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { StarInput, StarRating } from "@/components/star-rating";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  reviewer_id: string;
  listing_id: string;
};

export function SellerReviews({
  sellerId,
  listingId,
  currentUserId,
}: {
  sellerId: string;
  listingId: string;
  currentUserId: string | null;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [names, setNames] = useState<Record<string, string>>({});
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id,rating,comment,created_at,reviewer_id,listing_id")
      .eq("seller_id", sellerId)
      .order("created_at", { ascending: false });
    const rows = (data as Review[] | null) ?? [];
    setReviews(rows);
    const ids = [...new Set(rows.map((r) => r.reviewer_id))];
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id,full_name")
        .in("id", ids);
      const map: Record<string, string> = {};
      for (const p of (profs ?? []) as { id: string; full_name: string }[]) map[p.id] = p.full_name;
      setNames(map);
    }
  }, [sellerId]);

  useEffect(() => {
    void load();
  }, [load]);

  const mine = currentUserId ? reviews.find((r) => r.reviewer_id === currentUserId && r.listing_id === listingId) : undefined;

  useEffect(() => {
    if (mine) {
      setRating(mine.rating);
      setComment(mine.comment ?? "");
    }
  }, [mine?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const total = reviews.length;
  const average = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const isOwnListing = currentUserId === sellerId;

  async function submit() {
    if (!currentUserId || rating < 1) return;
    setSaving(true);
    const payload = {
      listing_id: listingId,
      seller_id: sellerId,
      reviewer_id: currentUserId,
      rating,
      comment: comment.trim() || null,
    };
    const { error } = mine
      ? await supabase
          .from("reviews")
          .update({ rating: payload.rating, comment: payload.comment })
          .eq("id", mine.id)
      : await supabase.from("reviews").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(mine ? "Your review was updated." : "Thank you for rating this seller.");
    await load();
  }

  async function remove() {
    if (!mine) return;
    const { error } = await supabase.from("reviews").delete().eq("id", mine.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setRating(0);
    setComment("");
    toast.success("Review removed.");
    await load();
  }

  return (
    <section className="mt-6 rounded-xl bg-card ring-1 ring-black/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-extrabold text-primary-dark uppercase tracking-wider">
          Seller Rating &amp; Reviews
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-primary-dark leading-none">
            {average ? average.toFixed(1) : "—"}
          </span>
          <div>
            <StarRating value={average} />
            <div className="text-[10px] text-muted-foreground">
              {total} review{total === 1 ? "" : "s"}
            </div>
          </div>
        </div>
      </div>

      {/* Write / edit a review */}
      <div className="mt-3 border-t border-border pt-3">
        {!currentUserId ? (
          <Link
            to="/auth"
            search={{ next: `/listing/${listingId}` }}
            className="text-xs text-primary underline"
          >
            Sign in to rate this seller
          </Link>
        ) : isOwnListing ? (
          <p className="text-xs text-muted-foreground">You cannot review your own listing.</p>
        ) : (
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              {mine ? "Your review" : "Rate this seller"}
            </div>
            <div className="mt-1.5">
              <StarInput value={rating} onChange={setRating} disabled={saving} />
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              maxLength={800}
              placeholder="Share your experience with this seller (optional)"
              className="mt-2 w-full rounded border border-input bg-white px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={submit}
                disabled={saving || rating < 1}
                className="rounded-lg bg-primary hover:bg-primary-dark text-white px-3 py-1.5 text-xs font-bold transition cursor-pointer disabled:opacity-60"
              >
                {saving ? "Saving…" : mine ? "Update review" : "Submit review"}
              </button>
              {mine && (
                <button
                  onClick={remove}
                  className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-bold text-destructive hover:bg-muted transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Existing reviews */}
      <div className="mt-4 space-y-3">
        {reviews.map((r) => (
          <div key={r.id} className="border-t border-border pt-3">
            <div className="flex items-center justify-between gap-2">
              <div className="text-xs font-bold">
                {names[r.reviewer_id] ?? "Sokonyumbani user"}
                {r.reviewer_id === currentUserId && (
                  <span className="ml-1 text-[10px] font-semibold text-primary">(you)</span>
                )}
              </div>
              <StarRating value={r.rating} size={12} />
            </div>
            {r.comment && <p className="mt-1 text-xs text-foreground whitespace-pre-wrap">{r.comment}</p>}
            <div className="mt-1 text-[10px] text-muted-foreground">
              {new Date(r.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
        {!reviews.length && (
          <p className="text-xs text-muted-foreground">
            This seller has no reviews yet — be the first to rate them.
          </p>
        )}
      </div>
    </section>
  );
}
