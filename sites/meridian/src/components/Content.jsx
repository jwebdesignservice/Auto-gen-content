function Section({ align, hero, children }) {
  return (
    <section className={`section ${align}${hero ? ' hero' : ''}`}>
      <div className="panel">{children}</div>
    </section>
  )
}

export default function Content() {
  return (
    <main className="content">
      {/* 1. Hero */}
      <Section align="left" hero>
        <p className="eyebrow reveal">ONE NETWORK. EVERY REGION.</p>
        <h1 className="title reveal">
          Software that feels <em className="accent">local</em> everywhere.
        </h1>
        <p className="body reveal">
          Meridian runs your app at the edge of every network, so the people using it never wait.
          Real time, planet wide, nothing to manage.
        </p>
        <button className="cta reveal">Get access</button>
      </Section>

      {/* 2. Value */}
      <Section align="left">
        <p className="eyebrow reveal">BUILT FOR REAL TIME</p>
        <h1 className="title reveal">
          Latency you can feel <em className="accent">disappear.</em>
        </h1>
        <p className="body reveal">
          Every request lands on the nearest node. Compute, data and state move with your users, so
          an app in Tokyo answers as fast as one next door.
        </p>
      </Section>

      {/* 3. Problem (explode) */}
      <Section align="center">
        <p className="eyebrow reveal">THE COST OF ONE LOCATION</p>
        <h1 className="title reveal">Central servers put your users in line.</h1>
        <p className="body reveal">
          One region, one queue. The further away someone sits, the longer they wait, and the more
          your product feels slow.
        </p>
        <h1 className="title title-sub reveal">
          Managing regions is its own <em className="accent">full time job.</em>
        </h1>
        <p className="body reveal">
          Spinning up clusters, syncing data, chasing failovers. Most of your time goes to the map
          instead of the product.
        </p>
      </Section>

      {/* 4. The shift */}
      <Section align="right">
        <p className="eyebrow reveal">A DIFFERENT SHAPE OF INFRA</p>
        <h1 className="title reveal">
          Deploy once. <em className="accent">Run everywhere.</em>
        </h1>
        <p className="body reveal">
          Push your code and Meridian places it across the planet for you. State follows the
          request, scaling up and down on its own.
        </p>
      </Section>

      {/* 5. Scale */}
      <Section align="left">
        <p className="eyebrow reveal">FROM ONE USER TO MILLIONS</p>
        <h1 className="title reveal">
          Scale to a <em className="accent">planet.</em>
        </h1>
        <p className="body reveal">
          Start in one region. Grow to every continent without rewriting a line. Meridian handles
          placement, routing and recovery so your network stays fast and in sync.
        </p>
        <div className="stats reveal">
          <div className="stat">
            <span className="stat-num">300+</span>
            <span className="stat-label">edge locations</span>
          </div>
          <div className="stat">
            <span className="stat-num">12ms</span>
            <span className="stat-label">median latency</span>
          </div>
          <div className="stat">
            <span className="stat-num">99.99%</span>
            <span className="stat-label">uptime</span>
          </div>
        </div>
      </Section>

      {/* 6. FAQ */}
      <Section align="right">
        <p className="eyebrow reveal">FAQ</p>
        <h1 className="title reveal">
          Questions, <em className="accent">answered.</em>
        </h1>
        <div className="faq">
          <div className="faq-item reveal">
            <h3>What is Meridian?</h3>
            <p>
              A planet-scale edge network for building real-time software, from a single app to a
              global product running in production.
            </p>
          </div>
          <div className="faq-item reveal">
            <h3>Do I manage regions?</h3>
            <p>No. You deploy once and Meridian places and scales your app across its network for you.</p>
          </div>
          <div className="faq-item reveal">
            <h3>Does my data move too?</h3>
            <p>
              Yes. State and storage follow each request to the nearest node, so reads and writes
              stay local and fast.
            </p>
          </div>
          <div className="faq-item reveal">
            <h3>How do I start?</h3>
            <p>Connect a repo, push, and your app goes live at the edge in minutes.</p>
          </div>
        </div>
      </Section>

      {/* 7. Final CTA */}
      <Section align="center">
        <p className="eyebrow reveal">ONE APP. EVERY REGION.</p>
        <h1 className="title title-xl reveal">
          Go live <em className="accent">everywhere.</em>
        </h1>
        <p className="body reveal">Stop managing the map. Start shipping real time.</p>
        <button className="cta reveal">Get access</button>
      </Section>

      <footer className="footer">
        <span>Meridian</span>
        <span className="footer-links">NETWORK · DOCS · PRICING</span>
        <span className="footer-fine">© Meridian. Reference build.</span>
      </footer>
    </main>
  )
}
