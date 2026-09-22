import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header, Footer } from "@/components/site-chrome";
import { ChatThread } from "@/components/chat-thread";
import { MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/messages")({
  component: MessagesPage,
  head: () => ({
    meta: [
      { title: "My Messages · Sokonyumbani" },
      {
        name: "description",
        content: "Chat with buyers and sellers about listings on Sokonyumbani.",
      },
      { property: "og:title", content: "My Messages · Sokonyumbani" },
      {
        property: "og:description",
        content: "Your Sokonyumbani conversations with buyers and sellers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

type Conversation = {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  last_message_at: string;
};

function MessagesPage() {
  const [meId, setMeId] = useState<string | null>(null);
  const [rows, setRows] = useState<Conversation[]>([]);
  const [titles, setTitles] = useState<Record<string, string>>({});
  const [names, setNames] = useState<Record<string, string>>({});
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      const id = u.user?.id ?? null;
      setMeId(id);
      if (!id) return;
      const { data } = await supabase
        .from("conversations")
        .select("id,listing_id,buyer_id,seller_id,last_message_at")
        .order("last_message_at", { ascending: false });
      const list = (data as Conversation[] | null) ?? [];
      setRows(list);
      setActiveId((prev) => prev ?? list[0]?.id ?? null);

      if (list.length) {
        const { data: ls } = await supabase
          .from("listings")
          .select("id,title")
          .in("id", [...new Set(list.map((c) => c.listing_id))]);
        const tmap: Record<string, string> = {};
        for (const l of (ls ?? []) as { id: string; title: string }[]) tmap[l.id] = l.title;
        setTitles(tmap);

        const others = [
          ...new Set(list.map((c) => (c.buyer_id === id ? c.seller_id : c.buyer_id))),
        ];
        const { data: ps } = await supabase.from("profiles").select("id,full_name").in("id", others);
        const nmap: Record<string, string> = {};
        for (const p of (ps ?? []) as { id: string; full_name: string }[]) nmap[p.id] = p.full_name;
        setNames(nmap);
      }
    })();
  }, []);

  const active = rows.find((r) => r.id === activeId) ?? null;
  const otherOf = (c: Conversation) => (c.buyer_id === meId ? c.seller_id : c.buyer_id);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-background py-5">
        <div className="mx-auto max-w-5xl px-4">
          <h1 className="flex items-center gap-2 text-xl font-extrabold text-primary-dark">
            <MessagesSquare className="h-5 w-5" /> My Messages
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Conversations about your listings and the items you are interested in.
          </p>

          <div className="mt-4 grid md:grid-cols-[260px_1fr] gap-4">
            <aside className="rounded-xl bg-card ring-1 ring-black/5 p-2 h-fit">
              {rows.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left rounded-lg px-2.5 py-2 transition cursor-pointer ${
                    c.id === activeId ? "bg-primary/10" : "hover:bg-muted"
                  }`}
                >
                  <div className="text-xs font-bold truncate">
                    {names[otherOf(c)] ?? "Sokonyumbani user"}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {titles[c.listing_id] ?? "Listing"}
                  </div>
                  <div className="text-[9px] text-muted-foreground">
                    {c.buyer_id === meId ? "You are buying" : "You are selling"}
                  </div>
                </button>
              ))}
              {!rows.length && (
                <p className="p-3 text-xs text-muted-foreground">
                  No conversations yet. Open a listing and tap “Chat with seller”.
                </p>
              )}
            </aside>

            <section className="rounded-xl bg-card ring-1 ring-black/5 p-3">
              {active && meId ? (
                <>
                  <div className="pb-2 border-b border-border">
                    <div className="text-sm font-extrabold text-primary-dark">
                      {names[otherOf(active)] ?? "Sokonyumbani user"}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {titles[active.listing_id] ?? "Listing"}
                    </div>
                  </div>
                  <ChatThread
                    conversationId={active.id}
                    meId={meId}
                    otherName={names[otherOf(active)] ?? "them"}
                    className="mt-3 h-[60vh]"
                  />
                </>
              ) : (
                <div className="grid place-items-center h-64 text-xs text-muted-foreground">
                  Select a conversation to start chatting.
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
