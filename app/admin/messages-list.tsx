"use client";

import { useMemo, useState } from "react";

type PortfolioMessage = {
  id: number;
  name: string;
  email: string;
  topic: string;
  message: string;
  created_at: string | Date;
};

export default function MessagesList({ messages }: { messages: PortfolioMessage[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return messages;
    return messages.filter((message) =>
      [message.name, message.email, message.topic, message.message]
        .some((value) => value.toLowerCase().includes(term))
    );
  }, [messages, query]);

  const muted: React.CSSProperties = { color: "#77766e", fontSize: 13 };
  return (
    <section style={{ background: "#fffdf8", border: "1px solid #e2ddd2", borderRadius: 16, padding: 22 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: 22, letterSpacing: "-.04em", margin: "0 0 6px" }}>Recent messages</h2>
          <p style={{ ...muted, margin: 0 }}>{filtered.length} of {messages.length} messages</p>
        </div>
        <label style={{ display: "grid", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: ".08em", width: "min(100%, 340px)" }}>
          SEARCH INBOX
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, email, topic or message" aria-label="Search messages" style={{ width: "100%", boxSizing: "border-box", padding: "12px 14px", border: "1px solid #d8d2c6", borderRadius: 10, background: "#fff", color: "#171713", fontSize: 14, letterSpacing: 0, fontWeight: 400 }} />
        </label>
      </div>
      {filtered.length === 0 ? (
        <p style={muted}>{messages.length === 0 ? "No messages yet. When someone submits the public contact form, the message will appear here." : "No messages match your search. Try another name, email, topic or keyword."}</p>
      ) : (
        <div style={{ display: "grid", gap: 16 }}>
          {filtered.map((message) => (
            <article key={message.id} style={{ borderTop: "1px solid #e2ddd2", paddingTop: 18, display: "grid", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 12, flexWrap: "wrap" }}>
                <div><h3 style={{ margin: 0, fontSize: 17 }}>{message.name}</h3><a href={`mailto:${message.email}`} style={{ color: "#a8432a", fontSize: 13 }}>{message.email}</a></div>
                <span style={{ fontSize: 11, background: "#f0ece3", borderRadius: 999, padding: "7px 10px" }}>{message.topic}</span>
              </div>
              <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", lineHeight: 1.7, margin: 0 }}>{message.message}</p>
              <time style={{ ...muted, fontSize: 11 }}>{new Date(message.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" })} WAT</time>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
