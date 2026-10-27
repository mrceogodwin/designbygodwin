import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: "Unauthorized. Sign in to the owner dashboard first." }, { status: 401 });
  }
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Video storage is not configured. Add BLOB_READ_WRITE_TOKEN from Vercel Blob to this project's environment variables." }, { status: 503 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Choose a video file and try again." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No video file was received." }, { status: 400 });
  }
  if (!file.type.startsWith("video/")) {
    return NextResponse.json({ error: "Only video files are accepted." }, { status: 415 });
  }
  if (file.size <= 0 || file.size > MAX_VIDEO_BYTES) {
    return NextResponse.json({ error: "Video must be between 1 byte and 100 MB." }, { status: 413 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "project-demo.mp4";
  const pathname = `project-demos/${Date.now()}-${safeName}`;
  try {
    const upload = await fetch(`https://blob.vercel-storage.com/${pathname.split("/").map(encodeURIComponent).join("/")}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "x-api-version": "7",
        "x-content-type": file.type,
        "x-add-random-suffix": "1",
        "Content-Type": file.type,
      },
      body: await file.arrayBuffer(),
      cache: "no-store",
    });
    const result = await upload.json().catch(() => ({})) as { url?: string; error?: { message?: string } | string };
    if (!upload.ok || typeof result.url !== "string") {
      return NextResponse.json({ error: typeof result.error === "string" ? result.error : result.error?.message || "Storage rejected the video. Check the Blob token and try again." }, { status: 502 });
    }
    return NextResponse.json({ ok: true, url: result.url }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Video storage could not be reached. Try again shortly." }, { status: 502 });
  }
}
