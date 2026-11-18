/** Static decorative layers: night gradient, starfield, planet-curve glow and corner glass shards. */
const STARS = Array.from({ length: 70 }, (_, i) => {
  // deterministic pseudo-random so server and client markup match
  const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
  return { x: r(1) * 100, y: r(2) * 100, s: 1 + r(3) * 1.6, o: 0.25 + r(4) * 0.65, d: r(5) * 4 };
});

export function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <div className="backdrop-stars">
        {STARS.map((s, i) => (
          <span
            key={i}
            style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o, animationDelay: `${s.d}s` }}
          />
        ))}
      </div>
      <div className="backdrop-planet" />
      <span className="shard shard-a" />
      <span className="shard shard-b" />
      <span className="shard shard-c" />
      <span className="cube cube-a" />
      <span className="cube cube-b" />
    </div>
  );
}
