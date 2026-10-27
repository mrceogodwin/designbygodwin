import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function jsonNoStore(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  return NextResponse.json(data, { ...init, headers });
}

const defaults = {
  intro: "Designer and developer building thoughtful digital experiences.",
  aboutLead: "I turn ideas into useful digital products.",
  aboutBody: "I work across design, web development, and digital strategy to create clear, polished experiences.",
  projects: [
    { name: "VIBR.NG", description: "A platform connecting African founders and investors.", url: "https://vibr.ng", status: "In development" },
    { name: "STACKS.NG", description: "A marketplace for useful software and digital tools.", url: "https://stacks.ng", status: "In development" },
    { name: "Kilode", description: "An entertainment and culture publishing platform.", url: "https://kilode.com.ng", status: "In development" }
  ]
};

function isValidContent(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const content = value as Record<string, unknown>;
  if (![content.intro, content.aboutLead, content.aboutBody].every((field) => typeof field === "string" && field.length <= 4000)) return false;
  if (!Array.isArray(content.projects) || content.projects.length !== 3) return false;
  return content.projects.every((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const project = item as Record<string, unknown>;
    if (![project.name, project.description, project.url, project.status].every((field) => typeof field === "string" && field.length <= 1000)) return false;
    try {
      return new URL(project.url as string).protocol === "https:";
    } catch {
      return false;
    }
  });
}

export async function GET() {
  if (!process.env.DATABASE_URL) {
    return jsonNoStore({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS portfolio_site_content (id INTEGER PRIMARY KEY CHECK (id = 1), content JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    const rows = await sql`SELECT content FROM portfolio_site_content WHERE id = 1 LIMIT 1`;
    const saved = rows[0]?.content;
    return jsonNoStore({ content: isValidContent(saved) ? saved : defaults });
  } catch {
    return jsonNoStore({ error: "Saved content could not be loaded. Check the database connection and permissions." }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  if (!(await getAdminSession())) {
    return jsonNoStore({ error: "Unauthorized." }, { status: 401 });
  }
  if (!process.env.DATABASE_URL) {
    return jsonNoStore({ error: "DATABASE_URL is not configured." }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonNoStore({ error: "Invalid JSON body." }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return jsonNoStore({ error: "Invalid content payload." }, { status: 400 });
  }
  const value = body as Record<string, unknown>;
  const textFields = ["intro", "aboutLead", "aboutBody"] as const;
  for (const key of textFields) {
    if (typeof value[key] !== "string" || value[key].length > 4000) {
      return jsonNoStore({ error: `Invalid ${key} field (maximum 4,000 characters).` }, { status: 400 });
    }
  }
  if (!Array.isArray(value.projects) || value.projects.length !== 3) {
    return jsonNoStore({ error: "Exactly three featured projects are required." }, { status: 400 });
  }
  const projects = [];
  for (const item of value.projects) {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return jsonNoStore({ error: "Invalid project entry." }, { status: 400 });
    }
    const project = item as Record<string, unknown>;
    for (const key of ["name", "description", "url", "status"]) {
      if (typeof project[key] !== "string" || project[key].length > 1000) {
        return jsonNoStore({ error: `Invalid project ${key} field.` }, { status: 400 });
      }
    }
    try {
      const url = new URL(project.url as string);
      if (url.protocol !== "https:") throw new Error("HTTPS required");
    } catch {
      return jsonNoStore({ error: "Project links must be valid HTTPS URLs." }, { status: 400 });
    }
    projects.push({ name: project.name, description: project.description, url: project.url, status: project.status });
  }

  const content = { intro: value.intro, aboutLead: value.aboutLead, aboutBody: value.aboutBody, projects };
  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`CREATE TABLE IF NOT EXISTS portfolio_site_content (id INTEGER PRIMARY KEY CHECK (id = 1), content JSONB NOT NULL, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW())`;
    await sql`INSERT INTO portfolio_site_content (id, content, updated_at) VALUES (1, ${JSON.stringify(content)}::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()`;
    return jsonNoStore({ ok: true });
  } catch {
    return jsonNoStore({ error: "Could not save content. Check the database permissions." }, { status: 500 });
  }
}
