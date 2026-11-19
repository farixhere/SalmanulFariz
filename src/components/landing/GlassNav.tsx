"use client";

import { useEffect, useState } from "react";

/** The mark is a placeholder lightning logo until Faris supplies the real one. */
function Mark() {
  return (
    <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
      <path d="M36 6 14 36h15l-5 22 26-32H35z" fill="url(#mark)" />
      <defs>
        <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ff" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GlassNav() {
  const [dawn, setDawn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = dawn ? "dawn" : "night";
  }, [dawn]);

  return (
    <header className="glass-nav">
      <a className="glass-nav-logo" href="/" aria-label="Faris — home">
        <Mark />
      </a>
      <div className="glass-nav-actions">
        <button
          type="button"
          className="icon-btn"
          aria-pressed={dawn}
          aria-label="Toggle light theme"
          onClick={() => setDawn((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {dawn ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
              </>
            ) : (
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" />
            )}
          </svg>
        </button>
        <button
          type="button"
          className="icon-btn"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 8h16M4 16h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
