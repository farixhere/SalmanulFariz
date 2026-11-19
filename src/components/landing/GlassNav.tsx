"use client";

import { useEffect, useState } from "react";

/** The mark is a placeholder lightning logo until Faris supplies the real one. */
function Mark() {
  return (
    <svg viewBox="0 0 64 64" width="34" height="34" aria-hidden="true">
      <path d="M40 4 12 34h18l-6 26 30-34H35z" fill="#fff" />
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
        <button type="button" className="nav-icon" aria-pressed={dawn} aria-label="Toggle light theme" onClick={() => setDawn((v) => !v)}>
          <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            {dawn ? (
              <>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4" />
              </>
            ) : (
              <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z" fill="currentColor" />
            )}
          </svg>
        </button>
        <span className="nav-divider" aria-hidden="true" />
        <button type="button" className="nav-icon" aria-label="Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((v) => !v)}>
          <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}
