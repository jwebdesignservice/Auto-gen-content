import Link from 'next/link';
import { Icon } from '../components/icons';
import { stats, fmt } from '../lib/data';

const TILES = [
  { k: 'Videos built', v: stats.totalVideos, meta: `${stats.posted} posted · ${stats.totalVideos - stats.posted} ready` },
  { k: 'Live on', v: stats.platforms, suffix: 'channels', meta: 'TikTok · Instagram · LinkedIn' },
  stats.topPerformer
    ? { k: 'Best performer', v: fmt(stats.topPerformer.metrics.plays), suffix: 'plays', meta: stats.topPerformer.title }
    : { k: 'Best performer', v: '—', meta: 'Awaiting analytics' },
  { k: 'Work library', v: stats.librarySize, suffix: 'sites', meta: 'Ready to feature' },
];

const CARDS = [
  { href: '/uploads', icon: 'film', title: 'Uploads', desc: 'Every video with its hook copy, accent, background and the sites it features.', mark: '7' },
  { href: '/performance', icon: 'chart', title: 'Performance', desc: 'Plays, likes and saves per post, with your best performers flagged.', mark: '★' },
  { href: '/library', icon: 'layers', title: 'Work Library', desc: 'All 19 site builds, ready to drop into the next showcase.', mark: '19' },
  { href: '/how-it-works', icon: 'workflow', title: 'How It Works', desc: 'The pipeline from daily research to a posted carousel.', mark: '5' },
];

export default function Home() {
  return (
    <>
      <header className="reveal" style={{ animationDelay: '0ms' }}>
        <span className="eyebrow">Fast Launch · Content Engine</span>
        <h1 className="page-title">Studio content,<br /><em>on autopilot.</em></h1>
        <p className="lede">One place to see every video the engine builds, how each one performs, and the work that powers it — so we can mix things up and double down on what lands.</p>
      </header>

      <section className="tiles">
        {TILES.map((t, i) => (
          <div key={t.k} className="card tile reveal" style={{ animationDelay: `${80 + i * 70}ms` }}>
            <span className="spark" />
            <div className="k">{t.k}</div>
            <div className="v">{t.v}{t.suffix ? <small> {t.suffix}</small> : null}</div>
            <div className="meta">{t.meta}</div>
          </div>
        ))}
      </section>

      <div className="section-label">Jump in</div>
      <section className="cards-grid">
        {CARDS.map((c, i) => (
          <Link key={c.href} href={c.href} className="card navcard reveal" style={{ animationDelay: `${360 + i * 80}ms` }}>
            <span className="bigmark">{c.mark}</span>
            <div className="ic"><Icon name={c.icon} /></div>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
            <span className="go">Open <Icon name="arrow" style={{ width: 14, height: 14 }} /></span>
          </Link>
        ))}
      </section>
    </>
  );
}
