import { neon } from "@neondatabase/serverless";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import MessagesList from "./messages-list";

export const dynamic = "force-dynamic";
type PortfolioMessage = { id: number; name: string; email: string; topic: string; message: string; created_at: string | Date };

export default async function AdminDashboardPage() {
  const ownerEmail = await getAdminSession();
  if (!ownerEmail) redirect("/admin/login");
  let messages: PortfolioMessage[] = [];
  let loadError = "";
  if (!process.env.DATABASE_URL) {
    loadError = "DATABASE_URL is missing. Add it to the Vercel project environment variables.";
  } else {
    try {
      const sql = neon(process.env.DATABASE_URL);
      messages = (await sql`SELECT id, name, email, topic, message, created_at FROM portfolio_messages ORDER BY created_at DESC LIMIT 100`) as PortfolioMessage[];
    } catch {
      loadError = "Messages could not be loaded. Check the database connection and portfolio_messages table.";
    }
  }
  const emailNotificationsConfigured = Boolean(process.env.BREVO_API_KEY && process.env.BREVO_SENDER_EMAIL && process.env.ADMIN_EMAIL);
  const panel: React.CSSProperties = { background: "#fffdf8", border: "1px solid #e2ddd2", borderRadius: 16, padding: 22 };
  const muted: React.CSSProperties = { color: "#77766e", fontSize: 13 };
  return (
    <main style={{ minHeight: "100vh", background: "#f5f2ea", color: "#171713", padding: "clamp(18px, 4vw, 52px)", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", borderBottom: "1px solid #d8d2c6", paddingBottom: 22, marginBottom: 34 }}>
        <a href="/" style={{ color: "inherit", fontWeight: 800, letterSpacing: "-.04em", fontSize: 22 }}>g<span style={{ color: "#ff6844" }}>.</span> <span style={{ fontSize: 12, letterSpacing: ".14em" }}>GODWIN / OWNER</span></a>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}><span style={muted}>{ownerEmail}</span><form action="/api/admin/logout" method="post"><button type="submit" style={{ border: "1px solid #d8d2c6", borderRadius: 999, background: "transparent", padding: "10px 16px", fontWeight: 700, cursor: "pointer" }}>LOG OUT ↗</button></form></div>
      </header>
      <section style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ color: "#d94e2e", fontSize: 11, fontWeight: 700, letterSpacing: ".18em" }}>PRIVATE WORKSPACE / OVERVIEW</p>
        <h1 style={{ fontSize: "clamp(38px, 6vw, 64px)", letterSpacing: "-.065em", lineHeight: 1, margin: "14px 0" }}>Your inbox<span style={{ color: "#ff6844" }}>.</span></h1>
        <p style={{ ...muted, fontSize: 15, marginBottom: 28 }}>Portfolio contact messages, saved securely for you to review.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 24 }}>
          <div style={panel}><p style={{ ...muted, marginTop: 0 }}>TOTAL MESSAGES LOADED</p><strong style={{ fontSize: 38, letterSpacing: "-.05em" }}>{messages.length}</strong><p style={muted}>Showing up to 100 latest messages</p></div>
          <div style={panel}><p style={{ ...muted, marginTop: 0 }}>EMAIL NOTIFICATIONS</p><strong style={{ fontSize: 21 }}>{emailNotificationsConfigured ? "Configured" : "Setup required"}</strong><p style={muted}>{emailNotificationsConfigured ? "Provider credentials are present; delivery still needs a live test." : "Add BREVO_API_KEY and a verified BREVO_SENDER_EMAIL in Vercel to enable alerts."}</p></div>
        </div>
        {loadError ? <div role="alert" style={{ ...panel, borderColor: "#e6b3a8", color: "#9c3020", marginBottom: 20 }}>{loadError}</div> : null}
        <MessagesList messages={messages} />
      </section>
    </main>
  );
}
