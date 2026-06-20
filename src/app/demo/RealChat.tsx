"use client";

import { useEffect, useRef, useState } from "react";

type Lead = {
  nombre: string;
  correo: string;
  telefono: string;
};

type Message = {
  id: string;
  from: "bot" | "user";
  text: string;
};

function getOrCreateId(key: string) {
  const existing =
    typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
  if (existing) return existing;
  const id = crypto.randomUUID();
  if (typeof window !== "undefined") sessionStorage.setItem(key, id);
  return id;
}

export default function RealChat({ lead }: { lead: Lead }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const lastSeenRef = useRef<string>("");
  const visitorIdRef = useRef<string>("");
  const sessionIdRef = useRef<string>("");

  useEffect(() => {
    visitorIdRef.current = getOrCreateId("webchat_visitor_id");
    sessionIdRef.current = getOrCreateId("webchat_session_id");
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (!sessionIdRef.current || !visitorIdRef.current) return;
      const params = new URLSearchParams({
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
      });
      if (lastSeenRef.current) params.set("since", lastSeenRef.current);
      const res = await fetch(`/api/webchat/poll?${params.toString()}`);
      if (!res.ok) return;
      const data = await res.json();
      if (data.messages?.length) {
        setMessages((prev) => [
          ...prev,
          ...data.messages.map((m: { id: string; text: string }) => ({
            id: m.id,
            from: "bot" as const,
            text: m.text,
          })),
        ]);
        lastSeenRef.current = data.messages[data.messages.length - 1].created_at;
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  async function sendMessage() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), from: "user", text },
    ]);

    await fetch("/api/webchat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        visitorId: visitorIdRef.current,
        sessionId: sessionIdRef.current,
        text,
        name: lead.nombre,
        email: lead.correo,
        phone: lead.telefono,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
      }),
    });
    setSending(false);
  }

  return (
    <>
      <div className="mt-4 flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">
            Escríbele algo al bot, por ejemplo &quot;quiero agendar una
            hora&quot;.
          </p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.from === "bot"
                ? "max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-zinc-100 px-4 py-2 text-sm text-zinc-800"
                : "max-w-[85%] self-end rounded-2xl rounded-br-sm bg-emerald-600 px-4 py-2 text-sm text-white"
            }
          >
            {message.text}
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          className="flex-1 rounded-full border border-zinc-200 px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-50"
        >
          Enviar
        </button>
      </form>
    </>
  );
}
