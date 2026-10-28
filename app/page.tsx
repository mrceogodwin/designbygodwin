"use client";

import { useEffect, useState } from "react";

const projects = [
  { id: "01", name: "VIBR.NG", category: "NETWORK / STARTUP", year: "2026", description: "A founder and creator network concept designed to help builders share what they are making and connect with potential investors.", stack: ["React", "APIs", "NestJS"], status: "IN DEVELOPMENT", href: "https://github.com/mrceogodwin/vibr", repo: "https://github.com/mrceogodwin/vibr", symbol: "V", theme: "vibr", detail: "A product-focused build exploring profiles, project discovery, and founder-to-investor connections. Work in progress." },
  { id: "02", name: "STACKS.NG", category: "SOFTWARE MARKETPLACE", year: "2026", description: "A marketplace concept for practical software, plugins, and online tools, with an emphasis on a clear product discovery experience.", stack: ["Web apps", "PHP", "Product UI"], status: "IN DEVELOPMENT", href: "https://github.com/mrceogodwin/stacks", repo: "https://github.com/mrceogodwin/stacks", symbol: "S", theme: "stacks", detail: "The planned experience includes digital product listings, licensing, and a path to manage updates. Work in progress." },
  { id: "03", name: "KILODE", category: "DIGITAL MEDIA", year: "2026", description: "A digital media project exploring modern publishing, entertainment, and culture-focused web experiences.", stack: ["React", "Web UI", "Content"], status: "ONGOING BUILD", href: "https://kilode.com.ng", repo: "https://github.com/mrceogodwin/Kilode", symbol: "K", theme: "kilode", detail: "An ongoing media and interface project with attention to responsive presentation and a distinctive editorial feel." },
];

const services = [
  ["01", "Frontend development", "Responsive pages, interface implementation, reusable components."],
  ["02", "Web experiences", "Landing pages, portfolios, product sites, interaction details."],
  ["03", "Application features", "API integration, forms, interface states, iterative debugging."],
  ["04", "Product thinking", "Turning broad ideas into smaller, testable delivery stages."],
];

const timeline = [
  { date: "NOW", title: "Independent project builds", kind: "PROJECT EXPERIENCE", body: "Learning through hands-on product development, implementation, and iteration.", current: true },
  { date: "ONGOING", title: "Building a practical web toolkit", kind: "CONTINUOUS LEARNING", body: "Working with React, APIs, NestJS, PHP, GitHub, and deployment workflows.", current: false },
];

const socials = [
  { name: "GitHub", handle: "@mrceogodwin", href: "https://github.com/mrceogodwin", icon: "GH", external: true },
  { name: "Get in touch", handle: "Jobs · projects · collaborations", href: "#contact", icon: "↗", external: false },
];

type EditableProject = { name: string; description: string; url: string; status: string; videoUrl?: string };
type EditableContent = { intro: string; aboutLead: string; aboutBody: string; projects: EditableProject[] };

