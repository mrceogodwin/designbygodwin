import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "godmode_owner_session";
const SESSION_SECONDS = 60 * 60 * 24 * 7;

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  return secret && secret.length >= 32 ? secret : null;
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

function signature(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}

export function credentialsAreConfigured() {
  return Boolean(
    process.env.ADMIN_EMAIL &&
      process.env.ADMIN_PASSWORD &&
      getSecret()
  );
}

export function verifyOwnerCredentials(email: string, password: string) {
  const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  if (!configuredEmail || !configuredPassword || !getSecret()) return false;

  return (
    email.trim().toLowerCase() === configuredEmail &&
    safeEqual(password, configuredPassword)
  );
}

export function createOwnerToken(email: string) {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_SECRET must contain at least 32 characters.");

  const payload = Buffer.from(
    JSON.stringify({
      email: email.trim().toLowerCase(),
      expiresAt: Math.floor(Date.now() / 1000) + SESSION_SECONDS,
    })
  ).toString("base64url");

  return `${payload}.${signature(payload, secret)}`;
}

export function verifyOwnerToken(token: string) {
  const secret = getSecret();
  if (!secret) return null;

  const [payload, suppliedSignature, extra] = token.split(".");
  if (!payload || !suppliedSignature || extra) return null;

  const expectedSignature = signature(payload, secret);
  if (!safeEqual(suppliedSignature, expectedSignature)) return null;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    ) as { email?: unknown; expiresAt?: unknown };

    const configuredEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (
      typeof session.email !== "string" ||
      session.email !== configuredEmail ||
      typeof session.expiresAt !== "number" ||
      session.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return session.email;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return token ? verifyOwnerToken(token) : null;
}

export const ADMIN_SESSION_SECONDS = SESSION_SECONDS;
