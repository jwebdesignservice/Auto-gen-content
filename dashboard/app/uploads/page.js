import { videos, fmt } from '../../lib/data';

function StatusBadge({ status }) {
  if (status === 'Posted') return <span className="badge posted"><span className="dot" />Posted</span>;
  return <span className="badge ready"><span className="dot" />{status}</span>;
}

export default function Uploads() {
  return (
    <>
      <header className="reveal">
        <span className="eyebrow">Uploads</span>
        <h1 className="page-title">Every <em>video</em> we ship.</h1>
        <p className="lede">Each card shows the variables we changed — hook copy, accent, background and the sites featured — so we can compare posts and keep mixing it up.</p>
      </header>

      <div className="uploads">
        {videos.map((v, i) => (
          <article key={v.id} className="card upload reveal" style={{ animationDelay: `${80 + i * 70}ms` }}>
            <div className="thumb"><img src={v.thumb} alt={v.title} /></div>
            <div className="body">
              <span className="type">{v.type}</span>
              <h3>{v.title}</h3>
              <StatusBadge status={v.status} />
              <div className="vars">
                <span className="chip">Hook: <b>“{v.hookHeading}”</b></span>
                <span className="chip"><span className="swatch" style={{ background: v.accentHex }} />Accent: <b>{v.accent}</b></span>
                <span className="chip">BG: <b>{v.background}</b></span>
                <span className="chip">Cover: <b>{v.cover.join(' + ')}</b></span>
                <span className="chip">{v.slides} slides</span>
                <span className="chip">{v.platforms.join(' · ')}</span>
              </div>
              <div className="vars"><span className="chip">Features: <b>{v.projects.join(', ')}</b></span></div>
            </div>
            <div className="right">
              <span className="date">{v.date}</span>
              <div className="metric">{fmt(v.metrics.plays)}<span>plays</span></div>
              <div style={{ display: 'flex', gap: 14 }}>
                <div className="metric" style={{ fontSize: 20 }}>{fmt(v.metrics.likes)}<span>likes</span></div>
                <div className="metric" style={{ fontSize: 20 }}>{fmt(v.metrics.saves)}<span>saves</span></div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
