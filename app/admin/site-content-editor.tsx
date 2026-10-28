"use client";

import { useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

type Project = { name: string; description: string; url: string; status: string; videoUrl?: string };
type SiteContent = {
  intro: string;
  aboutLead: string;
  aboutBody: string;
  projects: Project[];
};

function isSiteContent(value: unknown): value is SiteContent {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const candidate = value as Record<string, unknown>;
  if (!["intro", "aboutLead", "aboutBody"].every((key) => typeof candidate[key] === "string")) return false;
  if (!Array.isArray(candidate.projects) || candidate.projects.length !== 3) return false;
  return candidate.projects.every((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return false;
    const project = item as Record<string, unknown>;
    if (!["name", "description", "url", "status"].every((key) => typeof project[key] === "string")) return false;
    if (project.videoUrl !== undefined && typeof project.videoUrl !== "string") return false;
    try {
      return new URL(project.url as string).protocol === "https:";
    } catch {
      return false;
    }
  });
}

const defaults: SiteContent = {
  intro: "Designer and developer building thoughtful digital experiences.",
  aboutLead: "I turn ideas into useful digital products.",
  aboutBody: "I work across design, web development, and digital strategy to create clear, polished experiences.",
  projects: [
    { name: "VIBR.NG", description: "A platform connecting African founders and investors.", url: "https://vibr.ng", status: "In development" },
    { name: "STACKS.NG", description: "A marketplace for useful software and digital tools.", url: "https://stacks.ng", status: "In development" },
    { name: "Kilode", description: "An entertainment and culture publishing platform.", url: "https://kilode.com.ng", status: "In development" }
  ]
};

export default function SiteContentEditor() {
  const [content, setContent] = useState<SiteContent>(defaults);
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [uploading, setUploading] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load saved content.");
        const data = await response.json();
        if (!isSiteContent(data.content)) throw new Error("Saved content has an invalid structure. Saving is disabled to protect existing content.");
        setContent(data.content);
      })
      .catch(() => {
        setLoadFailed(true);
        setNotice("Saved content could not be loaded. Saving is disabled to protect existing content. Check the database connection and reload.");
      })
      .finally(() => setLoading(false));
  }, []);

  async function uploadVideo(index: number, file?: File) {
    if (!file) return;
    const allowedTypes = ["video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(file.type) || file.size <= 0 || file.size > 100 * 1024 * 1024) {
      setNotice("Choose an MP4, WebM, or QuickTime video no larger than 100 MB.");
      return;
    }
    setUploading(index);
    setNotice("");
    try {
      // Upload directly from the browser to Blob so large files do not pass through
      // a serverless function request body (which has a much smaller size limit).
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-100) || "project-demo.mp4";
      const blob = await upload(`project-demos/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/video",
        clientPayload: JSON.stringify({ projectIndex: index }),
      });
      setContent((current) => ({
        ...current,
        projects: current.projects.map((item, i) => i === index ? { ...item, videoUrl: blob.url } : item),
      }));
      setNotice(`Video uploaded for ${content.projects[index].name}. Save website content to publish it.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Video upload failed.");
    } finally {
      setUploading(null);
    }
  }

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setContent((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setNotice("");
    if ([content.intro, content.aboutLead, content.aboutBody].some((value) => value.length > 4000)) {
      setNotice("Each main text field must be 4,000 characters or fewer.");
      return;
    }
    for (const project of content.projects) {
      if ([project.name, project.description, project.url, project.status].some((value) => value.length > 1000)) {
        setNotice("Each project field must be 1,000 characters or fewer.");
        return;
      }
      try {
        if (new URL(project.url).protocol !== "https:") throw new Error("HTTPS required");
      } catch {
        setNotice("Each project link must be a valid HTTPS URL.");
        return;
      }
    }
    setSaving(true);
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content)
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed.");
      setNotice("Saved. Refresh the public portfolio to verify the changes.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", border: "1px solid #30302b", borderRadius: 10, padding: 12, font: "inherit", background: "#080808", color: "#f5f5f2", outlineColor: "#d6b36a" };
  const label: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 700, letterSpacing: ".08em", marginBottom: 7 };
  return <section style={{ background: "#111111", border: "1px solid #30302b", borderRadius: 16, padding: 22, marginBottom: 24 }}>
    <p style={{ color: "#d6b36a", fontSize: 11, fontWeight: 700, letterSpacing: ".18em" }}>PORTFOLIO / CONTENT</p>
    <h2 style={{ fontSize: 30, letterSpacing: "-.05em", margin: "8px 0" }}>Edit your website</h2>
    <p style={{ color: "#aaa69b", fontSize: 13 }}>Changes are saved to the database, not the source code. Review all text and links before saving.</p>
    {loading ? <p>Loading saved content…</p> : <div style={{ display: "grid", gap: 16 }}>
      <div><label style={label}>HERO INTRO</label><textarea style={field} rows={2} maxLength={4000} value={content.intro} onChange={(e) => update("intro", e.target.value)} /></div>
      <div><label style={label}>ABOUT — LEAD</label><textarea style={field} rows={2} maxLength={4000} value={content.aboutLead} onChange={(e) => update("aboutLead", e.target.value)} /></div>
      <div><label style={label}>ABOUT — BODY</label><textarea style={field} rows={4} maxLength={4000} value={content.aboutBody} onChange={(e) => update("aboutBody", e.target.value)} /></div>
      <h3 style={{ margin: "4px 0 0" }}>Featured projects</h3>
      {content.projects.map((project, index) => <div key={index} style={{ border: "1px solid #30302b", borderRadius: 12, padding: 14, display: "grid", gap: 10 }}>
        <strong>Project {index + 1}</strong>
        {(["name", "description", "url", "status"] as const).map((key) => <label key={key} style={label}>{key.toUpperCase()}<input style={field} maxLength={1000} value={project[key]} onChange={(e) => update("projects", content.projects.map((item, i) => i === index ? { ...item, [key]: e.target.value } : item))} /></label>)}
        <label style={label}>PROJECT DEMO VIDEO (MP4 RECOMMENDED · MAX 100 MB)<input style={field} type="file" accept="video/mp4,video/webm,video/quicktime" disabled={loading || loadFailed || uploading !== null} onChange={(e) => { void uploadVideo(index, e.target.files?.[0]); e.currentTarget.value = ""; }} /></label>
        {project.videoUrl ? <div style={{ display: "grid", gap: 8 }}><video src={project.videoUrl} muted controls playsInline style={{ width: "100%", maxHeight: 240, background: "#111", borderRadius: 8 }} /><p style={{ ...label, fontWeight: 400, overflowWrap: "anywhere" }}>Video uploaded. Save website content to publish this preview. <button type="button" onClick={() => update("projects", content.projects.map((item, i) => i === index ? { ...item, videoUrl: "" } : item))}>Remove video</button></p></div> : null}
        {uploading === index ? <p role="status">Uploading video… keep this page open.</p> : null}
      </div>)}
      <button onClick={save} disabled={saving || loading || loadFailed} style={{ justifySelf: "start", border: 0, borderRadius: 999, background: "#d6b36a", color: "#080808", padding: "13px 20px", fontWeight: 700, cursor: saving || loadFailed ? "not-allowed" : "pointer" }}>{saving ? "SAVING…" : loadFailed ? "SAVING DISABLED — LOAD ERROR" : "SAVE WEBSITE CONTENT ↗"}</button>
      {notice ? <p role="status" style={{ fontSize: 13, color: notice.startsWith("Saved") ? "#d6b36a" : "#f2b7aa", background: notice.startsWith("Saved") ? "#211d14" : "#281512", border: "1px solid #39352b", borderRadius: 8, padding: 12, lineHeight: 1.6 }}>{notice}</p> : null}
    </div>}
  </section>;
}
