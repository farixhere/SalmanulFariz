"use client";

import type { CSSProperties, PointerEvent, ReactNode } from "react";
import { experienceStore, type SectionId } from "@/store/experience";

const fill = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" width="100%" height="100%" aria-hidden="true" fill="currentColor">
    {children}
  </svg>
);

/**
 * Positions are the bubble centres in the 1672x941 reference frame; `rot` is the tilt in degrees.
 * DOM order is the tab order: Skills, Projects, Blog, FAQ, About.
 */
export const ORBIT_ITEMS: { id: SectionId; label: string; icon: ReactNode; x: number; y: number; rot: number }[] = [
  { id: "skills", label: "Skills", x: 640, y: 171, rot: 9, icon: fill(<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5-5.9-3.2-5.9 3.2 1.2-6.5-4.8-4.6 6.6-.9z" />) },
  { id: "projects", label: "Projects", x: 447, y: 292, rot: 10, icon: fill(<path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h4l2 2.2h7A2.5 2.5 0 0 1 21 8.7v8.8a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zm7 6.6h4v1.6h-4z" fillRule="evenodd" />) },
  { id: "blog", label: "Blog", x: 973, y: 155, rot: 0, icon: fill(<path d="M12 3C6.8 3 3 6.4 3 10.8c0 2.2 1 4.1 2.6 5.5L5 21l4.4-2.4c.8.2 1.7.3 2.6.3 5.2 0 9-3.4 9-7.9S17.2 3 12 3zM8.5 10.2h7v1.6h-7z" fillRule="evenodd" />) },
  { id: "faq", label: "FAQ", x: 1262, y: 213, rot: -10, icon: fill(<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm.1 15.6a1.3 1.3 0 1 1 0-2.6 1.3 1.3 0 0 1 0 2.6zm1.2-4.7v.5h-2.2v-.8c0-1.3.7-1.9 1.4-2.4.5-.4.9-.7.9-1.2 0-.6-.5-1-1.2-1-.8 0-1.3.5-1.4 1.3L8.6 10c.2-1.7 1.6-2.9 3.5-2.9 2 0 3.4 1.2 3.4 2.9 0 1.2-.7 1.9-1.6 2.5-.5.4-.6.6-.6 1.3z" />) },
  { id: "about", label: "About", x: 1288, y: 385, rot: -8, icon: fill(<path d="M12 2 3.5 6.8v10.4L12 22l8.5-4.8V6.8zm0 2.3 5.9 3.3L12 11 6.1 7.6zM5.5 9.4l5.5 3.2v6.3l-5.5-3.1zm13 0v6.4l-5.5 3.1v-6.3z" fillRule="evenodd" />) },
];

const W = 1672;
const H = 941;
const MAGNET_MAX = 10; // px

function pull(e: PointerEvent<HTMLButtonElement>) {
  if (e.pointerType === "touch") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
  el.style.setProperty("--mx", `${clamp((e.clientX - (r.left + r.width / 2)) * 0.25)}px`);
  el.style.setProperty("--my", `${clamp((e.clientY - (r.top + r.height / 2)) * 0.25)}px`);
}

function release(e: PointerEvent<HTMLButtonElement>) {
  e.currentTarget.style.setProperty("--mx", "0px");
  e.currentTarget.style.setProperty("--my", "0px");
}

/** Glass pill bubbles on a tilted neon ellipse around Nova; CSS stacks them into a row on small screens. */
export function OrbitNav() {
  return (
    <nav className="orbit" aria-label="Sections">
      <svg className="orbit-ring" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <defs>
          <linearGradient id="ring-g" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#8b5cf6" />
            <stop offset="0.5" stopColor="#3b6bff" />
            <stop offset="1" stopColor="#22d3ff" />
          </linearGradient>
        </defs>
        <g transform="rotate(-5.5 864 328)">
          <ellipse cx="864" cy="328" rx="571" ry="176" className="ring-main" stroke="url(#ring-g)" />
        </g>
        <ellipse cx="864" cy="392" rx="255" ry="56" className="ring-inner" />
        <ellipse cx="864" cy="410" rx="320" ry="72" className="ring-inner ring-faint" />
        <circle cx="629" cy="465" r="4" fill="#9fdcff" />
        <circle cx="1136" cy="353" r="3" fill="#9fdcff" />
        <circle cx="1137" cy="466" r="3.5" fill="#9fdcff" />
      </svg>
      {ORBIT_ITEMS.map((item, i) => {
        const style = {
          left: `${(item.x / W) * 100}%`,
          top: `${(item.y / H) * 100}%`,
          ["--rot" as string]: `${item.rot}deg`,
        } as CSSProperties;
        return (
          <div key={item.id} className="orbit-item" style={style}>
            <div className="orbit-float" style={{ animationDelay: `${-i * 0.9}s` }}>
              <button
                type="button"
                className="orbit-bubble"
                aria-label={`Open ${item.label}`}
                onPointerMove={pull}
                onPointerLeave={release}
                onClick={() => experienceStore.getState().openSection(item.id)}
              >
                <span className="orbit-icon">{item.icon}</span>
                <span className="orbit-label">{item.label}</span>
              </button>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
