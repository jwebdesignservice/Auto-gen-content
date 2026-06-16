'use client';
import { useEffect, useState } from 'react';
import { Icon } from '../../components/icons';
import { fmt } from '../../lib/data';

function dateStr(unix) {
  if (!unix) return '';
  const d = new Date(unix * 1000);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });
}

export default function Performance() {
  const [state, setState] = useState({ loading: true });

  useEffect(() => {
    fetch('/api/tiktok/metrics')
      .then((r) => r.json())
      .then((d) => setState({ loading: false, ...d }))
      .catch((e) => setState({ loading: false, ok: false, error: e.message }));
  }, []);

  const vids = (state.videos || []).slice().sort((a, b) => (b.plays || 0) - (a.plays || 0));
  const totals = vids.reduce((s, v) => ({
    plays: s.plays + (v.plays || 0), likes: s.likes + (v.likes || 0), shares: s.shares + (v.shares || 0),
  }), { plays: 0, likes: 0, shares: 0 });
  const top = vids[0];
  const max = Math.max(...vids.map((v) => v.plays || 0), 1);

  return (
    <>
      <header className="reveal">
        <span className="eyebrow">Performance · live from TikTok</span>
        <h1 className="page-title">What's <em>landing.</em></h1>
        <p className="lede">Your TikTok posts, pulled live with real views, likes and shares — top performers first, so we can see which hooks and formats win.</p>
      </header>

      {state.loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center', marginTop: 22, color: 'var(--muted)' }}>Loading live TikTok data…</div>
      ) : !(state.ok && vids.length) ? (
        <div className="card reveal" style={{ padding: 40, textAlign: 'center', marginTop: 22 }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--orange-soft)', color: 'var(--orange-deep)', display: 'grid', placeItems: 'center', margin: '0 auto 16px' }}>
            <Icon name="chart" style={{ width: 26, height: 26 }} />
          </div>
          <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-.02em', margin: 0 }}>Awaiting TikTok data</h3>
          <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: '46ch', margin: '8px auto 0' }}>Couldn't load live stats yet. {state.reason || state.error || 'Try again shortly.'}</p>
        </div>
      ) : (
        <>
          <section className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            {[
              { k: 'Total views', v: fmt(totals.plays), meta: `across last ${vids.length} posts` },
              { k: 'Total likes', v: fmt(totals.likes), meta: 'recent posts' },
              { k: 'Total shares', v: fmt(totals.shares), meta: 'recent posts' },
              { k: 'Best post', v: fmt(top.plays), suffix: 'views', meta: dateStr(top.createTime) },
            ].map((t, i) => (
              <div key={t.k} className="card tile reveal" style={{ animationDelay: `${i * 60}ms` }}>
                <span className="spark" />
                <div className="k">{t.k}</div>
                <div className="v">{t.v}{t.suffix ? <small> {t.suffix}</small> : null}</div>
                <div className="meta">{t.meta}</div>
              </div>
            ))}
          </section>

          <div className="section-label">Top posts by views</div>
          <div className="card bars reveal">
            {vids.slice(0, 8).map((v) => (
              <div className="bar-row" key={v.id}>
                <span className="lbl">{(v.title || 'TikTok post').replace(/#/g, '').trim().slice(0, 22) || dateStr(v.createTime)}</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: `${Math.max(4, ((v.plays || 0) / max) * 100)}%` }} /></div>
                <span className="num">{fmt(v.plays)}</span>
              </div>
            ))}
          </div>

          <div className="section-label">All recent posts</div>
          <div className="card" style={{ padding: '6px 8px' }}>
            <table className="simple">
              <thead>
                <tr><th>Date</th><th>Post</th><th style={{ textAlign: 'right' }}>Views</th><th style={{ textAlign: 'right' }}>Likes</th><th style={{ textAlign: 'right' }}>Comments</th><th style={{ textAlign: 'right' }}>Shares</th></tr>
              </thead>
              <tbody>
                {vids.map((v) => (
                  <tr key={v.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--faint)', whiteSpace: 'nowrap' }}>{dateStr(v.createTime)}</td>
                    <td className="name" style={{ color: 'var(--muted)', fontWeight: 400, maxWidth: 280, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title || 'TikTok post'}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{fmt(v.plays)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(v.likes)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(v.comments)}</td>
                    <td style={{ textAlign: 'right', fontFamily: 'var(--font-mono)' }}>{fmt(v.shares)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
}
