import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send } from "lucide-react";

export type ChatMessage = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

/** Live-updating message thread for one conversation. */
export function ChatThread({
  conversationId,
  meId,
  otherName,
  className = "",
}: {
  conversationId: string;
  meId: string;
  otherName: string;
  className?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("messages")
      .select("id,conversation_id,sender_id,body,created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages((data as ChatMessage[] | null) ?? []);
  }, [conversationId]);

  useEffect(() => {
    void load();
    const channel = supabase
      .channel(`chat-${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => setMessages((prev) => {
          const row = payload.new as ChatMessage;
          return prev.some((m) => m.id === row.id) ? prev : [...prev, row];
        }),
      )
      .subscribe();
    const poll = setInterval(() => void load(), 8000);
    return () => {
      clearInterval(poll);
      void supabase.removeChannel(channel);
    };
  }, [conversationId, load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function send() {
    const body = text.trim();
    if (!body) return;
    setSending(true);
    const { error } = await supabase
      .from("messages")
      .insert({ conversation_id: conversationId, sender_id: meId, body });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setText("");
    await load();
  }

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex-1 overflow-y-auto space-y-2 p-3 bg-muted/30 rounded-lg min-h-40">
        {messages.map((m) => {
          const mine = m.sender_id === meId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs ${
                  mine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-card text-foreground ring-1 ring-black/5 rounded-bl-sm"
                }`}
              >
                <div className="whitespace-pre-wrap break-words">{m.body}</div>
                <div className={`mt-1 text-[9px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}
        {!messages.length && (
          <p className="text-[11px] text-muted-foreground text-center py-6">
            No messages yet. Say hello to {otherName}.
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="mt-2 flex items-end gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          rows={2}
          maxLength={2000}
          placeholder="Type a message…"
          className="flex-1 resize-none rounded-lg border border-input bg-white px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={send}
          disabled={sending || !text.trim()}
          aria-label="Send message"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary hover:bg-primary-dark text-white transition cursor-pointer disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">
        Keep conversations on Sokonyumbani. Never send money before agreeing on terms.
      </p>
    </div>
  );
}