export default function Home() {
  const [siteContent, setSiteContent] = useState<EditableContent | null>(null);
  useEffect(() => {
    fetch("/api/admin/content").then(async (response) => {
      if (!response.ok) return;
      const data = await response.json();
      const value: unknown = data.content;
      if (!value || typeof value !== "object" || Array.isArray(value)) return;
      const candidate = value as Record<string, unknown>;
      if (!["intro", "aboutLead", "aboutBody"].every((key) => typeof candidate[key] === "string")) return;
      if (!Array.isArray(candidate.projects) || candidate.projects.length !== 3) return;
      const validProjects = candidate.projects.every((item) => {
        if (!item || typeof item !== "object" || Array.isArray(item)) return false;
        const project = item as Record<string, unknown>;
        if (!["name", "description", "url", "status"].every((key) => typeof project[key] === "string")) return false;
        if (project.videoUrl !== undefined && typeof project.videoUrl !== "string") return false;
        try { return new URL(project.url as string).protocol === "https:"; } catch { return false; }
      });
      if (validProjects) setSiteContent(value as EditableContent);
    }).catch(() => {});
  }, []);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<Record<string, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <main id="top">
      <header className="nav-wrap">
        <a className="brand" href="#top" aria-label="Godwin home"><span className="brand-icon">g<span>.</span></span><span className="brand-name">GODWIN<br /><small>WEB DEVELOPER</small></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? "CLOSE −" : "MENU +"}</button>
        <nav className={menuOpen ? "main-nav nav-open" : "main-nav"} aria-label="Main navigation">
          {[["About", "#about"], ["Work", "#work"], ["Services", "#services"], ["Experience", "#experience"], ["Resume", "/resume"], ["Contact", "#contact"]].map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </nav>
        <a className="nav-availability" href="#contact"><span /> OPEN TO WORK</a>
      </header>

      <section className="hero-section page-width">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> INDEPENDENT WEB DEVELOPER <span className="eyebrow-year">PORTFOLIO / 2026</span></div>
          <h1>I build<br /><span className="serif-word">digital</span><br /><span className="outlined-word">experiences.</span></h1>
          <p className="hero-intro">{siteContent?.intro || "I’m Godwin — a self-taught developer building web experiences and digital products through curiosity, craft, and hands-on projects."}</p>
          <div className="hero-actions"><a className="button button-dark" href="#work">EXPLORE MY WORK <span>↘</span></a><a className="button button-quiet" href="#contact">LET’S CONNECT <span>↗</span></a></div>
          <div className="hero-stats"><div><strong>03</strong><span>FEATURED BUILDS</span></div><div><strong>∞</strong><span>THINGS TO LEARN</span></div><div><strong>NG</strong><span>BASED IN NIGERIA</span></div></div>
        </div>
        <div className="hero-art" aria-label="Abstract generative geometric artwork">
          <div className="art-label art-label-top">DESIGN × CODE<br />IDEAS IN MOTION</div><div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" /><div className="art-disc art-disc-portrait" role="img" aria-label="Gold monogram artwork representing Godwin"><span className="portrait-monogram">g.</span></div><div className="art-spark">✳</div><div className="art-coordinate">06°20&apos; N<br />05°37&apos; E</div><div className="art-label art-label-bottom">CURIOUS BY NATURE<br />BUILDER BY PRACTICE</div>
        </div>
        <a className="hero-scroll" href="#about"><span className="scroll-wheel" /> SCROLL TO DISCOVER <span>↓</span></a>
      </section>

      <section className="marquee-band" aria-label="Design and development"><div className="marquee-inner">{Array.from({ length: 4 }, (_, i) => <span key={i}>MAKE IT USEFUL <b>✳</b> MAKE IT FEEL RIGHT <b>✳</b> KEEP ITERATING <b>✳</b></span>)}</div></section>

      <section className="content-section page-width" id="about">
        <div className="section-kicker"><span>01 / THE PERSON</span><span>ABOUT ME</span></div>
        <div className="about-layout"><div><p className="mini-label">A DEVELOPER IN PROGRESS — BY DESIGN</p><h2 className="display-heading">I like the space<br />between <em>idea</em><br />and <span>execution.</span></h2></div><div className="about-detail"><p className="about-lead">{siteContent?.aboutLead || "The best part of building is watching a rough idea become something a real person can use."}</p><p>{siteContent?.aboutBody || "I’m a self-taught, project-driven web developer based in Nigeria. I enjoy shaping clear interfaces, connecting application pieces, and improving the details through testing and iteration."}</p><p>This portfolio is a snapshot of what I’m building and learning. I’m looking for opportunities to contribute, learn from a team, and grow through real product work.</p><a className="underlined-link" href="#experience">MY JOURNEY <span>↘</span></a></div></div>
        <div className="principles-grid"><div><span>01</span><strong>Stay curious.</strong><p>Ask better questions and keep learning.</p></div><div><span>02</span><strong>Build with intent.</strong><p>Make choices that serve the user.</p></div><div><span>03</span><strong>Ship, then improve.</strong><p>Break big ideas into real steps.</p></div></div>
      </section>

      <section className="work-section" id="work"><div className="page-width">
        <div className="section-kicker"><span>02 / SELECTED PROJECTS</span><span>IN PROGRESS IS STILL PROGRESS</span></div>
        <div className="section-intro-row"><h2 className="display-heading">A few things<br />I’m <em>building.</em></h2><p>Real project work, honest status, and the thinking behind each build. Open a repository or expand the build notes.</p></div>
        <div className="project-grid">{projects.map((project, index) => { const editable = siteContent?.projects?.[index]; const projectName = editable?.name || project.name; const projectDescription = editable?.description || project.description; const projectHref = editable?.url || project.href; const projectStatus = editable?.status || project.status; return <article className={"project-card " + project.theme} key={project.id}>
          {editable?.videoUrl ? <div className="project-art project-art-video">
            <video className="project-preview-video" src={editable.videoUrl} autoPlay muted={!soundEnabled[project.id]} loop playsInline preload="metadata" aria-label={projectName + " product demo"} />
            <div className="project-video-top"><span>LIVE BUILD / {project.id}</span><span>{project.year}</span></div>
            <button className="project-sound-toggle" type="button" aria-pressed={Boolean(soundEnabled[project.id])} onClick={() => setSoundEnabled((current) => ({ ...current, [project.id]: !current[project.id] }))}>{soundEnabled[project.id] ? "♫ SOUND ON · MUTE" : "♫ ENABLE SOUND"}</button>
            <a className="project-video-open" href={projectHref} target="_blank" rel="noreferrer">OPEN PROJECT ↗</a>
          </div> : <a className={"project-art project-art-showcase showcase-" + project.theme} href={projectHref} target="_blank" rel="noreferrer" aria-label={"Open " + projectName + " project in a new tab"}>
            <div className="showcase-topbar"><span className="showcase-brand"><b>{project.symbol}.</b> {project.name}</span><span className="showcase-window-dots"><i/><i/><i/></span><span className="showcase-top-action">OPEN BUILD ↗</span></div>
            <div className="showcase-canvas">
              {project.theme === "vibr" ? <div className="mock-vibr">
                <div className="mock-vibr-nav"><b>vibr<span>.</span></b><span>Discover</span><span>Founders</span><span>Projects</span><i>＋ Submit build</i></div>
                <div className="mock-vibr-heading"><small>THE BUILDER NETWORK</small><strong>Good ideas deserve<br/><em>to be seen.</em></strong><p>Meet the people building what comes next.</p><div className="mock-pills"><b>Explore projects ↗</b><span>Meet founders</span></div></div>
                <div className="mock-vibr-people"><div><i className="avatar avatar-a">A</i><span><b>AfriLabs</b><small>Product · Lagos</small></span><strong>↗</strong></div><div><i className="avatar avatar-b">T</i><span><b>Tech founders</b><small>Community · Africa</small></span><strong>↗</strong></div></div>
              </div> : project.theme === "stacks" ? <div className="mock-stacks">
                <aside><b>stacks<span>.</span></b><small>DISCOVER</small><span>⌕ &nbsp; All products</span><span>▦ &nbsp; WordPress</span><span>◈ &nbsp; Web tools</span><span>⌘ &nbsp; Developer tools</span><small>YOUR WORKSPACE</small><span>♡ &nbsp; Saved items</span></aside>
                <div className="mock-stacks-main"><div className="mock-stacks-head"><span>Marketplace / Explore</span><b>Sign in ↗</b></div><h4>Tools for the way<br/>you <em>work.</em></h4><p>Thoughtful software. Less busywork.</p><div className="mock-search">⌕ &nbsp; Search plugins, apps and tools...</div><div className="mock-product-row"><div><i>W</i><b>WP Toolkit</b><small>Plugins · WordPress</small><strong>$4.00</strong></div><div><i>⌘</i><b>Focus Board</b><small>Productivity · Web</small><strong>$2.00</strong></div><div><i>✳</i><b>Form Builder</b><small>Utilities · Web</small><strong>$5.00</strong></div></div></div>
              </div> : <div className="mock-kilode">
                <div className="mock-kilode-nav"><b>KILODE<span>.</span></b><span>ENTERTAINMENT</span><span>PEOPLE</span><span>BUSINESS</span><span>GIST ↗</span></div>
                <div className="mock-kilode-feature"><div className="mock-kilode-copy"><small>THE LATEST / CULTURE</small><strong>What’s happening<br/>right <em>now?</em></strong><p>Stories, culture and conversations shaping the moment.</p><b>READ THE LATEST ↗</b></div><div className="mock-kilode-image"><span>KO</span><i>✳</i><b>THE CULTURE<br/>IS ALWAYS ON.</b></div></div>
                <div className="mock-kilode-bottom"><span>01 — TRENDING NOW</span><b>Entertainment, people & culture</b><span>SCROLL TO EXPLORE ↓</span></div>
              </div>}
            </div>
            <div className="showcase-caption"><span>INTERFACE CONCEPT <i>·</i> {project.category}</span><span>VIEW PROJECT ↗</span></div>
          </a>}
          <div className="project-body"><div className="project-name-row"><h3><a href={projectHref} target="_blank" rel="noreferrer" aria-label={"Open " + projectName + " project"}>{projectName} ↗</a></h3><span className="project-status"><i />{projectStatus}</span></div><p>{projectDescription}</p><div className="project-tech">{project.stack.map(t => <span key={t}>{t}</span>)}</div>{activeProject === project.id && <div className="project-detail"><p>{project.detail}</p><a href={project.repo} target="_blank" rel="noreferrer">VIEW SOURCE REPOSITORY ↗</a></div>}<div className="project-link-row"><span>CASE STUDY / BUILD NOTES</span><button onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}>{activeProject === project.id ? "CLOSE −" : "VIEW DETAILS +"}</button></div></div>
        </article>; })}</div>
        <div className="projects-footer"><span>MORE ITERATIONS. MORE TO COME.</span><a href="https://github.com/mrceogodwin" target="_blank" rel="noreferrer">ALL REPOSITORIES ON GITHUB ↗</a></div>
      </div></section>

      <section className="services-section page-width" id="services"><div className="section-kicker"><span>03 / WHAT I CAN HELP WITH</span><span>CAPABILITIES</span></div><div className="services-layout"><h2 className="display-heading">Small details.<br /><em>Whole</em> experiences.</h2><div className="service-list">{services.map(([n, title, desc]) => <div className="service-row" key={n}><span className="service-number">{n}</span><div><h3>{title}</h3><p>{desc}</p></div><span className="service-arrow">↗</span></div>)}</div></div><div className="toolkit-strip"><span>TOOLS I’M WORKING WITH</span><div>{["React", "JavaScript", "APIs", "NestJS", "PHP", "GitHub", "Vercel"].map(t => <b key={t}>{t}</b>)}</div></div></section>

      <section className="experience-section" id="experience"><div className="page-width"><div className="section-kicker"><span>04 / THE JOURNEY</span><span>EXPERIENCE & LEARNING</span></div><div className="section-intro-row"><h2 className="display-heading">Growing by<br /><em>doing.</em></h2><p>My focus is practical experience: building projects, learning tools, and improving my ability to deliver working software. This section intentionally avoids invented job titles or dates.</p></div><div className="timeline">{timeline.map(item => <div className="timeline-item" key={item.title}><div className="timeline-date">{item.date}</div><div className="timeline-marker"><span /></div><div className="timeline-content"><span>{item.kind}</span><h3>{item.title}</h3><p>{item.body}</p></div><span className="timeline-arrow">↗</span></div>)}</div><div className="resume-note"><div><span className="mini-label">YOUR NEXT HIRE?</span><h3>Let’s make good work<br />happen together.</h3></div><a className="button button-light" href="#contact">TALK ABOUT A ROLE ↗</a></div></div></section>

      <section className="social-section page-width" id="socials"><div className="section-kicker"><span>05 / ELSEWHERE</span><span>FIND ME ONLINE</span></div><div className="social-heading"><h2 className="display-heading">Let’s connect<br /><em>outside the screen.</em></h2><p>Explore my code or use the contact form for roles, projects, and collaborations.</p></div><div className="social-grid">{socials.map(s => <a className="social-card" href={s.href} key={s.name} target={s.external ? "_blank" : undefined} rel={s.external ? "noreferrer" : undefined}><span className="social-icon">{s.icon}</span><span><strong>{s.name}</strong><small>{s.handle}</small></span><span className="social-arrow">↗</span></a>)}</div></section>

      <section className="contact-section" id="contact"><div className="page-width"><div className="section-kicker"><span>06 / START A CONVERSATION</span><span>CONTACT</span></div><div className="contact-layout"><div className="contact-copy"><p className="mini-label">AVAILABLE FOR REMOTE OPPORTUNITIES</p><h2 className="display-heading">Have a good<br /><em>one in mind?</em></h2><p>Tell me about the role, project, or idea. I’m happy to connect and see whether I can help.</p><a className="email-copy" href="https://github.com/mrceogodwin" target="_blank" rel="noreferrer">Connect through GitHub <span>OPEN PROFILE ↗</span></a><p className="contact-note">Direct email contact can be added once your preferred professional email is confirmed.</p></div><ContactForm /></div><div className="contact-bottom"><a className="brand" href="#top"><span className="brand-icon">g<span>.</span></span><span className="brand-name">GODWIN<br /><small>WEB DEVELOPER</small></span></a><span>DESIGNED WITH INTENT · BUILT WITH CURIOSITY</span><a href="#top">BACK TO TOP ↑</a></div></div></section>
    </main>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: "Job opportunity", message: "" });
  const [website, setWebsite] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  function update(field: keyof typeof form, value: string) { setForm(old => ({ ...old, [field]: value })); }
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSent(false);
    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const result = await response.json() as { ok?: boolean; error?: string };
      if (!response.ok) throw new Error(result.error || "Could not send your message. Please try again.");
      setSent(true);
      setForm({ name: "", email: "", topic: "Job opportunity", message: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return <form className="contact-form" onSubmit={submit}><div className="contact-honeypot" aria-hidden="true"><label>Leave this field empty<input name="website" value={website} onChange={e => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" /></label></div><div className="form-heading"><span>CONTACT FORM / 01</span><span>✳</span></div><label>Your name<input value={form.name} onChange={e => update("name", e.target.value)} placeholder="What should I call you?" maxLength={120} required /></label><label>Email address<input type="email" value={form.email} onChange={e => update("email", e.target.value)} placeholder="you@company.com" maxLength={254} required /></label><label>What’s this about?<select value={form.topic} onChange={e => update("topic", e.target.value)}><option>Job opportunity</option><option>Freelance project</option><option>Collaboration</option><option>Just saying hello</option></select></label><label>Your message<textarea value={form.message} onChange={e => update("message", e.target.value)} placeholder="Tell me a little about it..." rows={4} maxLength={5000} required /></label>{error && <p className="form-error">{error}</p>}{sent && <p className="form-success">Thanks — your message has been saved. I’ll be in touch.</p>}<button className="button button-dark form-submit" type="submit" disabled={submitting}>{submitting ? "SENDING..." : "SEND MESSAGE"} <span>↗</span></button><p className="form-privacy">Messages are stored in the portfolio database. Please avoid sending sensitive personal information.</p></form>;
}
