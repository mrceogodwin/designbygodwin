import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
type ContactPayload = { name?: unknown; email?: unknown; topic?: unknown; message?: unknown; website?: unknown };

async function sendOwnerNotification(input: { name: string; email: string; topic: string; message: string }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const ownerEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !senderEmail || !ownerEmail) return;
  const textContent = [
    "A new message arrived through your Godwin portfolio contact form.",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    `Topic: ${input.topic}`,
    "",
    "Message:",
    input.message,
  ].join("\n");
  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ sender: { email: senderEmail, name: "Godwin Portfolio" }, to: [{ email: ownerEmail }], replyTo: { email: input.email, name: input.name }, subject: `New portfolio message: ${input.topic}`, textContent }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) console.error("Portfolio email notification was rejected by the provider.");
  } catch {
    console.error("Portfolio email notification could not be sent.");
  }
}

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) return NextResponse.json({ error: "The contact form is not configured yet. Please use the social links instead." }, { status: 503 });
  let payload: ContactPayload;
  try { payload = (await request.json()) as ContactPayload; }
  catch { return NextResponse.json({ error: "Please send a valid form submission." }, { status: 400 }); }
  if (typeof payload.website === "string" && payload.website.trim()) return NextResponse.json({ ok: true }, { status: 201 });
  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const topic = typeof payload.topic === "string" ? payload.topic.trim() : "General";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";
  if (!name || name.length > 120) return NextResponse.json({ error: "Enter your name (up to 120 characters)." }, { status: 400 });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  if (!message || message.length > 5000) return NextResponse.json({ error: "Your message must be between 1 and 5,000 characters." }, { status: 400 });
  const allowedTopics = ["Job opportunity", "Freelance project", "Collaboration", "Just saying hello"];
  const safeTopic = allowedTopics.includes(topic) ? topic : "General";

  try {
    if (await enforceRateLimit({ request, namespace: "contact", limit: 5, windowSeconds: 3600 })) {
      return NextResponse.json({ error: "Too many messages have been sent from this connection. Please try again in an hour." }, { status: 429 });
    }
  } catch {
    // Fail closed if rate limiting cannot be checked.
    return NextResponse.json({ error: "The contact form is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  try {
    const sql = neon(databaseUrl);
    await sql`CREATE TABLE IF NOT EXISTS portfolio_messages (id BIGSERIAL PRIMARY KEY, name VARCHAR(120) NOT NULL, email VARCHAR(254) NOT NULL, topic VARCHAR(80) NOT NULL, message TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`INSERT INTO portfolio_messages (name, email, topic, message) VALUES (${name}, ${email}, ${safeTopic}, ${message})`;
  } catch {
    return NextResponse.json({ error: "Your message could not be saved right now. Please try again later." }, { status: 500 });
  }
  await sendOwnerNotification({ name, email, topic: safeTopic, message });
  return NextResponse.json({ ok: true }, { status: 201 });
}
