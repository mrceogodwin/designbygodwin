import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createOwnerToken,
  verifyOwnerCredentials,
} from "@/lib/admin-auth";

export const runtime = "nodejs";

function jsonNoStore(body: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store, max-age=0");
  headers.set("Pragma", "no-cache");
  return NextResponse.json(body, { ...init, headers });
}

export async function POST(request: Request) {
  let payload: { email?: unknown; password?: unknown };

  try {
    payload = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return jsonNoStore({ error: "Enter your email and password." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload) || typeof payload.email !== "string" || typeof payload.password !== "string") {
    return jsonNoStore({ error: "Enter your email and password." }, { status: 400 });
  }

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32) {
    return jsonNoStore(
      { error: "Owner login is not configured yet. Add ADMIN_EMAIL, ADMIN_PASSWORD, and a 32+ character AUTH_SECRET in Vercel." },
      { status: 503 }
    );
  }

  try {
    if (await enforceRateLimit({ request, namespace: "admin-login", limit: 10, windowSeconds: 900 })) {
      return jsonNoStore({ error: "Too many sign-in attempts. Please wait 15 minutes and try again." }, { status: 429 });
    }
  } catch {
    return jsonNoStore({ error: "Owner login is temporarily unavailable. Please try again later." }, { status: 503 });
  }

  if (!verifyOwnerCredentials(payload.email, payload.password)) {
    return jsonNoStore({ error: "Email or password is incorrect." }, { status: 401 });
  }

  const response = jsonNoStore({ ok: true });
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: createOwnerToken(process.env.ADMIN_EMAIL),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  });

  return response;
}
