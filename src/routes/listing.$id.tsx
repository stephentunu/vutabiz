import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import {
  makeOffer,
  startOrGetConversation,
  sendMessage,
  getConversationMessages,
  submitReview,
  getSellerReviews,
  reportListingOrUser,
  incrementListingView,
  createEscrowOrder,
  toggleFavorite,
  toggleFollowSeller,
  recordContactClick,
} from "@/lib/marketplace.functions";
import { evaluateListingSafety } from "@/lib/safety-heuristics";
import { KENYA_COURIERS, calculateEstimatedDeliveryFee } from "@/lib/logistics-couriers";
import { useLanguage } from "@/lib/i18n";
import { Header, Footer } from "@/components/site-chrome";
import { toast } from "sonner";
import {
  Loader2,
  MessageCircle,
  Phone,
  Lock,
  MapPin,
  ShoppingBag,
  Wrench,
  Users,
  HandCoins,
  HeartHandshake,
  ShieldCheck,
  AlertTriangle,
  Star,
  Flag,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  Flame,
  Send,
  Info,
  Heart,
  Share2,
  Truck,
  UserPlus,
  UserCheck,
  Wallet,
  ShieldAlert,
} from "lucide-react";

export const Route = createFileRoute("/listing/$id")({
  component: ListingPage,
  head: ({ params }) => ({
    meta: [
      { title: `Listing on Sokonyumbani` },
      {
        name: "description",
        content: `View listing ${params.id} on Sokonyumbani — Kenya's local marketplace.`,
      },
    ],
  }),
});

type Listing = {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  images?: string[] | null;
  specs?: Record<string, any> | null;
  promotion_tier?: string | null;
  views_count?: number | null;
  seller_id: string;
  status: string;
  county_id: number | null;
  subcounty_id: number | null;
  ward_id: number | null;
  town: string | null;
  listing_type: "sale" | "hire" | "service" | "donation" | null;
  work_rate_type: string | null;
  landmark: string | null;
  donation_recipient: string | null;
  offers_delivery: boolean | null;
  transport_means: string | null;
  payment_methods: string[] | null;
  job_title: string | null;
  education_level: string | null;
  languages: string[] | null;
  experience_years: number | null;
  self_description: string | null;
};
type Seller = {
  full_name: string;
  phone: string;
  email: string;
  verification_status?: string | null;
  is_phone_verified?: boolean | null;
};

const LISTING_TYPE_CONFIG: Record<string, { label: string; icon: typeof ShoppingBag; color: string }> = {
  sale: { label: "For Sale", icon: ShoppingBag, color: "bg-primary/10 text-primary-dark border-primary/20" },
  hire: { label: "For Hire", icon: Wrench, color: "bg-amber-500/10 text-amber-700 border-amber-200" },
  service: { label: "Service", icon: Users, color: "bg-emerald-500/10 text-emerald-700 border-emerald-200" },
  donation: { label: "Donation", icon: HeartHandshake, color: "bg-rose-500/10 text-rose-700 border-rose-200" },
};

const WORK_RATE_LABEL: Record<string, string> = {
  hourly: " / hour",
  weekly: " / week",
  monthly: " / month",
  agreed: " (agreed)",
};

