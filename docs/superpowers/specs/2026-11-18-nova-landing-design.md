# Nova Landing Page — Design (Phase: State A only)

Date: 2026-11-18 · Status: approved by Faris in chat ("do your work accordingly")

## Intent and why
Faris wants his portfolio to open with a memorable, immersive landing page: a playful 3D robot, **Nova**, welcomes visitors, follows their cursor, and offers orbiting glass navigation. The landing page must match the supplied reference image (`1794973116599_image.png`) as closely as possible, rebuilt from real components and a real 3D model, not a static image. The full vision is in the master brief (`attachment.txt`); this phase delivers **State A (the landing) only**.

## Goals
- Landing page visually matches the reference: floating glass nav bar (logo left; theme toggle + menu right), orbit ring with five glass bubbles (Skills, Projects, Blog, FAQ, About), central 3D Nova on a glowing platform, headline + tagline + microcopy, "Click to Explore" CTA, planet-curve glow at the bottom, terminal text bottom-left, scroll chevron, floating glass shards/cubes, starfield.
- Nova is a real 3D character loaded from `nova_robot.glb`.
- Head tracking (head group only, damped lerp, clamped, returns to neutral) and **independent** eye tracking (eyes/mouth slide on the visor plane), natural blinking, expression states (relaxed, curious, excited, happy), idle float/breathing, occasional wave.
- Pointer reactions: notices approach, curious when near, relaxes on leave, excited on Explore hover, smiles + glow on Explore click.
- Touch devices: no cursor tracking; idle animation + tap reactions.
- Accessible: keyboard-reachable bubbles with labels, visible focus, skip-intro button, `prefers-reduced-motion`, WebGL-failure fallback (static/CSS Nova), loading state.
- Basic SEO metadata (title, description, Open Graph, favicon placeholder), semantic HTML.

## Non-goals (this phase)
- Particle-diffusion transition, main portfolio sections (Projects, Skills 3D, Blog, About, FAQ, Contact), post-entrance Nova assistant, backend/CMS. Bubbles and Explore are wired to a state store with stub targets only; nothing pretends to be finished.
- No invented bio, projects, achievements, or skill claims.

## Anti-goals (failure even if it "works")
- Flat image standing in for the 3D robot; whole-body rotation faking head tracking; generic template look; heavy neon overload; blocking the visitor in an animation; claiming features work without verification.

## Constraints
- Repo `farixhere/SalmanulFariz` is empty (README only). Greenfield.
- Bash sandbox has no network for package installs: cannot run `npm install`, build, or a browser here. Verification route: push a branch, let Vercel build it, read build/runtime logs (Vercel MCP). Local testing becomes possible if Faris enables network and starts a new chat.
- The GLB: 193 flat named meshes under one root `world` node, no skeleton, no animations, no textures, vertices in world space (pivots at origin), 7 materials (one emissive cyan). Eyes are smiling-arc meshes only.
- Do not commit secrets. Do not change production env vars without checking.

## Approaches considered
1. **Procedural Nova in Three.js primitives** — full control, no asset dependency; rejected because Faris supplied a GLB that is closer to the reference.
2. **GLB loaded as-is, animate whole model** — simplest; rejected because it cannot meet independent head/eye tracking.
3. **GLB, regrouped at load time (chosen)** — traverse meshes by name, reparent into `head`, `eyes`, `mouth`, `armL`, `armR`, `body` groups with computed pivots (neck for head; shoulders for arms; visor-plane centre for eyes). Keeps the supplied look and gives independent control. Fallback: static/CSS Nova if WebGL fails.

Stack choice (my call, not discussed): Next.js App Router + TypeScript + React Three Fiber/drei + GSAP, deployed on Vercel. Framer Motion not needed this phase.

## Design decisions (as decided)
- Headline per brief, in the reference's typographic style: "Hey there! I'm **Nova**." (light italic + gradient bold on "Nova"), subline "Faris's little AI companion. Ready to explore?", microcopy "A little personality. A little curiosity. A whole world to discover." Reveal animation fast (<1.2s).
- Bubble order/positions follow the reference's elliptical orbit; compact grid on mobile.
- Pointer tracking is written into refs (no React re-render per mousemove); R3F `useFrame` does the damping.
- State A/B managed by a small store (`entered: boolean`, `phase`) so the later transition drops in cleanly.

## Left to the builder (my calls, flag in review)
- Exact orbit geometry, glass styling, fonts (display serif-italic + clean sans pairing), colour tokens from the palette in the brief.
- Pivot computation method for the GLB groups; blink/expression parameter values.
- Logo mark: reference lightning-bolt "F"-style mark redrawn as SVG (placeholder until Faris supplies his own).
- Planet curve, shards and starfield are CSS/SVG/Three primitives, not images.

## Definition of done (this phase)
Landing renders on Vercel preview without build errors; Nova loads; head and eyes follow the pointer on desktop; touch fallback works; bubbles + Explore are keyboard operable; reduced-motion respected. Anything not verified is reported as unverified.
