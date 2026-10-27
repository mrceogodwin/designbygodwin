import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Resume — Godwin Oriabure",
  description:
    "Project-focused web developer resume for Godwin Oriabure, with selected projects, technical toolkit, and print-ready layout.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    title: "Resume — Godwin Oriabure",
    description:
      "Project-focused web developer resume, selected projects, technical toolkit, and education.",
    url: "/resume",
    type: "profile",
  },
};

const projects = [
  {
    name: "VIBR.NG",
    status: "In development",
    description:
      "A founder and builder network concept focused on sharing projects and connecting founders with potential investors.",
    href: "https://github.com/mrceogodwin/vibr",
  },
  {
    name: "STACKS.NG",
    status: "In development",
    description:
      "A software marketplace concept for plugins, standalone apps, and practical online tools.",
    href: "https://github.com/mrceogodwin/stacks",
  },
  {
    name: "KILODE",
    status: "Live website",
    description:
      "A culture-focused digital media and publishing website with entertainment and current-interest content.",
    href: "https://kilode.com.ng",
  },
];

export default function ResumePage() {
  return (
    <main className="resume-page">
      <div className="resume-toolbar no-print">
        <Link href="/">← BACK TO PORTFOLIO</Link>
        <span>PRINT / SAVE AS PDF: use Ctrl+P (Windows) or Cmd+P (Mac)</span>
      </div>

      <article className="resume-sheet">
        <header className="resume-header">
          <div>
            <p className="resume-eyebrow">PROJECT-FOCUSED WEB DEVELOPER · NIGERIA</p>
            <h1>Godwin <em>Oriabure.</em></h1>
            <p className="resume-summary">
              Self-taught, project-driven developer building responsive web
              experiences and digital products through hands-on implementation,
              testing, and iteration.
            </p>
          </div>
          <div className="resume-contact">
            <a href="https://github.com/mrceogodwin" target="_blank" rel="noreferrer">github.com/mrceogodwin ↗</a>
            <Link href="/#contact">Contact through portfolio ↗</Link>
            <span>Open to remote opportunities</span>
          </div>
        </header>

        <section className="resume-block">
          <h2>Technical toolkit</h2>
          <div className="resume-skills">
            {["React", "JavaScript", "API integration", "NestJS", "PHP", "Git & GitHub", "Vercel", "Responsive UI", "Debugging", "Product iteration"].map(skill => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          <p className="resume-note-text">
            Skills listed reflect tools and areas used or explored in personal project work.
          </p>
        </section>

        <section className="resume-block">
          <h2>Selected project experience</h2>
          <div className="resume-projects">
            {projects.map((project, index) => (
              <div className="resume-project" key={project.name}>
                <div className="resume-project-heading">
                  <h3><span>0{index + 1}</span> {project.name}</h3>
                  <small>{project.status}</small>
                </div>
                <p>{project.description}</p>
                <a href={project.href} target="_blank" rel="noreferrer">{project.href.replace("https://", "")} ↗</a>
              </div>
            ))}
          </div>
        </section>

        <section className="resume-block resume-education">
          <h2>Education</h2>
          <div>
            <h3>Higher National Diploma (HND), Computer Science</h3>
            <p>Auchi Polytechnic · Department of Computer Science</p>
          </div>
        </section>

        <footer className="resume-footer">
          <span>BUILDING IN PUBLIC · LEARNING BY DOING</span>
          <Link href="/">GODWIN ORIABURE ↗</Link>
        </footer>
      </article>
    </main>
  );
}
