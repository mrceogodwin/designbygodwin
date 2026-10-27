"use client";

import Link from "next/link";

export default function ResumeActions() {
  return (
    <div className="resume-toolbar no-print">
      <Link href="/">← BACK TO PORTFOLIO</Link>
      <button type="button" onClick={() => window.print()}>PRINT / SAVE AS PDF ↗</button>
    </div>
  );
}
