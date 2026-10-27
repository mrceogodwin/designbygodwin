"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = (await response.json()) as { error?: string; ok?: boolean };

      if (!response.ok) {
        setError(result.error || "Unable to sign in. Please try again.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "#f5f2ea", color: "#171713", display: "grid", gridTemplateColumns: "minmax(0, 1.05fr) minmax(320px, .95fr)", fontFamily: "Arial, sans-serif" }}>
      <section style={{ background: "#171713", color: "#f5f2ea", padding: "clamp(28px, 6vw, 88px)", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100%" }}>
        <Link href="/" style={{ color: "inherit", fontWeight: 800, letterSpacing: "-.04em", fontSize: 22 }}>g<span style={{ color: "#ff6844" }}>.</span> <span style={{ fontSize: 12, letterSpacing: ".14em" }}>GODWIN</span></Link>
        <div style={{ maxWidth: 520, paddingBlock: 60 }}>
          <p style={{ color: "#ff6844", fontSize: 11, letterSpacing: ".18em", fontWeight: 700 }}>PRIVATE WORKSPACE / 001</p>
          <h1 style={{ fontSize: "clamp(42px, 6vw, 78px)", lineHeight: .98, letterSpacing: "-.065em", margin: "22px 0" }}>Your work.<br />Your space.</h1>
          <p style={{ color: "#b9b5aa", fontSize: 16, lineHeight: 1.8, maxWidth: 390 }}>A private place to manage the messages and opportunities coming through your portfolio.</p>
        </div>
        <p style={{ color: "#77766e", fontSize: 11, letterSpacing: ".12em" }}>GODMODE PORTFOLIO · OWNER ACCESS ONLY</p>
      </section>

      <section style={{ display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ width: "100%", maxWidth: 390 }}>
          <p style={{ color: "#858278", fontSize: 11, letterSpacing: ".16em", fontWeight: 700 }}>WELCOME BACK</p>
          <h2 style={{ fontSize: 36, letterSpacing: "-.05em", margin: "10px 0" }}>Owner sign in</h2>
          <p style={{ color: "#77766e", fontSize: 14, lineHeight: 1.7, marginBottom: 32 }}>Sign in with the owner credentials configured in your Vercel project.</p>
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
            <label style={{ display: "grid", gap: 8, fontSize: 12, fontWeight: 700 }}>
              OWNER EMAIL
              <input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" style={{ padding: "15px 14px", border: "1px solid #d8d2c6", borderRadius: 10, background: "#fffdf8", outlineColor: "#ff6844", fontSize: 15 }} />
            </label>
            <label style={{ display: "grid", gap: 8, fontSize: 12, fontWeight: 700 }}>
              PASSWORD
              <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Your private password" style={{ padding: "15px 14px", border: "1px solid #d8d2c6", borderRadius: 10, background: "#fffdf8", outlineColor: "#ff6844", fontSize: 15 }} />
            </label>
            {error ? <p role="alert" style={{ color: "#a42b1b", background: "#fbe8e3", borderRadius: 8, padding: 12, fontSize: 13, lineHeight: 1.5 }}>{error}</p> : null}
            <button type="submit" disabled={busy} style={{ border: 0, borderRadius: 999, padding: "16px 20px", background: busy ? "#77766e" : "#171713", color: "#fff", fontWeight: 700, cursor: busy ? "wait" : "pointer", marginTop: 4 }}>{busy ? "SIGNING IN…" : "SIGN IN TO DASHBOARD ↗"}</button>
          </form>
          <Link href="/" style={{ display: "inline-block", marginTop: 28, fontSize: 13, color: "#77766e" }}>← Back to public portfolio</Link>
        </div>
      </section>
      <style jsx global>{`@media (max-width: 760px) { main { grid-template-columns: 1fr !important; } main > section:first-child { min-height: auto !important; padding: 26px !important; } main > section:first-child > div { padding-block: 40px !important; } main > section:last-child { padding: 44px 24px 56px !important; } }`}</style>
    </main>
  );
}
