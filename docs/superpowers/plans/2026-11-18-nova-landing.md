# Nova Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build State A of Faris's portfolio, a full-screen landing that matches the reference image, with a real 3D Nova (from `nova_robot.glb`) that tracks the cursor with head and eyes independently.

**Architecture:** Next.js App Router page renders a DOM layer (glass nav, orbit bubbles, headline, CTA, decorations) over a React Three Fiber canvas holding Nova. Pointer position lives in a ref (no re-render per mousemove); `useFrame` damps head/eye/body toward targets. The GLB's flat meshes are regrouped by name at load time into `head`, `eyes`, `mouth`, `armL`, `armR`, `body` with computed pivots. Pure logic (part classification, damping, clamping, expressions, blink scheduling) is isolated in `src/lib/nova/` and unit-tested.

**Tech Stack:** Next.js (App Router) + TypeScript, three, @react-three/fiber, @react-three/drei, gsap, zustand, vitest. Deploy: Vercel.

**Spec:** `docs/superpowers/specs/2026-11-18-nova-landing-design.md` (master brief and reference image: `attachment.txt`, `1794973116599_image.png` in the conversation uploads).

## Global Constraints

- Phase scope: State A only. No particle transition, no portfolio sections, no assistant. Bubbles and Explore call store stubs only.
- Nova copy verbatim: "Hey there! I'm Nova." / "Faris's little AI companion. Ready to explore?" / "A little personality. A little curiosity. A whole world to discover." CTA: "Click to Explore". Bubbles: Skills, Projects, Blog, FAQ, About.
- Palette: deep space black, midnight navy, electric blue, cyan, violet, soft white. No excessive neon.
- No invented bio/projects/achievements. No secrets in the repo.
- Head tracking rotates the head group only; eyes track independently; max rotation clamped; damped lerp; neutral on pointer leave.
- Touch devices: no cursor tracking, idle animation + tap reactions only.
- Respect `prefers-reduced-motion`; keyboard operable; visible focus; skip-intro control.
- Environment: no package installs or builds are possible in the authoring sandbox. Verification = `npx vitest run` and `npm run build` where network exists, otherwise the Vercel preview build logs. Report anything unverified as unverified.
- Commit trailers on every commit: `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` and `Claude-Session: https://claude.ai/code/session_01XtFsWQtgSZQ1qmR2WnetDX`. Work on branch `feat/nova-landing`, never directly on `main`.

## Review Focus

1. WebGL unsupported or context lost: fallback Nova renders, bubbles and CTA still work.
2. GLB fails to load (404 / offline): visible error state, page remains usable.
3. Pointer leaves window, or first event never arrives: Nova returns to neutral, no NaN rotations.
4. Rapid double-click / Enter-spam on Explore: reaction fires once.
5. Tab hidden then resumed (huge frame delta): no snapping or explosion; delta is clamped.
6. Resize / rotate to portrait: orbit layout switches to compact mobile nav without overlap.
7. Reduced motion: no float, blink loop or wave; page still readable and operable.

---

## File Structure

```
package.json, tsconfig.json, next.config.ts, vitest.config.ts, .gitignore
public/models/nova_robot.glb
src/app/{layout.tsx,page.tsx,globals.css,robots.ts,sitemap.ts}
src/store/experience.ts
src/lib/nova/{parts.ts,motion.ts,expressions.ts,blink.ts}      # pure, tested
src/hooks/{usePointerRef.ts,useReducedMotion.ts,useCoarsePointer.ts,useWebGL.ts}
src/components/nova/{NovaScene.tsx,NovaRobot.tsx,NovaFallback.tsx,Platform.tsx}
src/components/landing/{Landing.tsx,GlassNav.tsx,OrbitNav.tsx,Welcome.tsx,ExploreButton.tsx,Backdrop.tsx,TerminalText.tsx}
tests/lib/nova/*.test.ts
```

### Task 1: Scaffold, asset, Vercel preview

