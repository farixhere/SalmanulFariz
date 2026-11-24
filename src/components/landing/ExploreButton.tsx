"use client";

import type { PointerEvent } from "react";
import { experienceStore, useExperience } from "@/store/experience";

const MAGNET_MAX = 8; // px

/** "Click to Explore": Nova reacts, then the landing dissolves into the portfolio (see Landing). */
export function ExploreButton() {
  const reacting = useExperience((s) => s.phase !== "idle");
  const hover = (on: boolean) => experienceStore.getState().hoverExplore(on);

  const onClick = () => {
    // The entrance sequence in Landing takes over from here: reaction, then dissolve, then State B.
    experienceStore.getState().explore();
  };

  const pull = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.pointerType === "touch") return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
    el.style.setProperty("--mx", `${clamp((e.clientX - (r.left + r.width / 2)) * 0.12)}px`);
    el.style.setProperty("--my", `${clamp((e.clientY - (r.top + r.height / 2)) * 0.2)}px`);
  };

  return (
    <button
      type="button"
      className={`explore-btn${reacting ? " is-reacting" : ""}`}
      aria-disabled={reacting}
      onClick={onClick}
      onPointerEnter={(e) => e.pointerType !== "touch" && hover(true)}
      onPointerLeave={(e) => {
        e.currentTarget.style.setProperty("--mx", "0px");
        e.currentTarget.style.setProperty("--my", "0px");
        hover(false);
      }}
      onPointerMove={pull}
      onFocus={() => hover(true)}
      onBlur={() => hover(false)}
    >
      <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor">
        <path d="M12 2l1.8 5.7L19.5 9l-5.7 1.8L12 16.5l-1.8-5.7L4.5 9l5.7-1.3zM19 15l.9 2.6 2.6.9-2.6.9L19 22l-.9-2.6-2.6-.9 2.6-.9z" />
      </svg>
      <span className="explore-text">Click to Explore</span>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </button>
  );
}
