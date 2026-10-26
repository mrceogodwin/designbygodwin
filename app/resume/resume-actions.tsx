"use client";

export default function ResumeActions() {
  return (
    <div className="resume-toolbar no-print">
      <a href="/">← BACK TO PORTFOLIO</a>
      <button type="button" onClick={() => window.print()}>PRINT / SAVE AS PDF ↗</button>
    </div>
  );
}
