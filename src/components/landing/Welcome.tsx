"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";

const LEAD = "Hey there! I'm ";

/** Headline, tagline and microcopy. Characters reveal in well under 1.2s, or instantly with reduced motion. */
export function Welcome() {
  const reduced = useReducedMotion();
  const word = "Nova.";
  const total = LEAD.length + word.length;
  const step = Math.min(0.03, 1 / total); // whole reveal stays under ~1s
  const chars = (text: string, offset: number, className?: string) =>
    text.split("").map((c, i) => (
      <span
        key={offset + i}
        className={`ch ${className ?? ""}`}
        style={reduced ? undefined : { animationDelay: `${(offset + i) * step}s` }}
        data-reveal={reduced ? undefined : ""}
      >
        {c === " " ? " " : c}
      </span>
    ));

  return (
    <div className="welcome">
      <h1 className="welcome-title" aria-label="Hey there! I'm Nova.">
        <span aria-hidden="true">
          {chars(LEAD, 0)}
          {chars(word, LEAD.length, "grad")}
        </span>
      </h1>
      <p className="welcome-tagline">Faris&apos;s little AI companion. Ready to explore?</p>
      <p className="welcome-micro">A little personality. A little curiosity. A whole world to discover.</p>
    </div>
  );
}
