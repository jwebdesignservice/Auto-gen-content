import { pipeline } from '../../lib/data';
import { Icon } from '../../components/icons';

export default function HowItWorks() {
  return (
    <>
      <header className="reveal">
        <span className="eyebrow">How It Works</span>
        <h1 className="page-title">From research to <em>posted</em> — in five steps.</h1>
        <p className="lede">The engine runs the whole content pipeline. You stay in Discord: approve the idea, tweak the visuals, give the go. Nothing posts without you.</p>
      </header>

      <section className="flow">
        {pipeline.map((s, i) => (
          <div key={s.step} className="flow-step reveal" style={{ animationDelay: `${80 + i * 80}ms` }}>
            <div className="n">{s.step}</div>
            <div>
              <h3><Icon name={s.icon} /> {s.name}</h3>
              <p>{s.detail}</p>
            </div>
          </div>
        ))}
      </section>

      <div className="card reveal" style={{ marginTop: 34, padding: 28, animationDelay: '520ms', background: 'var(--ink)', color: '#fff', border: 'none' }}>
        <span className="eyebrow" style={{ color: 'var(--orange)' }}>The promise</span>
        <h3 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-.02em', margin: '12px 0 6px' }}>
          Custom sites, built in <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', color: 'var(--orange)' }}>six days</span> — and a content engine that sells them.
        </h3>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 15, lineHeight: 1.6, maxWidth: '60ch', margin: 0 }}>
          Each showcase pulls from the work library, renders to TikTok, Instagram and LinkedIn, and tracks what lands — so the studio's marketing compounds on its own.
        </p>
      </div>
    </>
  );
}
