import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    return NextResponse.json(
      { status: "degraded", service: "designbygodwin", database: "unconfigured" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  try {
    const sql = neon(databaseUrl);
    await sql`SELECT 1`;
    return NextResponse.json(
      { status: "ok", service: "designbygodwin", database: "connected" },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { status: "degraded", service: "designbygodwin", database: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
}
