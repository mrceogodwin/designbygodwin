import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  topic?: unknown;
  message?: unknown;
};

export async function POST(request: Request) {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return NextResponse.json(
      { error: "The contact form is not configured yet. Please use the social links instead." },
      { status: 503 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Please send a valid form submission." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const topic = typeof payload.topic === "string" ? payload.topic.trim() : "General";
  const message = typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || name.length > 120) {
    return NextResponse.json({ error: "Enter your name (up to 120 characters)." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (!message || message.length > 5000) {
    return NextResponse.json({ error: "Your message must be between 1 and 5,000 characters." }, { status: 400 });
  }
  const allowedTopics = ["Job opportunity", "Freelance project", "Collaboration", "Just saying hello"];
  const safeTopic = allowedTopics.includes(topic) ? topic : "General";

  try {
    const sql = neon(databaseUrl);
    await sql`
      CREATE TABLE IF NOT EXISTS portfolio_messages (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        email VARCHAR(254) NOT NULL,
        topic VARCHAR(80) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;
    await sql`
      INSERT INTO portfolio_messages (name, email, topic, message)
      VALUES (${name}, ${email}, ${safeTopic}, ${message})
    `;
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Your message could not be saved right now. Please try again later." },
      { status: 500 }
    );
  }
}
