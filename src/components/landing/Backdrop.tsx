/** Decorative layers: starfield, planet horizon, big glass slabs at the edges and small outlined cubes. */
const STARS = Array.from({ length: 170 }, (_, i) => {
  // deterministic pseudo-random so server and client markup match
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 1.5, o: 0.2 + r(4) * 0.7, d: r(5) * 5 };
});

const BOKEH: [number, number, number][] = [[12, 20, 46], [20, 64, 30], [78, 34, 38], [90, 18, 26], [70, 80, 52], [32, 12, 24], [58, 8, 20], [6, 52, 36]];

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-haze" />
      <div className="backdrop-stars">
        {STARS.map((s, i) => (
          <span key={i} style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o, animationDelay: `${s.d}s` }} />
        ))}
      </div>
      <span className="spark" style={{ left: "65.4%", top: "25.4%" }} />
      <span className="spark" style={{ left: "92%", top: "74.6%" }} />
      <span className="spark spark-sm" style={{ left: "37%", top: "54%" }} />
      <svg className="planet" viewBox="0 0 1672 200" aria-hidden="true">
        <defs>
          <radialGradient id="planet-fill" gradientUnits="userSpaceOnUse" cx="836" cy="0" r="560">
            <stop offset="0" stopColor="#5a64ff" stopOpacity="0.42" />
            <stop offset="0.35" stopColor="#2a2f9a" stopOpacity="0.4" />
            <stop offset="1" stopColor="#03051a" stopOpacity="0.96" />
          </radialGradient>
          <linearGradient id="planet-rim" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1672" y2="0">
            <stop offset="0" stopColor="#8f9cff" stopOpacity="0.25" />
            <stop offset="0.5" stopColor="#e4e8ff" stopOpacity="1" />
            <stop offset="1" stopColor="#8f9cff" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <circle cx="836" cy="3725" r="3725" fill="url(#planet-fill)" />
        <circle cx="836" cy="3725" r="3725" fill="none" stroke="url(#planet-rim)" strokeOpacity="0.12" strokeWidth="70" />
        <circle cx="836" cy="3725" r="3725" fill="none" stroke="url(#planet-rim)" strokeOpacity="0.22" strokeWidth="26" />
        <circle cx="836" cy="3725" r="3725" fill="none" stroke="url(#planet-rim)" strokeOpacity="0.5" strokeWidth="9" />
        <circle cx="836" cy="3725" r="3725" fill="none" stroke="url(#planet-rim)" strokeWidth="2.5" />
      </svg>
    </div>
  );
}

/** Glass slabs and cubes live in the 1672x941 frame so they keep the reference placement. */
export function Shards() {
  return (
    <div className="shards" aria-hidden="true">
      <span className="aura" />
      {BOKEH.map((b, i) => (
        <span key={i} className="bokeh" style={{ left: `${b[0]}%`, top: `${b[1]}%`, width: b[2], height: b[2], animationDelay: `${i * 0.7}s` }} />
      ))}
      <span className="slab slab-tl" />
      <span className="slab slab-l" />
      <span className="slab slab-tr" />
      <span className="slab slab-r"><i>&lt;/&gt;</i></span>
      <span className="slab slab-br" />
      <span className="cube" style={{ left: "33.6%", top: "44.4%", ["--s" as string]: 38, ["--r" as string]: "24deg" }} />
      <span className="cube" style={{ left: "25.5%", top: "52.9%", ["--s" as string]: 28, ["--r" as string]: "-18deg" }} />
      <span className="cube" style={{ left: "82.6%", top: "55.2%", ["--s" as string]: 44, ["--r" as string]: "30deg" }} />
      <span className="cube" style={{ left: "16.9%", top: "73.6%", ["--s" as string]: 52, ["--r" as string]: "-12deg" }} />
    </div>
  );
}
