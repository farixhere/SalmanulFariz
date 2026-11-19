"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const LEAD = "Welcome to my ";
const WORD = "Portfolio";

/** Headline and tagline. Characters reveal in about a second, or instantly with reduced motion. */
export function Welcome() {
  const reduced = useReducedMotion();
  const total = LEAD.length + WORD.length;
  const step = Math.min(0.03, 0.9 / total);
  const chars = (text: string, offset: number) =>
    text.split("").map((c, i) => (
      <span
        key={offset + i}
        className="ch"
        style={reduced ? undefined : { animationDelay: `${(offset + i) * step}s` }}
        data-reveal={reduced ? undefined : ""}
      >
        {c === " " ? " " : c}
      </span>
    ));

  return (
    <div className="welcome">
      <h1 className="welcome-title" aria-label="Welcome to my Portfolio">
        <span aria-hidden="true" className="welcome-lead">{chars(LEAD, 0)}</span>
        <span aria-hidden="true" className="grad">{chars(WORD, LEAD.length)}</span>
      </h1>
      <p className="welcome-tagline">
        <span>Explore. Discover. Get Inspired.</span>
      </p>
    </div>
  );
}