**Files:** Create `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `.gitignore`, `src/app/{layout.tsx,page.tsx,globals.css}`, `public/models/nova_robot.glb` (copy from the uploaded attachment).

**Interfaces:** Produces: a building Next.js app with a placeholder `page.tsx`; `@/*` path alias to `src/*`; npm scripts `dev`, `build`, `test` (`vitest run`).

- [ ] **Step 1:** Create the branch `feat/nova-landing` from `main`.
- [ ] **Step 2:** Write the config files by hand (no `create-next-app`, which needs network). Dependencies: next, react, react-dom, three, @react-three/fiber, @react-three/drei, gsap, zustand; dev: typescript, @types/*, vitest. Pin to current stable majors compatible with each other (React 19 + R3F 9 if Next 15/16; otherwise R3F 8 with React 18).
- [ ] **Step 3:** Copy the GLB to `public/models/nova_robot.glb`; `page.tsx` renders a placeholder `<main>`.
- [ ] **Step 4:** Link the repo to a Vercel project (Vercel MCP `create_git_project` or existing project), push the branch, and read the preview build logs. Expected: build succeeds; if dependency versions conflict, fix `package.json` and repush.
- [ ] **Step 5: Commit** `chore: scaffold Next.js app and add Nova GLB`.

### Task 2: Pure Nova logic (TDD)

**Files:** Create `src/lib/nova/{parts.ts,motion.ts,expressions.ts,blink.ts}`; Test `tests/lib/nova/{parts,motion,expressions,blink}.test.ts`.

**Interfaces:** Produces:
- `type PartGroup = 'head' | 'eyes' | 'mouth' | 'armL' | 'armR' | 'body'`
- `classifyPart(name: string): PartGroup` in `parts.ts`
- `damp(current: number, target: number, lambda: number, dt: number): number`; `clamp(v: number, min: number, max: number): number`; `lookTarget(ndcX: number, ndcY: number, maxYaw: number, maxPitch: number): { yaw: number; pitch: number }` in `motion.ts`
- `type Expression = 'relaxed' | 'curious' | 'excited' | 'happy'`; `EXPRESSIONS: Record<Expression, { eyeScaleY: number; eyeTilt: number; eyeGlow: number; headTilt: number }>` in `expressions.ts`
- `nextBlinkDelay(rand: () => number): number` (seconds, 2.2–5.5) and `blinkScale(t: number): number` (1→0.08→1 over 0.16s) in `blink.ts`

- [ ] **Step 1: Write failing tests.** `parts.test.ts`: `classifyPart('Helmet outer shell')==='head'`, `'Cyan smiling eye -1_seg3'==='eyes'`, `'Cyan smiling eye 1_node0'==='eyes'`, `'Happy curved mouth_node4'==='mouth'`, `'Ear outer glowing disc 1'==='head'`, `'Helmet status light_1'==='head'`, `'Shoulder joint -1'==='armL'`, `'Open palm 1'==='armR'`, `'Finger 1 2'==='armR'`, `'Chest main armor'==='body'`, `'Foot sole -1'==='body'`. (Side rule to confirm against the model: the `-1` suffix and `1` suffix map to opposite sides; verify which is screen-left by inspecting vertex x of `Shoulder joint -1` and `Shoulder joint 1` and set the mapping accordingly. Add one test asserting the verified mapping.) `motion.test.ts`: `damp(0,1,8,0)===0`; `damp(0,1,8,10)` is within 1e-3 of 1; `lookTarget(5,-5,0.5,0.3)` clamps to `{yaw: 0.5, pitch: -0.3}` (sign convention: pointer right → positive yaw toward the pointer, pointer up → pitch looks up; assert both); `lookTarget(NaN,0,…)` returns zeros. `blink.test.ts`: `nextBlinkDelay(()=>0)===2.2`, `nextBlinkDelay(()=>1)===5.5`; `blinkScale(0)===1`, `blinkScale(0.08)` ≈ 0.08, `blinkScale(0.2)===1`. `expressions.test.ts`: every Expression key exists and `excited.eyeGlow > relaxed.eyeGlow`.
- [ ] **Step 2:** Run `npx vitest run`. Expected: FAIL (modules missing).
- [ ] **Step 3:** Implement the signatures above. `classifyPart` uses name-prefix rules (head: Helmet (incl. "Helmet luminous face rim", "Helmet status light"), Visor, Black glass, Ear; eyes: "Cyan smiling eye"; mouth: "Happy curved mouth"; arms: Shoulder/Upper arm/Elbow/Forearm/Wrist/Open palm/Finger/Fingertip/Thumb with side from the trailing `-1`/`1` token; Shoulder light strip follows its side's arm; everything else body). `damp` is frame-rate independent: `current + (target-current)*(1-Math.exp(-lambda*dt))`. Non-finite inputs return 0.
- [ ] **Step 4:** Run `npx vitest run`. Expected: all PASS.
- [ ] **Step 5: Commit** `feat: pure Nova motion, expression and part-classification logic`.

### Task 3: Store and hooks

**Files:** Create `src/store/experience.ts`, `src/hooks/{usePointerRef.ts,useReducedMotion.ts,useCoarsePointer.ts,useWebGL.ts}`; Test `tests/store/experience.test.ts`.

**Interfaces:** Produces:
- `useExperience` (zustand) with `{ entered: boolean; phase: 'idle'|'reacting'; mood: Expression; target: SectionId | null; hoverExplore(on: boolean): void; explore(): void; openSection(id: SectionId): void; reset(): void }`, `type SectionId = 'skills'|'projects'|'blog'|'faq'|'about'`. `explore()` is a no-op if `phase!=='idle'`.
- `usePointerRef(): React.MutableRefObject<{ x: number; y: number; active: boolean; nearNova: boolean }>`: window `pointermove` writes NDC coords into the ref; `pointerleave`/`blur` sets `active=false`; ignores `pointerType==='touch'`.
- `useReducedMotion(): boolean`, `useCoarsePointer(): boolean`, `useWebGL(): 'checking'|'ok'|'unsupported'`.

- [ ] **Step 1:** Write failing store tests: `explore()` twice leaves `phase==='reacting'` and calls the exit hook once (inject a callback via `useExperience.setState({ onExplore: fn })`); `hoverExplore(true)` sets mood `excited`, `false` returns to `relaxed`; `openSection('faq')` sets `target`.
- [ ] **Step 2:** Run `npx vitest run tests/store`. Expected: FAIL.
- [ ] **Step 3:** Implement store and hooks. `useWebGL` creates a throwaway canvas and tests `webgl2`/`webgl`.
- [ ] **Step 4:** Run tests. Expected: PASS.
- [ ] **Step 5: Commit** `feat: experience store and pointer/capability hooks`.

### Task 4: 3D Nova (robot, scene, fallback)

**Files:** Create `src/components/nova/{NovaRobot.tsx,NovaScene.tsx,NovaFallback.tsx,Platform.tsx}`.

**Interfaces:** Consumes: `classifyPart`, `damp`, `lookTarget`, `EXPRESSIONS`, `nextBlinkDelay`, `blinkScale`, `usePointerRef`, `useExperience`, `useReducedMotion`, `useCoarsePointer`, `useWebGL`. Produces: `<NovaScene />` (fills its container; renders Canvas or `<NovaFallback />`), no props.

- [ ] **Step 1:** `NovaRobot`: `useGLTF('/models/nova_robot.glb')`; on load, clone the scene, flatten the 193 meshes, and place each under the group returned by `classifyPart`. Compute pivots from bounding boxes: head pivot = bottom-centre of the helmet box (neck); arm pivots = shoulder joint centres; eyes/mouth pivot = their own centre, so they can slide on the visor plane. Reparent with `attach()` so world transforms are preserved. Mark the cyan emissive material for glow control via `material.emissiveIntensity`.
- [ ] **Step 2:** `useFrame((_, delta) => …)` with `dt = Math.min(delta, 1/20)`. Each frame: (a) head yaw/pitch toward `lookTarget(pointer.x, pointer.y, 0.55, 0.3)` using `damp` lambda ~4 for head and ~10 for eyes (eyes lead, head lags); (b) eyes/mouth translate a few millimetres in the visor plane toward the pointer, independent of head; (c) body float `sin` bob and breathing scale; (d) blink via `blinkScale` on eyes' Y scale, scheduled by `nextBlinkDelay`, never touching eye translation; (e) expression eased from `EXPRESSIONS[mood]` (curious when pointer is near Nova, excited/happy from the store); (f) occasional wave of `armR`. When `active===false` or on coarse pointer, targets are zero (idle only; coarse pointer tap makes Nova briefly `happy`). When reduced motion: skip float, blink loop and wave.
- [ ] **Step 3:** `NovaScene`: transparent-background `<Canvas dpr={[1,1.75]} camera>` with ambient + key + cyan/violet rim lights, `<Platform />` (additive glow rings under Nova), `Suspense` fallback = loading shimmer, `ErrorBoundary` fallback = `NovaFallback` plus a visible "Nova couldn't load" note. `useWebGL()==='unsupported'` renders `NovaFallback` directly. Handle `webglcontextlost` by switching to the fallback.
- [ ] **Step 4:** `NovaFallback`: lightweight CSS/SVG Nova silhouette with cyan smiling face and a gentle CSS float (no tracking).
- [ ] **Step 5:** Run `npm run build` (or push and read Vercel logs). Expected: success with no type errors. Manual check on the preview: head turns, eyes move separately, blink continues while tracking.
- [ ] **Step 6: Commit** `feat: 3D Nova with head/eye tracking, blink, expressions and fallback`.

### Task 5: Landing layout and backdrop

**Files:** Create `src/components/landing/{Landing.tsx,GlassNav.tsx,Welcome.tsx,Backdrop.tsx,TerminalText.tsx}`; Modify `src/app/{page.tsx,layout.tsx,globals.css}`.

**Interfaces:** Consumes: `<NovaScene />`, `useExperience`. Produces: `<Landing />` composing layers (z-order: Backdrop, NovaScene, Orbit/Welcome/CTA, GlassNav) with slots for `OrbitNav` and `ExploreButton` (Tasks 6–7).

- [ ] **Step 1:** `Backdrop`: starfield (CSS or canvas, low count), planet-curve glow at the bottom (radial/conic gradients), a few glass shards and cubes placed like the reference (corners only, not scattered), midnight-navy gradient base.
- [ ] **Step 2:** `GlassNav`: floating rounded glass bar; left an SVG lightning-style mark (placeholder logo, flagged in README), right a theme toggle (`aria-pressed`) and menu button (`aria-label`, `aria-expanded`).
- [ ] **Step 3:** `Welcome`: headline "Hey there! I'm **Nova**." (light italic serif + gradient bold word), subline and microcopy verbatim; character-reveal under 1.2s total (skipped under reduced motion). `TerminalText`: three-line mono block bottom-left ("booting creativity…", "loading projects…", "ready to explore!"), hidden on small screens.
- [ ] **Step 4:** `layout.tsx` metadata: title, description, Open Graph, favicon; fonts via `next/font` (display serif italic + sans). `page.tsx` renders `<Landing />`. A "Skip intro" button is present from first paint (calls `explore()` stub and sets `entered`).
- [ ] **Step 5:** Build/preview check: layout matches the reference at 1672×941 and at 390px wide. **Commit** `feat: landing layout, backdrop, nav and welcome copy`.

### Task 6: Orbit navigation

**Files:** Create `src/components/landing/OrbitNav.tsx`; Modify `Landing.tsx`.

**Interfaces:** Consumes: `useExperience().openSection`, `SectionId`. Produces: `<OrbitNav />`; `ORBIT_ITEMS: { id: SectionId; label: string; icon: ReactNode; angle: number }[]` in the same file.

- [ ] **Step 1:** Render an SVG ellipse ring and five glass bubble `<button>`s positioned on it per the reference (Skills upper-left, Projects left, Blog top, FAQ upper-right, About right). Each has a distinct inline SVG icon, `aria-label="Open <Label>"`, neon outline, gentle float (CSS animation, staggered), hover scale + subtle magnetic pull (pointer offset clamped to 10px), visible focus ring.
- [ ] **Step 2:** Click calls `openSection(id)` (stub: sets `target`, logs nothing user-visible) with a quick press animation. Below 768px or coarse pointer in portrait: switch to a compact 5-item row/grid under the headline; recompute on resize/orientation change.
- [ ] **Step 3:** Preview check at desktop, 768px and 390px: no overlap with Nova, headline or CTA; Tab order Skills→Projects→Blog→FAQ→About. **Commit** `feat: orbital glass navigation with mobile layout`.

### Task 7: Explore CTA and Nova reactions

**Files:** Create `src/components/landing/ExploreButton.tsx`; Modify `Landing.tsx`.

**Interfaces:** Consumes: `useExperience().{hoverExplore, explore, phase}`. Produces: `<ExploreButton />`.

- [ ] **Step 1:** Glass pill "Click to Explore" with sparkle and arrow icons (matching the reference), glow increase on hover/focus, magnetic pull (≤8px), `hoverExplore(true/false)` on pointer/focus enter/leave. Click calls `explore()`, disables the button (`aria-disabled`) while `phase!=='idle'`, boosts ambient glow, and makes Nova `happy`. A completion stub resets after ~1.5s so the page isn't a dead end (the real transition arrives in a later phase).
- [ ] **Step 2:** Test (extend `tests/store/experience.test.ts`): two rapid `explore()` calls invoke the callback once. Run `npx vitest run`; expected PASS.
- [ ] **Step 3:** Preview check: hover → Nova excited; click → smile + glow, second click ignored. **Commit** `feat: Explore CTA with Nova reactions`.

### Task 8: SEO, accessibility, verification, docs

**Files:** Create `src/app/robots.ts`, `src/app/sitemap.ts`; Modify `README.md`, `src/app/layout.tsx`.

- [ ] **Step 1:** `robots.ts` allows all and points to the sitemap; `sitemap.ts` lists `/`. Landing content (headline, nav labels) is real DOM text, not canvas.
- [ ] **Step 2:** A11y pass: every interactive element has an accessible name; focus order logical; `prefers-reduced-motion` disables float/blink/wave/reveal; the canvas has `aria-hidden` plus an `sr-only` description of Nova.
- [ ] **Step 3:** Run `npx vitest run` and `npm run build` (or read the Vercel preview logs and runtime logs for console errors). Expected: tests pass, build succeeds, no runtime errors. Record what could not be verified (real-device touch, GPU performance) in the final report.
- [ ] **Step 4:** Update `README.md` with run/build instructions, the GLB part-grouping approach, and the placeholder-logo note. Open a PR from `feat/nova-landing` to `main`. **Commit** `docs: README, SEO files and verification notes`.
