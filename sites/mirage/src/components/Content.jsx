function Scene({ align, children }) {
  return (
    <section className={`scene ${align}`}>
      <div className="copy">{children}</div>
    </section>
  )
}

export default function Content() {
  return (
    <main className="content">
      {/* 1. Hero over dunes */}
      <Scene align="center">
        <p className="eyebrow r">EAU DE PARFUM</p>
        <h1 className="display r">MIRAGE</h1>
        <p className="lede r">A scent born at the golden hour.</p>
        <span className="scrollcue r">scroll</span>
      </Scene>

      {/* 2. Bottle */}
      <Scene align="left">
        <h2 className="head r">Captured in glass.</h2>
        <p className="body r">The stillness of the desert, held for a single moment of light.</p>
      </Scene>

      {/* 3. Notes */}
      <Scene align="right">
        <p className="eyebrow r">THE NOTES</p>
        <h2 className="head r">Amber. Oud. Warm sand.</h2>
        <p className="body r">An accord that lingers like heat on the horizon.</p>
      </Scene>

      {/* 4. Silk */}
      <Scene align="center">
        <h2 className="head r">Worn like light on skin.</h2>
      </Scene>

      {/* 5. CTA */}
      <Scene align="center">
        <p className="eyebrow r">ARRIVING THIS AUTUMN</p>
        <h2 className="display r">MIRAGE</h2>
        <button className="cta r">Discover the scent</button>
      </Scene>
    </main>
  )
}
