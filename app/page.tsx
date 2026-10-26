const projects = [
  {
    number: "01",
    name: "VIBR.NG",
    type: "CREATOR / INVESTOR NETWORK",
    description:
      "A digital space shaped around discovering builders, sharing projects, and connecting ambitious founders with potential investors.",
    status: "IN DEVELOPMENT",
    tags: ["React", "APIs", "Product thinking"],
    href: "https://github.com/mrceogodwin/vibr",
    mark: "V",
    className: "project-vibr",
  },
  {
    number: "02",
    name: "STACKS.NG",
    type: "SOFTWARE MARKETPLACE",
    description:
      "A product concept for discovering digital tools, software, and practical web services in one focused marketplace.",
    status: "IN DEVELOPMENT",
    tags: ["Web applications", "Product design", "PHP"],
    href: "https://github.com/mrceogodwin/stacks",
    mark: "S",
    className: "project-stacks",
  },
  {
    number: "03",
    name: "KILODE",
    type: "DIGITAL MEDIA / WEB",
    description:
      "A media publishing project exploring a cleaner, more modern experience for entertainment, culture, and trending stories.",
    status: "ONGOING BUILD",
    tags: ["React", "Web UI", "Content experiences"],
    href: "https://github.com/mrceogodwin/Kilode",
    mark: "K",
    className: "project-kilode",
  },
];

const capabilities = [
  ["01", "Frontend development", "React · Responsive interfaces · UI implementation"],
  ["02", "Web application development", "APIs · Application structure · Product features"],
  ["03", "Backend foundations", "NestJS · PHP · Connecting application layers"],
  ["04", "Product-minded execution", "Breaking ideas into stages · Iteration · Debugging"],
];

