import { library } from '../../lib/data';
import { Icon } from '../../components/icons';

export default function Library() {
  return (
    <>
      <header className="reveal row-between">
        <div>
          <span className="eyebrow">Work Library</span>
          <h1 className="page-title">{library.length} <em>builds</em>, ready to feature.</h1>
          <p className="lede">Every site we've shipped, captured as a full-page mockup. These are the raw material for showcases — pick a mix and the engine builds the carousel.</p>
        </div>
      </header>

      <section className="libgrid">
        {library.map((p, i) => (
          <div key={p.slug} className="card libcard reveal" style={{ animationDelay: `${60 + i * 35}ms` }}>
            <div className="shot">
              {p.winner ? <span className="badge win winflag">★ Winner</span> : null}
              <img src={`/mockups/${p.slug}.jpg`} alt={p.name} loading="lazy" />
            </div>
            <div className="cap">
              <div className="top">
                <h3>{p.name}</h3>
                <span className="yr">{p.year}</span>
              </div>
              <p className="ind">{p.industry}</p>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
