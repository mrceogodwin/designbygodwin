import { handleUpload } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(request: Request) {
  // Reject unauthenticated callers before revealing storage configuration.
  if (!(await getAdminSession())) {
    return NextResponse.json(
      { error: "Unauthorized. Sign in to the owner dashboard first." },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Video storage is not configured. Add BLOB_READ_WRITE_TOKEN from your Vercel Blob store to this project's environment variables." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const body = await request.json();
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const ownerEmail = await getAdminSession();
        if (!ownerEmail) {
          throw new Error("Unauthorized. Sign in to the owner dashboard first.");
        }

        // Restrict uploads to a dedicated prefix and a single safe filename.
        // The client-supplied pathname is untrusted even after session auth.
        const relativePath = pathname.startsWith("project-demos/") ? pathname.slice("project-demos/".length) : "";
        if (!relativePath || relativePath.includes("/") || relativePath === "." || relativePath === ".." || relativePath.includes("\\") || relativePath.includes("..")) {
          throw new Error("Invalid video upload path.");
        }

        // Treat clientPayload as untrusted input; authorization comes exclusively from the session.
        if (clientPayload !== undefined && clientPayload !== null) {
          try {
            const parsed = JSON.parse(clientPayload);
            if (!parsed || !Number.isInteger(parsed.projectIndex) || parsed.projectIndex < 0 || parsed.projectIndex > 2) {
              throw new Error("Invalid project selection.");
            }
          } catch {
            throw new Error("Invalid upload metadata.");
          }
        }

        return {
          allowedContentTypes: ALLOWED_VIDEO_TYPES,
          maximumSizeInBytes: MAX_VIDEO_BYTES,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ ownerEmail }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Blob calls this callback after a successful upload. The SDK verifies
        // the callback payload; the URL is saved to Neon only when the owner
        // explicitly saves the portfolio content in the dashboard.
        if (!blob.url || !tokenPayload) {
          throw new Error("Upload completion could not be verified.");
        }
        const payload = JSON.parse(tokenPayload) as { ownerEmail?: unknown };
        if (typeof payload.ownerEmail !== "string" || !payload.ownerEmail) {
          throw new Error("Upload owner could not be verified.");
        }
      },
    });

    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Video upload failed.";
    const status = /unauthorized/i.test(message) ? 401 : /invalid|allowed|size|type/i.test(message) ? 400 : 502;
    return NextResponse.json({ error: message }, {
      status,
      headers: { "Cache-Control": "no-store" },
    });
  }
}
