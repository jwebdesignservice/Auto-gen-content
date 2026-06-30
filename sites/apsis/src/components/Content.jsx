const WORK = [
  { name: 'Helio', tag: 'Brand Film', grad: 'linear-gradient(135deg,#ffd9a8,#ff7eb3)' },
  { name: 'Vantage', tag: 'Web Platform', grad: 'linear-gradient(135deg,#8ec5ff,#6a5cff)' },
  { name: 'Cinder', tag: 'Visual Identity', grad: 'linear-gradient(135deg,#ff9ed8,#a06bff)' },
  { name: 'Atlas', tag: 'Product Design', grad: 'linear-gradient(135deg,#9cffe0,#5ad1ff)' },
  { name: 'Pulse', tag: 'Motion System', grad: 'linear-gradient(135deg,#ffe6c0,#ff9a6a)' },
  { name: 'Nimbus', tag: 'Campaign', grad: 'linear-gradient(135deg,#c7b3ff,#7ad0ff)' },
]

const CAPS = [
  ['01', 'Brand Strategy', 'Positioning, narrative and naming that give the work a spine.'],
  ['02', 'Visual Identity', 'Type, color and systems built to scale across every surface.'],
  ['03', 'Web & Product', 'Interfaces that feel inevitable and ship on time.'],
  ['04', 'Motion & Film', 'Story in movement, from title sequence to product reveal.'],
  ['05', 'Engineering', 'Real-time 3D, WebGL and front-end built to last.'],
]

const PROCESS = [
  ['01', 'Discover', 'We map the terrain, find the tension, and define what winning looks like.'],
  ['02', 'Design', 'We shape the system, the story and the surfaces until it feels right.'],
  ['03', 'Engineer', 'We build it for real, fast and durable, with no loose ends.'],
  ['04', 'Ship', 'We launch, measure, and sharpen until the work earns its keep.'],
]

const STATS = [
  ['120', '+', 'Projects shipped'],
  ['14', '', 'Awards'],
  ['40', 'M+', 'Views generated'],
  ['9', '', 'Industries'],
]

const MARQUEE = ['Strategy', 'Identity', 'Web', 'Motion', 'Film', 'Engineering', '3D', 'Campaigns', 'Product']

export default function Content() {
  return (
    <main className="content">
      {/* 1. Hero */}
      <section className="beat center hero">
        <p className="eyebrow fx-up">CREATIVE TECHNOLOGY STUDIO</p>
        <h1 className="display fx-words">Form from the formless.</h1>
        <p className="lede fx-up">APSIS turns raw ideas into things that move, ship, and last.</p>
        <span className="cue fx-up">scroll</span>
      </section>

      {/* 2. Statement */}
      <section className="beat left">
        <h2 className="head fx-up">
          We refract ideas
          <br />
          into <span className="accent">light</span>.
        </h2>
        <p className="body fx-up">
          Strategy, design, motion and engineering, fused into a single spectrum and pointed at one
          outcome.
        </p>
      </section>

      {/* 3. Capabilities */}
      <section className="beat caps">
        <div className="panel glass fx-up">
          <p className="eyebrow">WHAT WE DO</p>
          <ul className="caps-list fx-stagger">
            {CAPS.map(([n, t, d]) => (
              <li className="cap" key={n}>
                <span className="cap-n">{n}</span>
                <span className="cap-t">{t}</span>
                <span className="cap-d">{d}</span>
              </li>
            ))}
          </ul>
          <div className="caps-count">
            <span className="count" data-count="150" data-suffix="+">0</span>
            <span className="count-label">builds and counting</span>
          </div>
        </div>
      </section>

      {/* 4. Selected work */}
      <section className="beat work">
        <h2 className="head fx-words">Selected work.</h2>
        <div className="work-grid fx-stagger">
          {WORK.map((w) => (
            <article className="work-card glass" key={w.name}>
              <div className="work-thumb" style={{ background: w.grad }} />
              <div className="work-meta">
                <span className="work-name">{w.name}</span>
                <span className="work-tag">{w.tag}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 5. Process (pinned horizontal) */}
      <section className="process">
        <div className="process-track">
          <div className="process-panel intro">
            <p className="eyebrow fx-up">HOW WE BUILD</p>
            <h2 className="head">A method,
            <br />not a mood.</h2>
          </div>
          {PROCESS.map(([n, t, d]) => (
            <div className="process-panel" key={n}>
              <div className="step glass">
                <span className="step-n">{n}</span>
                <h3 className="step-t">{t}</h3>
                <p className="step-d">{d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Stats */}
      <section className="beat stats-beat center">
        <div className="stats fx-stagger">
          {STATS.map(([v, s, l]) => (
            <div className="stat" key={l}>
              <span className="stat-num count" data-count={v} data-suffix={s}>0</span>
              <span className="stat-label">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Marquee */}
      <section className="marquee-beat">
        <div className="marquee">
          <div className="marquee-row">
            {[...MARQUEE, ...MARQUEE].map((w, i) => (
              <span key={i}>{w}<i className="dot">/</i></span>
            ))}
          </div>
        </div>
        <div className="marquee rev">
          <div className="marquee-row">
            {[...MARQUEE, ...MARQUEE].map((w, i) => (
              <span key={i}>{w}<i className="dot">/</i></span>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Testimonial */}
      <section className="beat center quote-beat">
        <h2 className="quote fx-words">
          They took a vague idea and handed back something we could not stop looking at.
        </h2>
        <p className="quote-by fx-up">Creative Director, Helio</p>
      </section>

      {/* 9. CTA */}
      <section className="beat center cta-beat">
        <p className="eyebrow fx-up">LET'S MAKE SOMETHING</p>
        <h2 className="display fx-words">Let's build.</h2>
        <button className="cta-btn glass fx-up">Start a project</button>
      </section>

      <footer className="footer">
        <span className="brand">APSIS</span>
        <span className="footer-links">STUDIO · WORK · CONTACT</span>
        <span className="footer-fine">© APSIS. Reference build.</span>
      </footer>
    </main>
  )
}
