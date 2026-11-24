"use client";

import { ORBIT_ITEMS } from "./OrbitNav";
import { experienceStore, useExperience } from "@/store/experience";

const BLURB: Record<string, string> = {
  skills: "What I work with",
  projects: "Things I've built",
  blog: "Notes and thoughts",
  faq: "Questions, answered",
  about: "A little about me",
};

/** State B: the first screen of the portfolio. The sections themselves arrive in later phases. */
export function PortfolioHome() {
  const target = useExperience((s) => s.target);
  const label = ORBIT_ITEMS.find((i) => i.id === target)?.label;

  return (
    <section className="home" aria-labelledby="home-title">
      <h1 id="home-title" className="home-title">
        Hi, I&apos;m <span className="grad">Faris.</span>
      </h1>
      <p className="home-sub">Welcome to my portfolio. Pick a door to start.</p>
      <ul className="home-tiles">
        {ORBIT_ITEMS.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              className="home-tile"
              aria-pressed={target === item.id}
              onClick={() => experienceStore.getState().openSection(item.id)}
            >
              <span className="orbit-icon">{item.icon}</span>
              <span className="home-tile-name">{item.label}</span>
              <span className="home-tile-blurb">{BLURB[item.id]}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="home-note" role="status" aria-live="polite">
        {label ? `${label} opens in the next phase — it isn't built yet.` : " "}
      </p>
      <button type="button" className="back-btn" onClick={() => experienceStore.getState().reset()}>
        Replay intro
      </button>
    </section>
  );
}
