"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { experienceStore, type SectionId } from "@/store/experience";

const svg = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

/** `angle` is degrees on the ellipse, counter-clockwise from the right (0 = right, 90 = top). DOM order = tab order. */
export const ORBIT_ITEMS: { id: SectionId; label: string; icon: ReactNode; angle: number }[] = [
  { id: "skills", label: "Skills", angle: 148, icon: svg(<path d="M13 3 5 14h6l-1 7 8-11h-6z" />) },
  { id: "projects", label: "Projects", angle: 188, icon: svg(<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />) },
  { id: "blog", label: "Blog", angle: 90, icon: svg(<><path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16z" /><path d="m13.5 6.5 4 4" /></>) },
  { id: "faq", label: "FAQ", angle: 32, icon: svg(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01" /></>) },
  { id: "about", label: "About", angle: -8, icon: svg(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>) },
];

const CENTER = { x: 50, y: 48 };
const RADIUS = { x: 47, y: 38 };
const MAGNET_MAX = 10; // px

function position(angle: number): CSSProperties {
  const a = (angle * Math.PI) / 180;
  return { left: `${CENTER.x + RADIUS.x * Math.cos(a)}%`, top: `${CENTER.y - RADIUS.y * Math.sin(a)}%` };
}

function pull(e: PointerEvent<HTMLButtonElement>) {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
  const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
  const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
  el.style.setProperty("--mx", `${clamp(dx)}px`);
  el.style.setProperty("--my", `${clamp(dy)}px`);
}

function release(e: PointerEvent<HTMLButtonElement>) {
  e.currentTarget.style.setProperty("--mx", "0px");
  e.currentTarget.style.setProperty("--my", "0px");
}

/** Five glass bubbles on an ellipse around Nova; CSS collapses them to a compact row on small/portrait-touch screens. */
export function OrbitNav() {
  return (
    <nav className="orbit" aria-label="Sections">
      <svg className="orbit-ring" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <ellipse cx={CENTER.x} cy={CENTER.y} rx={RADIUS.x} ry={RADIUS.y} fill="none" vectorEffect="non-scaling-stroke" />
      </svg>
      {ORBIT_ITEMS.map((item, i) => (
        <div key={item.id} className="orbit-item" style={position(item.angle)}>
          <div className="orbit-float" style={{ animationDelay: `${-i * 0.9}s` }}>
            <button
              type="button"
              className="orbit-bubble"
              aria-label={`Open ${item.label}`}
              onPointerMove={pull}
              onPointerLeave={release}
              onClick={() => experienceStore.getState().openSection(item.id)}
            >
              {item.icon}
              <span className="orbit-label">{item.label}</span>
            </button>
          </div>
        </div>
      ))}
    </nav>
  );
}
