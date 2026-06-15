import { videos, stats, fmt } from '../../lib/data';
import { Icon } from '../../components/icons';

export default function Performance() {
  const posted = videos.filter((v) => v.status === 'Posted');
  const withPlays = posted.filter((v) => v.metrics.plays != null);
  const max = Math.max(...withPlays.map((v) => v.metrics.plays || 0), 1);
  const top = stats.topPerformer;

  return (
    <>
      <header className="reveal">
        <span className="eyebrow">Performance</span>
        <h1 className="page-title">What's <em>landing.</em></h1>
        <p className="lede">Plays by post, with the best performer flagged. As more go live we'll spot which hooks, accents and formats consistently win.</p>
      </header>

      {stats.hasMetrics ? (
        <section className="perf-top">
          <div className="card bars reveal" style={{ animationDelay: '80ms' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--faint)' }}>Plays by post</div>
            {withPlays.map((v) => (
              <div className="bar-row" key={v.id}>
                <span className="lbl">{v.title.split(' — ')[0].split('.')[0]}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(4, ((v.metrics.plays || 0) / max) * 100)}%` }} /></div>
                <span className="num">{fmt(v.metrics.plays)}</span>
              </div>
            ))}
          </div>
          <div className="card highlight reveal" style={{ animationDelay: '150ms' }}>
            <span className="badge win" style={{ alignSelf: 'flex-start' }}>★ Top performer</span>
            <div className="v">{fmt(top.metrics.plays)}</div>
            <div style={{ fontWeight: 700, fontSize: 19, letterSpacing: '-.02em' }}>{top.title}</div>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5, marginTop: 8 }}>{top.note}</p>
          </div>
        </section>
      ) : (
        <div className="card reveal" style={{ animationDelay: '80ms', padding: 40, textAlign: 'center', marginTop: 22 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--orange-soft)', color: 'var(--orange-deep)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Icon name="chart" style={{ width: 26, height: 26 }} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>Awaiting analytics</h3>
          <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.55, maxWidth: '46ch', margin: '8px auto 0' }}>
            No real performance numbers entered yet. Once a post has been live a couple of days, drop the plays / likes / saves in Discord and they'll show up here — then we can compare what works.
          </p>
        </div>
      )}

      <div className="section-label">All posts</div>
      <div className="card reveal" style={{ animationDelay: '220ms', padding: '6px 8px' }}>
        <table className="simple">
          <thead>
            <tr><th>Date</th><th>Video</th><th>Type</th><th>Accent</th><th style={{ textAlign: 'right' }}>Plays</th><th style={{ textAlign: 'right' }}>Likes</th><th style={{ textAlign: 'right' }}>Saves</th><th style={{ textAlign: 'right' }}>Status</th></tr>
          </thead>
          <tbody>
            {videos.map((v) => (
              <tr key={v.id}>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--faint)' }}>{v.date}</td>
                <td className="name">{v.title}</td>
                <td style={{ color: 'var(--muted)' }}>{v.type}</td>
                <td><span className="swatch" style={{ background: v.accentHex }} />{v.accent}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(v.metrics.plays)}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(v.metrics.likes)}</td>
                <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(v.metrics.saves)}</td>
                <td style={{ textAlign: 'right', color: v.status === 'Posted' ? '#1c7a37' : 'var(--orange-deep)', fontWeight: 600, fontSize: 13 }}>{v.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
