/** A light 2D Nova for devices without WebGL, low-memory devices, lost contexts and load failures. */
export function NovaFallback({ note }: { note?: string }) {
  return (
    <div className="nova-fallback" role="img" aria-label="Nova, a friendly little robot with glowing cyan eyes">
      <svg viewBox="0 0 200 260" width="100%" height="100%" aria-hidden="true">
        <defs>
          <radialGradient id="nf-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#5a82ff" stopOpacity="0.5" />
            <stop offset="1" stopColor="#1e28a0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="nf-shell" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f4f7ff" />
            <stop offset="1" stopColor="#aab6d8" />
          </linearGradient>
        </defs>
        <ellipse cx="100" cy="238" rx="90" ry="16" fill="url(#nf-glow)" />
        <ellipse cx="100" cy="238" rx="62" ry="8" fill="none" stroke="#22d3ff" strokeOpacity="0.8" />
        <g className="nova-fallback-body">
          <rect x="68" y="128" width="64" height="72" rx="26" fill="url(#nf-shell)" />
          <rect x="44" y="136" width="18" height="46" rx="9" fill="url(#nf-shell)" />
          <rect x="138" y="136" width="18" height="46" rx="9" fill="url(#nf-shell)" />
          <rect x="74" y="196" width="22" height="30" rx="10" fill="#8e9cc4" />
          <rect x="104" y="196" width="22" height="30" rx="10" fill="#8e9cc4" />
          <rect x="40" y="40" width="120" height="90" rx="42" fill="url(#nf-shell)" />
          <rect x="52" y="56" width="96" height="58" rx="28" fill="#070b1f" />
          <ellipse className="nova-fallback-eye" cx="80" cy="84" rx="9" ry="12" fill="#22d3ff" />
          <ellipse className="nova-fallback-eye" cx="120" cy="84" rx="9" ry="12" fill="#22d3ff" />
          <path d="M92 100 Q100 107 108 100" stroke="#22d3ff" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      </svg>
      {note ? <p className="nova-fallback-note">{note}</p> : null}
    </div>
  );
}