export default function Home() {
  return (
    <main>
      <div className="topline">
        <a className="wordmark" href="#top" aria-label="Godwin Oriabure home">
          G<span>.</span>O
        </a>
        <div className="topline-center"><span className="live-dot" /> AVAILABLE FOR REMOTE OPPORTUNITIES</div>
        <a className="nav-contact" href="#contact">LET’S TALK <span>↗</span></a>
      </div>

      <section className="hero shell" id="top">
        <div className="hero-meta reveal">
          <span className="eyebrow"><span className="tiny-square" /> INDEPENDENT WEB DEVELOPER</span>
          <span className="hero-index">PORTFOLIO / 2026</span>
        </div>
        <div className="hero-title-wrap">
          <h1 className="hero-title reveal">I BUILD<br /><span className="outline-text">DIGITAL</span><br />THAT <span className="orange-word">MOVES<span className="period">.</span></span></h1>
          <div className="hero-aside reveal">
            <div className="orbit" aria-hidden="true"><span>G</span><i>✳</i></div>
            <p>Curious by nature.<br />Builder by practice.</p>
            <p className="aside-muted">Turning ideas into thoughtful web experiences, one deliberate release at a time.</p>
            <a className="text-link" href="#work">EXPLORE SELECTED WORK <span>↓</span></a>
          </div>
        </div>
        <div className="hero-bottom reveal">
          <p>GODWIN ORIABURE<br /><span>WEB DEVELOPER · DIGITAL BUILDER</span></p>
          <p className="hero-location">BASED IN NIGERIA <span>—</span> WORKING WORLDWIDE</p>
          <a href="#about" className="scroll-cue"><span className="scroll-line" /> SCROLL TO EXPLORE</a>
        </div>
        <div className="hero-decoration" aria-hidden="true">GO<span>®</span></div>
      </section>

      <div className="ticker" aria-label="Build, test, learn, repeat">
        <div className="ticker-track">
          {Array.from({ length: 4 }, (_, i) => <span key={i}>BUILD WITH INTENT <b>✳</b> TEST THE DETAILS <b>✳</b> KEEP MOVING <b>✳</b></span>)}
        </div>
      </div>

      <section className="section shell about-section" id="about">
        <div className="section-head reveal"><span className="section-number">01 / ABOUT</span><span className="section-note">A LITTLE CONTEXT</span></div>
        <div className="about-grid">
          <h2 className="section-title reveal">MORE THAN<br />LINES OF <span className="orange-word">CODE.</span></h2>
          <div className="about-copy reveal">
            <p className="lead">I’m Godwin — a self-taught, project-driven web developer focused on turning ideas into useful digital products.</p>
            <p>I enjoy working across the journey: understanding a problem, shaping a clear interface, connecting the pieces, and improving the result through testing and iteration.</p>
            <p>My portfolio reflects work in progress as well as practical learning. I value honest communication, maintainable code, and shipping improvements that make a product easier to use.</p>
            <div className="about-signature">Curiosity is the starting point. <span>Consistency does the rest.</span></div>
          </div>
        </div>
      </section>

      <section className="section work-section" id="work">
        <div className="shell">
          <div className="section-head reveal"><span className="section-number">02 / SELECTED WORK</span><span className="section-note">IDEAS BECOMING PRODUCTS</span></div>
          <div className="work-intro reveal"><h2 className="section-title">BUILT IN<br />PUBLIC<span className="orange-word">.</span></h2><p>A selection of ongoing builds and product experiments. Each project is a chance to learn, solve a real problem, and get better at the craft.</p></div>
          <div className="project-list">
            {projects.map((project) => (
              <article className={`project-card ${project.className}`} key={project.number}>
                <div className="project-visual">
                  <div className="visual-top"><span>{project.number} / PROJECT</span><span>↗</span></div>
                  <div className="visual-mark">{project.mark}<span>.</span></div>
                  <div className="visual-grid" aria-hidden="true" />
                  <div className="visual-caption">DIGITAL PRODUCT<br />STUDY — 2026</div>
                </div>
                <div className="project-info">
                  <div className="project-type">{project.type}</div>
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <div className="project-foot"><span className="status"><i />{project.status}</span><a href={project.href} target="_blank" rel="noreferrer">VIEW REPOSITORY <span>↗</span></a></div>
                </div>
              </article>
            ))}
          </div>
          <div className="work-foot reveal"><span>MORE BUILDS. MORE ITERATIONS.</span><a href="https://github.com/mrceogodwin" target="_blank" rel="noreferrer">EXPLORE MY GITHUB ↗</a></div>
        </div>
      </section>

      <section className="section shell skills-section" id="capabilities">
        <div className="section-head reveal"><span className="section-number">03 / CAPABILITIES</span><span className="section-note">TOOLS ARE ONLY THE START</span></div>
        <div className="skills-grid">
          <div><h2 className="section-title reveal">HOW I<br /><span className="orange-word">CONTRIBUTE.</span></h2><p className="skills-intro reveal">I’m building depth through hands-on projects, careful debugging, and a habit of learning by doing.</p></div>
          <div className="capability-list">
            {capabilities.map(([number, title, detail]) => <div className="capability reveal" key={number}><span className="cap-number">{number}</span><div><h3>{title}</h3><p>{detail}</p></div><span className="cap-arrow">↗</span></div>)}
          </div>
        </div>
        <div className="toolkit reveal"><span className="toolkit-label">CURRENT TOOLKIT</span><div className="tool-pills">{["React", "JavaScript", "APIs", "NestJS", "PHP", "Git / GitHub", "Vercel"].map((tool) => <span key={tool}>{tool}</span>)}</div></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell">
          <div className="section-head reveal"><span className="section-number">04 / NEXT CHAPTER</span><span className="section-note">OPEN TO REMOTE ROLES</span></div>
          <div className="contact-main">
            <p className="eyebrow reveal"><span className="tiny-square" /> LET’S MAKE SOMETHING USEFUL</p>
            <h2 className="contact-title reveal">GOOD WORK<br />STARTS WITH<br /><span className="orange-word">A HELLO.</span></h2>
            <div className="contact-side reveal"><p>Looking for a junior developer, a curious collaborator, or someone who enjoys building and improving digital products?</p><a className="contact-button" href="https://github.com/mrceogodwin" target="_blank" rel="noreferrer">CONNECT ON GITHUB <span>↗</span></a></div>
          </div>
          <div className="contact-bottom"><span>GODWIN ORIABURE © 2026</span><span>MADE WITH CURIOSITY <b>✳</b></span><a href="#top">BACK TO TOP ↑</a></div>
        </div>
      </section>
    </main>
  );
}