function ListingPage() {
  const { id } = Route.useParams();
  const submit = useServerFn(makeOffer);
  const doStartChat = useServerFn(startOrGetConversation);
  const doSendMessage = useServerFn(sendMessage);
  const doGetMessages = useServerFn(getConversationMessages);
  const doSubmitReview = useServerFn(submitReview);
  const doGetReviews = useServerFn(getSellerReviews);
  const doReport = useServerFn(reportListingOrUser);
  const doIncrementView = useServerFn(incrementListingView);
  const doEscrowOrder = useServerFn(createEscrowOrder);
  const doToggleFavorite = useServerFn(toggleFavorite);
  const doToggleFollow = useServerFn(toggleFollowSeller);
  const doRecordContact = useServerFn(recordContactClick);
  const { lang, t } = useLanguage();

  const [listing, setListing] = useState<Listing | null>(null);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [countyName, setCountyName] = useState<string>("");
  const [subCountyName, setSubCountyName] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");
  const [me, setMe] = useState<string | null>(null);
  const [myOffer, setMyOffer] = useState<{ id: string; status: string; amount: number } | null>(
    null,
  );
  const [amount, setAmount] = useState<number>(0);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  // New features state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState("scam");
  const [reportDetails, setReportDetails] = useState("");
  const [submittingReport, setSubmittingReport] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatConvId, setChatConvId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loadingChatMessages, setLoadingChatMessages] = useState(false);
  const [sendingChat, setSendingChat] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const [showContact, setShowContact] = useState(false);
  const [similarListings, setSimilarListings] = useState<any[]>([]);

  // Engagement & Escrow state
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFollowingSeller, setIsFollowingSeller] = useState(false);
  const [escrowModalOpen, setEscrowModalOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState(KENYA_COURIERS[0].id);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [escrowPaymentMethod, setEscrowPaymentMethod] = useState<"wallet" | "mpesa">("wallet");
  const [submittingEscrow, setSubmittingEscrow] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  async function load() {
    let { data: l, error: lErr } = await supabase
      .from("listings")
      .select(
        "id,title,description,price,image_url,images,specs,promotion_tier,views_count,seller_id,status,county_id,subcounty_id,ward_id,town,listing_type,work_rate_type,landmark,donation_recipient,offers_delivery,transport_means,payment_methods,job_title,education_level,languages,experience_years,self_description,category_id",
      )
      .eq("id", id)
      .maybeSingle();

    if (lErr && (lErr.code === "42703" || lErr.message?.includes("column"))) {
      const fallback = await supabase
        .from("listings")
        .select(
          "id,title,description,price,image_url,seller_id,status,county_id,subcounty_id,ward_id,town,listing_type,work_rate_type,landmark,donation_recipient,offers_delivery,transport_means,payment_methods,job_title,education_level,languages,experience_years,self_description,category_id",
        )
        .eq("id", id)
        .maybeSingle();
      l = fallback.data as any;
    }

    const listingData = l as unknown as (Listing & { category_id?: number | null }) | null;
    setListing(listingData);
    if (listingData) {
      let { data: s, error: sErr } = await supabase
        .from("profiles")
        .select("full_name,phone,email,verification_status,is_phone_verified")
        .eq("id", listingData.seller_id)
        .maybeSingle();

      if (sErr && (sErr.code === "42703" || sErr.message?.includes("column"))) {
        const fallbackProfile = await supabase
          .from("profiles")
          .select("full_name,phone,email")
          .eq("id", listingData.seller_id)
          .maybeSingle();
        s = fallbackProfile.data as any;
      }
      setSeller(s as unknown as Seller | null);
      if (listingData.county_id) {
        const { data: c } = await supabase
          .from("counties")
          .select("name")
          .eq("id", listingData.county_id)
          .maybeSingle();
        setCountyName((c?.name as string) ?? "");
      }
      if (listingData.subcounty_id) {
        const { data: sc } = await supabase
          .from("subcounties")
          .select("name")
          .eq("id", listingData.subcounty_id!)
          .maybeSingle();
        setSubCountyName((sc?.name as string) ?? "");
      }
      if (listingData.ward_id) {
        const { data: w } = await supabase
          .from("wards")
          .select("name")
          .eq("id", listingData.ward_id!)
          .maybeSingle();
        setWardName((w?.name as string) ?? "");
      }
      setAmount(Number(listingData.price));

      // Fetch seller reviews
      try {
        const revs = await doGetReviews({ data: { seller_id: listingData.seller_id } });
        setReviews(revs?.reviews ?? []);
      } catch (e) {
        console.error("Reviews load error", e);
      }

      // Fetch similar listings
      try {
        let simQ = supabase
          .from("listings")
          .select("id,title,price,image_url,town,created_at")
          .eq("status", "active")
          .neq("id", id);
        if (listingData.category_id) {
          simQ = simQ.eq("category_id", listingData.category_id);
        } else if (listingData.county_id) {
          simQ = simQ.eq("county_id", listingData.county_id);
        }
        const { data: sims } = await simQ.limit(4);
        setSimilarListings(sims ?? []);
      } catch (e) {
        console.error("Similar listings error", e);
      }
    }
    const { data: u } = await supabase.auth.getUser();
    setMe(u.user?.id ?? null);
    if (u.user) {
      const { data: o } = await supabase
        .from("offers")
        .select("id,status,amount")
        .eq("listing_id", id)
        .eq("buyer_id", u.user.id)
        .order("created_at", { ascending: false })
        .limit(1);
      setMyOffer((o?.[0] as { id: string; status: string; amount: number } | undefined) ?? null);

      // Check favorite
      const { data: fav } = await supabase
        .from("favorites")
        .select("id")
        .eq("user_id", u.user.id)
        .eq("listing_id", id)
        .maybeSingle();
      setIsFavorited(!!fav);

      // Check following
      if (listingData?.seller_id) {
        const { data: fol } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", u.user.id)
          .eq("seller_id", listingData.seller_id)
          .maybeSingle();
        setIsFollowingSeller(!!fol);
      }
    }
  }
  useEffect(() => {
    load();
    try {
      doIncrementView({ data: { listing_id: id } });
    } catch {}
  }, [id]);

  async function send() {
    if (!me) {
      window.location.href = `/auth?next=${encodeURIComponent(`/listing/${id}`)}`;
      return;
    }
    if (listing?.listing_type === "donation") {
      toast.error("Donation items are free and do not accept offers.");
      return;
    }
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    try {
      await submit({ data: { listing_id: id, amount, message: msg } });
      toast.success(
        listing?.listing_type === "service" ? "Quote request sent to service provider!" : "Offer submitted to seller!",
      );
      await load();
      setMsg("");
      setOfferOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit offer");
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenChat() {
    if (!me) {
      window.location.href = `/auth?next=${encodeURIComponent(`/listing/${id}`)}`;
      return;
    }
    setChatOpen(true);
    setLoadingChatMessages(true);
    try {
      const conv = await doStartChat({ data: { listing_id: id } });
      setChatConvId(conv.conversation_id);
      const msgs = await doGetMessages({ data: { conversation_id: conv.conversation_id } });
      setChatMessages(msgs || []);
    } catch (err) {
      toast.error("Could not initiate conversation.");
    } finally {
      setLoadingChatMessages(false);
    }
  }

  async function handleSendChatMessage(customText?: string) {
    const textToSend = (customText ?? chatInput).trim();
    if (!textToSend || !chatConvId) return;
    setSendingChat(true);

    const tempId = `temp-${Date.now()}`;
    const optimisticMsg = {
      id: tempId,
      sender_id: me,
      content: textToSend,
      created_at: new Date().toISOString(),
    };
    setChatMessages((prev) => [...prev, optimisticMsg]);
    if (!customText) setChatInput("");

    try {
      await doSendMessage({ data: { conversation_id: chatConvId, content: textToSend } });
      const msgs = await doGetMessages({ data: { conversation_id: chatConvId } });
      setChatMessages(msgs || []);
    } catch (err) {
      toast.error("Failed to send message.");
      setChatMessages((prev) => prev.filter((m) => m.id !== tempId));
    } finally {
      setSendingChat(false);
    }
  }

  // Real-time chat sync
  useEffect(() => {
    if (!chatOpen || !chatConvId) return;

    const channel = supabase
      .channel(`chat-listing-${chatConvId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${chatConvId}`,
        },
        (payload) => {
          if (payload.new && payload.new.sender_id !== me) {
            setChatMessages((prev) => {
              if (prev.some((m) => m.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatOpen, chatConvId, me]);

  // Scroll to bottom of chat when new message arrives
  useEffect(() => {
    if (chatOpen && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, chatOpen]);

  async function handleAddReview(e: React.FormEvent) {
    e.preventDefault();
    if (!me) {
      toast.error("Please sign in to leave a review.");
      return;
    }
    if (!listing) return;
    setSubmittingReview(true);
    try {
      await doSubmitReview({
        data: {
          listing_id: listing.id,
          rating: reviewRating,
          comment: reviewComment,
        },
      });
      toast.success("Review submitted! Thank you.");
      setReviewComment("");
      const revs = await doGetReviews({ data: { seller_id: listing.seller_id } });
      setReviews(revs?.reviews ?? []);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  }

  async function handleReportSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingReport(true);
    try {
      await doReport({
        data: {
          listing_id: id,
          reported_user_id: listing?.seller_id,
          reason: reportReason,
          details: reportDetails,
        },
      });
      toast.success("Report received. Our moderation team will investigate.");
      setReportOpen(false);
      setReportDetails("");
    } catch (err) {
      toast.error("Failed to submit report.");
    } finally {
      setSubmittingReport(false);
    }
  }

  async function handleToggleFav() {
    if (!me) {
      toast.error("Sign in to save items to your favorites.");
      return;
    }
    try {
      const res = await doToggleFavorite({ data: { listing_id: id } });
      setIsFavorited(res.favorited);
      toast.success(res.favorited ? "Added to favorites ❤️" : "Removed from favorites");
    } catch (err: any) {
      toast.error(err.message || "Failed to update favorites.");
    }
  }

  async function handleToggleSellerFollow() {
    if (!me) {
      toast.error("Sign in to follow sellers.");
      return;
    }
    if (!listing?.seller_id) return;
    try {
      const res = await doToggleFollow({ data: { seller_id: listing.seller_id } });
      setIsFollowingSeller(res.following);
      toast.success(res.following ? "Following seller! You'll see their latest posts." : "Unfollowed seller");
    } catch (err: any) {
      toast.error(err.message || "Failed to follow seller.");
    }
  }

  function handleTrackContactClick() {
    try {
      doRecordContact({ data: { listing_id: id } });
    } catch {
      // ignore
    }
  }

  async function handleCreateEscrow() {
    if (!me) {
      toast.error("Please sign in to place an escrow order.");
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.error("Please provide a destination town and pickup point/address.");
      return;
    }
    if (!listing) return;

    setSubmittingEscrow(true);
    const courierFee = calculateEstimatedDeliveryFee(selectedCourier, 2, false);

    try {
      const res = await doEscrowOrder({
        data: {
          listing_id: listing.id,
          amount: Number(listing.price),
          delivery_fee: courierFee,
          courier_partner: selectedCourier,
          delivery_address: deliveryAddress.trim(),
          payment_method: escrowPaymentMethod,
        },
      });

      toast.success(`Escrow order created! Tracking #${res.tracking_number}. Seller has been notified to dispatch.`);
      setEscrowModalOpen(false);
      await load();
    } catch (err: any) {
      toast.error(err.message || "Failed to create escrow order.");
    } finally {
      setSubmittingEscrow(false);
    }
  }

  if (!listing)
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center">Loading…</main>
        <Footer />
      </div>
    );

  const accepted = myOffer?.status === "accepted";
  const typeConfig = listing.listing_type ? LISTING_TYPE_CONFIG[listing.listing_type] : null;
  const priceSuffix =
    listing.listing_type === "service" && listing.work_rate_type
      ? WORK_RATE_LABEL[listing.work_rate_type] ?? ""
      : "";

  // Build location breadcrumb: County › Sub-County › Ward › Town
  const locationParts = [
    listing.town,
    wardName,
    subCountyName,
    countyName,
  ].filter(Boolean);
  const locationLabel = locationParts.reverse().join(" › ");

  const isService = listing.listing_type === "service";

  const allImages = Array.isArray(listing.images) && listing.images.length > 0
    ? listing.images
    : listing.image_url
    ? [listing.image_url]
    : [];

  const safetyEvaluation = evaluateListingSafety({
    title: listing.title,
    description: listing.description || "",
    price: Number(listing.price),
    listing_type: listing.listing_type,
    contact_phone: seller?.phone,
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc: number, r: any) => acc + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-4">
        {/* Rich SEO JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org/",
              "@type": "Product",
              "name": listing.title,
              "image": allImages.length > 0 ? allImages : undefined,
              "description": listing.description || `${listing.title} available on Sokonyumbani Kenya`,
              "offers": {
                "@type": "Offer",
                "priceCurrency": "KES",
                "price": listing.price,
                "availability": listing.status === "active" ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                "seller": {
                  "@type": "Person",
                  "name": seller?.full_name || "Sokonyumbani Seller",
                },
              },
            }),
          }}
        />
        <div className="mx-auto max-w-5xl px-4 grid md:grid-cols-[1.2fr_1fr] gap-5">
          <div>
            {/* Multi-Photo Gallery */}
            <div className="space-y-2">
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted ring-1 ring-black/5 relative group">
                {allImages.length > 0 ? (
                  <img
                    src={allImages[activePhotoIdx] || allImages[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-muted-foreground text-xs">
                    No image
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : allImages.length - 1))}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActivePhotoIdx((prev) => (prev < allImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
                      {activePhotoIdx + 1} / {allImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhotoIdx(idx)}
                      className={`relative shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${
                        activePhotoIdx === idx ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Badges */}
            <div className="mt-3.5 flex items-start gap-2.5 flex-wrap">
              {typeConfig && (
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full border ${typeConfig.color} shrink-0`}
                >
                  <typeConfig.icon className="h-3 w-3" />
                  {typeConfig.label}
                </span>
              )}
              {listing.promotion_tier === "featured" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-amber-500 text-white shadow-sm shrink-0">
                  <Sparkles className="h-3 w-3" /> FEATURED
                </span>
              )}
              {listing.promotion_tier === "urgent" && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full bg-rose-600 text-white shadow-sm shrink-0">
                  <Flame className="h-3 w-3" /> URGENT
                </span>
              )}
              <div className="flex items-start justify-between gap-2 w-full">
                <h1 className="text-xl font-extrabold text-primary-dark flex-1">{listing.title}</h1>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleToggleFav}
                    title={isFavorited ? "Remove from favorites" : "Add to favorites"}
                    className={`p-2 rounded-xl border transition cursor-pointer ${
                      isFavorited ? "bg-rose-50 border-rose-200 text-rose-600" : "bg-card border-border hover:bg-muted text-muted-foreground"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
                  </button>
                  <button
                    onClick={() => setShareOpen(!shareOpen)}
                    title="Share listing"
                    className="p-2 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground transition cursor-pointer"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Social Share Menu */}
              {shareOpen && (
                <div className="w-full bg-muted/40 p-2.5 rounded-xl border border-border/70 flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-[11px] font-bold text-muted-foreground">Share:</span>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`Check out ${listing.title} on Sokonyumbani: ${window.location.href}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                  >
                    WhatsApp
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${listing.title} on Sokonyumbani`)}&url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-black text-white font-bold hover:bg-neutral-800 transition"
                  >
                    X (Twitter)
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast.success("Listing link copied to clipboard!");
                      setShareOpen(false);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-border bg-card font-semibold hover:bg-muted transition"
                  >
                    Copy Link
                  </button>
                </div>
              )}
            </div>

            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              {locationLabel && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{locationLabel}</span>
                </div>
              )}
              {listing.views_count !== undefined && listing.views_count !== null && (
                <div className="flex items-center gap-1 text-[11px]">
                  <Eye className="h-3 w-3" />
                  <span>{listing.views_count} views</span>
                </div>
              )}
            </div>

            <div className="mt-2 text-2xl font-black text-primary">
              KSh {Number(listing.price).toLocaleString()}
              {priceSuffix && (
                <span className="text-sm font-semibold text-muted-foreground ml-1">{priceSuffix}</span>
              )}
            </div>

            {/* Fraud/Scam warning banner if flagged */}
            {safetyEvaluation.risk === "high" && (
              <div className="mt-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-destructive flex items-start gap-2 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">Caution: Suspicious Listing Indicators Detected</div>
                  <div className="text-[11px] opacity-90 mt-0.5">
                    {safetyEvaluation.warnings.join(". ")}. Always inspect goods in person and never send money before meeting!
                  </div>
                </div>
              </div>
            )}

            {/* Category Specs Details Card */}
            {listing.specs && Object.keys(listing.specs).length > 0 && (
              <div className="mt-4 rounded-xl border border-border bg-card p-3.5 shadow-sm">
                <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5 text-primary" /> Item Specifications
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.entries(listing.specs).map(([k, v]) => (
                    <div key={k} className="bg-muted/40 rounded-lg p-2 text-xs">
                      <div className="text-[10px] text-muted-foreground capitalize">{k.replace(/_/g, " ")}</div>
                      <div className="font-bold text-foreground capitalize mt-0.5">{String(v)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.description && (
              <p className="mt-4 text-xs md:text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {listing.description}
              </p>
            )}

            {listing.listing_type === "service" && (
              <div className="mt-4 rounded-lg bg-accent/20 p-3 space-y-1.5 text-xs">
                <div className="text-[10px] font-bold uppercase tracking-wider text-primary-dark">Service Provider</div>
                {listing.job_title && <div><b>Job:</b> {listing.job_title}</div>}
                {listing.education_level && <div><b>Education:</b> {listing.education_level.toUpperCase()}</div>}
                {listing.experience_years != null && <div><b>Experience:</b> {listing.experience_years} yr(s)</div>}
                {listing.languages && listing.languages.length > 0 && <div><b>Languages:</b> {listing.languages.join(", ")}</div>}
                {listing.self_description && <div className="pt-1 whitespace-pre-wrap">{listing.self_description}</div>}
              </div>
            )}

            {(listing.offers_delivery || (listing.payment_methods && listing.payment_methods.length > 0)) && (
              <div className="mt-3 rounded-lg bg-muted/40 p-3 space-y-1.5 text-xs">
                {listing.offers_delivery && (
                  <div><b>Delivery:</b> Available{listing.transport_means ? ` (${listing.transport_means})` : ""}</div>
                )}
                {listing.payment_methods && listing.payment_methods.length > 0 && (
                  <div><b>Payment:</b> {listing.payment_methods.join(", ")}</div>
                )}
              </div>
            )}

            {/* Ratings & Reviews Section */}
            <div className="mt-6 border-t border-border pt-4" id="reviews">
              {/* Section Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                  Seller Ratings &amp; Reviews
                </h3>
                {reviews.length > 0 && (
                  <span className="text-xs text-muted-foreground">{reviews.length} {reviews.length === 1 ? "review" : "reviews"}</span>
                )}
              </div>

              {/* Rating Summary Bar */}
              {reviews.length > 0 && avgRating && (
                <div className="flex items-center gap-4 mb-5 p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl">
                  <div className="text-center shrink-0">
                    <div className="text-3xl font-black text-amber-600">{avgRating}</div>
                    <div className="flex items-center gap-0.5 justify-center mt-1">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} className={`h-3 w-3 ${Number(avgRating) >= s ? "fill-amber-500 text-amber-500" : Number(avgRating) >= s - 0.5 ? "fill-amber-300 text-amber-300" : "text-muted-foreground/25"}`} />
                      ))}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{reviews.length} {reviews.length === 1 ? "rating" : "ratings"}</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5,4,3,2,1].map((star) => {
                      const count = reviews.filter((r: any) => Number(r.rating) === star).length;
                      const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                      return (
                        <div key={star} className="flex items-center gap-1.5">
                          <span className="text-[10px] text-muted-foreground w-3 text-right">{star}</span>
                          <Star className="h-2.5 w-2.5 text-amber-500 fill-amber-500 shrink-0" />
                          <div className="flex-1 h-1.5 bg-amber-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground w-5">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Individual Review Cards */}
              {reviews.length > 0 ? (
                <div className="space-y-3 mb-5">
                  {reviews.map((r: any) => (
                    <div key={r.id} className="bg-card border border-border/60 rounded-xl p-3.5 shadow-sm">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary font-extrabold text-xs flex items-center justify-center shrink-0 uppercase">
                            {(r.reviewer?.full_name || "B")[0]}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-foreground leading-tight">{r.reviewer?.full_name || "Verified Buyer"}</div>
                            {r.created_at && (
                              <div className="text-[10px] text-muted-foreground">
                                {new Date(r.created_at).toLocaleDateString("en-KE", { year: "numeric", month: "short", day: "numeric" })}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={`h-3 w-3 ${Number(r.rating || 5) >= s ? "fill-amber-500 text-amber-500" : "text-muted-foreground/25"}`} />
                          ))}
                        </div>
                      </div>
                      {r.comment && <p className="text-xs text-foreground/80 leading-relaxed pl-9">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/30 rounded-xl border border-border/50 mb-4">
                  <Star className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground font-semibold">No reviews yet</p>
                  <p className="text-[11px] text-muted-foreground/70 mt-0.5">Be the first to review this seller</p>
                </div>
              )}

              {/* Leave a Review Form */}
              {!me ? (
                <div className="bg-muted/40 border border-border/60 rounded-xl p-4 text-center">
                  <Star className="h-5 w-5 text-amber-400 mx-auto mb-1.5" />
                  <p className="text-xs text-muted-foreground mb-2">Sign in to leave a review</p>
                  <Link
                    to="/auth"
                    search={{ next: `/listing/${id}` }}
                    className="inline-flex items-center justify-center rounded-lg bg-primary text-white py-1.5 px-4 text-xs font-bold hover:bg-primary-dark transition"
                  >
                    Sign In to Review
                  </Link>
                </div>
              ) : me !== listing.seller_id ? (
                <form onSubmit={handleAddReview} className="bg-muted/30 border border-border/70 rounded-xl p-4 space-y-3">
                  <div className="text-xs font-extrabold text-foreground">Write a Review</div>

                  {/* Star picker */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Your rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setReviewRating(s)}
                          className="focus:outline-none transition-transform hover:scale-110"
                          aria-label={`Rate ${s} star${s > 1 ? "s" : ""}`}
                        >
                          <Star className={`h-5 w-5 transition-colors ${reviewRating >= s ? "fill-amber-500 text-amber-500" : "text-muted-foreground/40 hover:text-amber-400"}`} />
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-muted-foreground ml-1">
                      {reviewRating === 1 ? "Poor" : reviewRating === 2 ? "Fair" : reviewRating === 3 ? "Good" : reviewRating === 4 ? "Very Good" : "Excellent"}
                    </span>
                  </div>

                  {/* Comment textarea */}
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Describe your experience with this seller — was the item as described? Was delivery prompt? Would you recommend them?"
                    className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary resize-none"
                  />

                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="w-full rounded-lg bg-primary text-white text-xs font-bold px-3 py-2 hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Star className="h-3.5 w-3.5" />
                    {submittingReview ? "Submitting…" : "Post Review"}
                  </button>
                </form>
              ) : null}
            </div>

            {/* Similar Listings Carousel/Grid */}
            {similarListings.length > 0 && (
              <div className="mt-8 border-t border-border pt-4">
                <h3 className="text-sm font-bold text-foreground mb-3">Similar Listings You May Like</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {similarListings.map((sim: any) => (
                    <Link
                      key={sim.id}
                      to="/listing/$id"
                      params={{ id: sim.id }}
                      className="group bg-card border border-border/60 rounded-xl overflow-hidden shadow-sm hover:border-primary/40 transition"
                    >
                      <div className="aspect-[4/3] bg-muted relative">
                        {sim.image_url ? (
                          <img src={sim.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full grid place-items-center text-muted-foreground text-[10px]">No image</div>
                        )}
                      </div>
                      <div className="p-2">
                        <div className="text-xs font-bold truncate group-hover:text-primary transition">{sim.title}</div>
                        <div className="text-xs font-black text-primary mt-0.5">KSh {Number(sim.price).toLocaleString()}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="bg-card rounded-xl shadow ring-1 ring-black/5 p-4.5 h-fit sticky top-20 space-y-4">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Seller Information
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-base font-bold flex items-center gap-1.5">
                  {seller?.full_name ?? "—"}
                  {seller?.verification_status === "verified" && (
                    <span className="inline-flex items-center gap-0.5 bg-emerald-500/10 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-300">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>

              {seller?.is_phone_verified && (
                <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 font-semibold">
                  <CheckCircle2 className="h-3 w-3" /> Phone Verified
                </div>
              )}

              {/* Seller Avg Rating */}
              {reviews.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} className={`h-3 w-3 ${Number(avgRating) >= s ? "fill-amber-500 text-amber-500" : "text-muted-foreground/30"}`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-amber-600">{avgRating}</span>
                  <span className="text-[11px] text-muted-foreground">({reviews.length} {reviews.length === 1 ? "review" : "reviews"})</span>
                </div>
              )}

              {me && me !== listing.seller_id && (
                <div className="mt-2">
                  <button
                    onClick={handleToggleSellerFollow}
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition cursor-pointer ${
                      isFollowingSeller
                        ? "bg-primary/10 text-primary-dark border-primary/30"
                        : "bg-muted text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {isFollowingSeller ? <UserCheck className="h-3 w-3" /> : <UserPlus className="h-3 w-3" />}
                    {isFollowingSeller ? "Following" : "Follow Seller"}
                  </button>
                </div>
              )}
            </div>

            {/* Action buttons: Chat & Contact */}
            <div className="space-y-2">
              {/* Escrow Buy Button */}
              {me !== listing.seller_id && listing.listing_type !== "service" && listing.listing_type !== "donation" && (
                <button
                  onClick={() => setEscrowModalOpen(true)}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2.5 text-xs font-extrabold transition shadow cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" /> Buy via Escrow (Safe Delivery)
                </button>
              )}

              {me !== listing.seller_id && (
                <button
                  onClick={handleOpenChat}
                  className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-primary hover:bg-primary-dark text-white px-3 py-2 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" /> Chat with Seller
                </button>
              )}

              {/* Show/Hide Contact Feature */}
              {!showContact ? (
                <button
                  type="button"
                  onClick={() => {
                    setShowContact(true);
                    handleTrackContactClick();
                  }}
                  className="w-full flex items-center justify-between rounded-xl bg-primary-dark hover:bg-primary text-white px-3.5 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer group"
                  title="Click to view seller contact"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-white" />
                    <span className="font-extrabold tracking-wider uppercase text-xs">CONTACT</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-semibold bg-white/15 group-hover:bg-white/25 px-2 py-0.5 rounded-md transition">
                    <Eye className="h-3.5 w-3.5" />
                    <span>Show</span>
                  </div>
                </button>
              ) : (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  {/* Clicking the contact hides the contact */}
                  <button
                    type="button"
                    onClick={() => setShowContact(false)}
                    className="w-full flex items-center justify-between rounded-xl bg-primary-dark text-white px-3.5 py-2.5 text-xs font-bold transition shadow-sm cursor-pointer hover:bg-primary group"
                    title="Click to hide contact"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-400" />
                      <span className="font-extrabold tracking-wider text-xs">
                        {seller?.phone || "No phone provided"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] font-semibold bg-white/15 group-hover:bg-white/25 px-2 py-0.5 rounded-md transition">
                      <EyeOff className="h-3.5 w-3.5" />
                      <span>Hide</span>
                    </div>
                  </button>

                  {/* Direct Call & WhatsApp buttons */}
                  {seller?.phone && (
                    <div className="grid grid-cols-2 gap-1.5">
                      <a
                        href={`tel:${seller.phone}`}
                        onClick={handleTrackContactClick}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold transition shadow-sm"
                      >
                        <Phone className="h-3.5 w-3.5" /> Call
                      </a>
                      <a
                        href={`https://wa.me/${seller.phone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        onClick={handleTrackContactClick}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-white ring-1 ring-emerald-600 text-emerald-700 hover:bg-emerald-50 px-3 py-2 text-xs font-bold transition shadow-sm"
                      >
                        <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Offer / Quote Section (Not applicable for free donations) */}
            {listing.listing_type === "donation" ? (
              <div className="border-t border-border pt-3">
                <div className="rounded-xl bg-rose-50 border border-rose-200/80 p-3 text-xs text-rose-800 flex items-start gap-2">
                  <HeartHandshake className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-[11px] uppercase tracking-wider text-rose-900">Free Donation Item</div>
                    <p className="text-[11px] text-rose-700 mt-0.5 leading-relaxed">
                      This item is offered freely to those in need. Offers and pricing do not apply.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border-t border-border pt-3">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <HandCoins className="h-3.5 w-3.5 text-primary" />
                  <span>{isService ? "Request a Quote / Rate" : "Make an Offer"}</span>
                </div>

                {/* Offer Status Display */}
                {myOffer && (
                  <div className="mb-2.5">
                    {myOffer.status === "accepted" ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2.5 text-xs text-emerald-900">
                        <div className="flex items-center justify-between font-bold">
                          <span className="flex items-center gap-1 text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> {isService ? "Quote Accepted!" : "Offer Accepted!"}
                          </span>
                          <span className="font-black text-emerald-700">KSh {Number(myOffer.amount).toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-emerald-700/80 mt-1">
                          The seller has accepted your {isService ? "quote request" : "offer"}. You can now arrange payment or pickup.
                        </p>
                      </div>
                    ) : myOffer.status === "rejected" ? (
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive">
                        <div className="flex items-center justify-between font-bold">
                          <span>{isService ? "Quote Declined" : "Offer Declined"}</span>
                          <span className="font-black">KSh {Number(myOffer.amount).toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] opacity-80 mt-1">
                          The seller did not accept this amount. You can submit an updated offer below.
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-2.5 text-xs text-amber-900">
                        <div className="flex items-center justify-between font-bold">
                          <span className="text-amber-800">Pending {isService ? "Quote" : "Offer"}:</span>
                          <span className="font-black text-amber-700">KSh {Number(myOffer.amount).toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-amber-700/80 mt-1">
                          Awaiting seller response. They will be notified on their dashboard.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {!me ? (
                  <div className="bg-muted/40 rounded-xl p-3 text-center border border-border/60">
                    <HandCoins className="h-4 w-4 text-primary mx-auto mb-1" />
                    <p className="text-[11px] text-muted-foreground mb-2">
                      Sign in to {isService ? "request a quote" : "make an offer"} on this {isService ? "service" : "item"}.
                    </p>
                    <Link
                      to="/auth"
                      search={{ next: `/listing/${id}` }}
                      className="inline-flex w-full items-center justify-center rounded-lg bg-primary text-white py-1.5 text-xs font-bold hover:bg-primary-dark transition shadow-xs"
                    >
                      Sign In to {isService ? "Request Quote" : "Make Offer"}
                    </Link>
                  </div>
                ) : me === listing.seller_id ? (
                  <div className="rounded-xl bg-primary/5 border border-primary/20 p-2.5 text-center text-xs text-primary-dark">
                    <span className="font-semibold text-[11px]">This is your listing</span>
                    <Link to="/dashboard" className="block text-[10px] text-primary underline mt-0.5 font-bold">
                      View received offers on your dashboard →
                    </Link>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setAmount(myOffer ? Number(myOffer.amount) : Number(listing.price));
                        setOfferOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl border-2 border-primary text-primary hover:bg-primary hover:text-white px-3 py-2 text-xs font-extrabold transition shadow-xs cursor-pointer group"
                    >
                      <HandCoins className="h-4 w-4" />
                      <span>
                        {isService
                          ? "Request a Quote / Propose Budget"
                          : myOffer
                          ? "Change My Offer"
                          : "Make an Offer"}
                      </span>
                    </button>
                    <p className="mt-1.5 text-[10px] text-muted-foreground text-center">
                      {isService
                        ? "Propose your budget. The service provider will review your request."
                        : "Name your price. The seller can accept, decline, or counter."}
                    </p>
                  </>
                )}
              </div>
            )}

            {/* Safety Tips Card */}
            <div className="border-t border-border pt-3 rounded-xl bg-amber-500/5 p-3 border border-amber-500/20">
              <div className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-600" /> Safety Tips for Buyers
              </div>
              <ul className="text-[11px] text-muted-foreground space-y-1 list-disc pl-4">
                <li>Never send money or MPESA deposit before meeting</li>
                <li>Meet the seller in a public, well-lit place</li>
                <li>Inspect item thoroughly before finalizing</li>
              </ul>
              <Link to="/safety" className="text-[10px] text-primary font-bold underline mt-2 block">
                Read full buyer safety guide →
              </Link>
            </div>

            {/* Report Button */}
            <div className="pt-2 border-t border-border flex justify-center">
              <button
                onClick={() => setReportOpen(true)}
                className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive transition cursor-pointer"
              >
                <Flag className="h-3 w-3" /> Report this listing
              </button>
            </div>
          </aside>
        </div>

        {/* Offer / Quote Modal */}
        {offerOpen && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => !loading && setOfferOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-card border border-border p-5 shadow-2xl space-y-3.5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2 border-b border-border/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-primary/10 text-primary grid place-items-center shrink-0">
                    <HandCoins className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-primary-dark">
                      {isService ? "Request a Quote" : "Make an Offer"}
                    </h2>
                    <p className="text-[11px] text-muted-foreground truncate max-w-[210px]">{listing.title}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOfferOpen(false)}
                  className="text-muted-foreground hover:text-foreground text-xs font-bold cursor-pointer h-7 w-7 rounded-full hover:bg-muted grid place-items-center"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* Price comparison & input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] bg-muted/30 p-2 rounded-lg border border-border/50">
                  <span className="font-semibold text-muted-foreground">
                    {isService ? "Asking Rate:" : "Listed Asking Price:"}
                  </span>
                  <span className="font-extrabold text-foreground">
                    KSh {Number(listing.price).toLocaleString()}
                    {priceSuffix}
                  </span>
                </div>

                <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-2">
                  {isService ? "Your Budget / Proposed Fee (KSh)" : "Your Offer Amount (KSh)"}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">KSh</span>
                  <input
                    type="number"
                    min={1}
                    autoFocus
                    value={amount || ""}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="e.g. 4500"
                    className="w-full rounded-xl border border-input bg-background pl-12 pr-3 py-2 text-sm font-extrabold text-primary outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  />
                </div>

                {/* Quick discount chips for items */}
                {!isService && Number(listing.price) > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap">
                    {[
                      { label: "-5%", factor: 0.95 },
                      { label: "-10%", factor: 0.90 },
                      { label: "-15%", factor: 0.85 },
                      { label: "Asking", factor: 1.0 },
                    ].map((chip) => {
                      const chipAmount = Math.round(Number(listing.price) * chip.factor);
                      return (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => setAmount(chipAmount)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition cursor-pointer ${
                            amount === chipAmount
                              ? "bg-primary text-white border-primary"
                              : "bg-muted/40 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          {chip.label} ({chipAmount.toLocaleString()})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  {isService ? "Job Requirements / Notes" : "Note for Seller (Optional)"}
                </label>
                <textarea
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  rows={3}
                  placeholder={
                    isService
                      ? "Describe the specific tasks, expected timeline, location, or materials..."
                      : "e.g. Can pick up today, payment ready on inspection..."
                  }
                  className="w-full rounded-xl border border-input bg-background px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-primary resize-none shadow-xs"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOfferOpen(false)}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={loading || !amount || amount <= 0}
                  onClick={send}
                  className="flex-1 rounded-xl bg-primary hover:bg-primary-dark text-white px-3 py-2 text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {loading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <HandCoins className="h-3.5 w-3.5" />
                  )}
                  <span>{loading ? "Submitting…" : isService ? "Send Request" : "Send Offer"}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* In-App Chat Modal */}
        {chatOpen && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-xs p-4"
            onClick={() => setChatOpen(false)}
          >
            <div
              className="w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col h-[520px] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-3.5 border-b border-border/70 bg-muted/20">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {(seller?.full_name || "S")[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-foreground truncate flex items-center gap-1.5">
                      {seller?.full_name || "Seller"}
                      {seller?.verification_status === "verified" && (
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                      )}
                    </div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      Re: {listing.title} • KSh {Number(listing.price).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setChatOpen(false)}
                  className="h-8 w-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground grid place-items-center transition cursor-pointer"
                  aria-label="Close chat"
                >
                  ✕
                </button>
              </div>

              {/* Message Feed */}
              <div
                ref={chatScrollRef}
                className="flex-1 p-3.5 overflow-y-auto space-y-2.5 bg-muted/10 text-xs"
              >
                {loadingChatMessages ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-[11px]">Loading conversation...</span>
                  </div>
                ) : chatMessages.length === 0 ? (
                  <div className="text-center py-8 px-4 space-y-2">
                    <div className="h-10 w-10 rounded-full bg-primary/10 text-primary grid place-items-center mx-auto">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-semibold text-foreground">Direct message with seller</p>
                    <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                      Ask about availability, location for inspection, or negotiate. Your conversation is saved in your Inbox.
                    </p>
                  </div>
                ) : (
                  chatMessages.map((m: any) => {
                    const isMe = m.sender_id === me;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs ${
                            isMe
                              ? "bg-primary text-white rounded-br-xs"
                              : "bg-card border border-border/80 text-foreground rounded-bl-xs"
                          }`}
                        >
                          <div className="whitespace-pre-wrap break-words">{m.content}</div>
                          <div
                            className={`text-[9px] mt-1 text-right ${
                              isMe ? "text-white/75" : "text-muted-foreground"
                            }`}
                          >
                            {m.created_at
                              ? new Date(m.created_at).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })
                              : "Just now"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Quick Suggestion Chips */}
              <div className="px-3 pt-2 pb-1 border-t border-border/40 bg-card overflow-x-auto flex gap-1.5">
                {[
                  "Is this still available?",
                  "Is the price negotiable?",
                  "Can I inspect this today?",
                  "Do you offer delivery?",
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSendChatMessage(chip)}
                    disabled={sendingChat}
                    className="shrink-0 text-[10.5px] font-medium bg-muted/50 hover:bg-primary/10 hover:text-primary-dark text-muted-foreground border border-border/60 rounded-full px-2.5 py-1 transition cursor-pointer disabled:opacity-50"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Chat Input Bar */}
              <div className="p-3 border-t border-border/70 bg-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendChatMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    autoFocus
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type a message to the seller..."
                    className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary shadow-xs"
                  />
                  <button
                    type="submit"
                    disabled={sendingChat || !chatInput.trim()}
                    className="rounded-xl bg-primary hover:bg-primary-dark text-white px-3.5 py-2 text-xs font-bold transition shadow-xs disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {sendingChat ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Send className="h-3.5 w-3.5" />
                    )}
                    <span>Send</span>
                  </button>
                </form>
                <div className="mt-2 text-center">
                  <Link
                    to="/dashboard"
                    className="text-[10px] text-muted-foreground hover:text-primary transition underline"
                  >
                    View all messages in your Dashboard Inbox →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Report Modal */}
        {reportOpen && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={() => setReportOpen(false)}
          >
            <div
              className="w-full max-w-sm rounded-2xl bg-card p-5 shadow-2xl space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-sm font-bold flex items-center gap-1.5 text-destructive">
                  <Flag className="h-4 w-4" /> Report this Listing
                </h3>
                <button onClick={() => setReportOpen(false)} className="text-muted-foreground hover:text-foreground cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Reason</label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full mt-1 rounded-lg border border-input bg-card px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="scam">Potential Scam / Fraud</option>
                    <option value="duplicate">Duplicate or Spam</option>
                    <option value="offensive">Offensive Content</option>
                    <option value="wrong_category">Wrong Category</option>
                    <option value="prohibited">Prohibited Item</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-muted-foreground">Details (Optional)</label>
                  <textarea
                    rows={3}
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    placeholder="Provide any additional context for our moderation team..."
                    className="w-full mt-1 rounded-lg border border-input bg-card px-2.5 py-1.5 text-xs outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportOpen(false)}
                    className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold hover:bg-muted cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="flex-1 rounded-xl bg-destructive text-white py-2 text-xs font-bold hover:bg-destructive/90 transition disabled:opacity-60 cursor-pointer"
                  >
                    {submittingReport ? "Sending..." : "Submit Report"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Escrow Purchase / Safe Delivery Modal */}
        {escrowModalOpen && listing && (
          <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-xs"
            onClick={() => setEscrowModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-card p-5 shadow-2xl space-y-4 border border-border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-border/70 pb-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">Safe Escrow Checkout</h3>
                    <p className="text-[10px] text-muted-foreground">Pay on delivery guarantee</p>
                  </div>
                </div>
                <button onClick={() => setEscrowModalOpen(false)} className="text-muted-foreground hover:text-foreground text-sm">
                  ✕
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% Buyer Protection
                </p>
                <p className="text-[11px] text-emerald-800 leading-relaxed">
                  Your funds are secured in platform escrow. The seller gets paid <b>only after you receive and inspect</b> the item.
                </p>
              </div>

              {/* Order Summary */}
              <div className="space-y-1.5 text-xs bg-muted/40 p-3 rounded-xl border border-border/60">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Item:</span>
                  <span className="font-semibold truncate max-w-[200px]">{listing.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-bold">KSh {Number(listing.price).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Est. Delivery Fee:</span>
                  <span className="font-bold">KSh {calculateEstimatedDeliveryFee(selectedCourier, 2, false)}</span>
                </div>
                <div className="border-t border-border/70 pt-1.5 flex justify-between font-extrabold text-sm text-primary">
                  <span>Total Payable:</span>
                  <span>KSh {(Number(listing.price) + calculateEstimatedDeliveryFee(selectedCourier, 2, false)).toLocaleString()}</span>
                </div>
              </div>

              {/* Courier Partner Selection */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Select Courier Partner
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {KENYA_COURIERS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCourier(c.id)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        selectedCourier === c.id
                          ? "border-primary bg-primary/10 ring-1 ring-primary"
                          : "border-border hover:bg-muted/40"
                      }`}
                    >
                      <div className="font-bold">{c.name}</div>
                      <div className="text-[10px] text-muted-foreground">{c.estimatedDelivery}</div>
                      <div className="text-[10px] font-semibold text-primary mt-0.5">KSh {c.baseRateKsh} base</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Delivery Destination & Phone
                </label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Westlands, Nairobi — Near Sarit Centre (0712345678)"
                  className="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Payment Source
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setEscrowPaymentMethod("wallet")}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      escrowPaymentMethod === "wallet" ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    <Wallet className="h-3.5 w-3.5" /> Wallet Balance
                  </button>
                  <button
                    type="button"
                    onClick={() => setEscrowPaymentMethod("mpesa")}
                    className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                      escrowPaymentMethod === "mpesa" ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    M-Pesa STK Push
                  </button>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEscrowModalOpen(false)}
                  className="flex-1 rounded-xl border border-border py-2 text-xs font-semibold hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submittingEscrow}
                  onClick={handleCreateEscrow}
                  className="flex-1 rounded-xl bg-emerald-600 text-white py-2 text-xs font-bold hover:bg-emerald-700 transition disabled:opacity-60 flex items-center justify-center gap-1 cursor-pointer"
                >
                  {submittingEscrow ? "Securing Funds..." : "Confirm & Pay"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
