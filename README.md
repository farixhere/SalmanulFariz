# FARIZ
FARIZ is a philosophy of fearless thinking, self-awareness, and continuous discovery. Reflective in thought, inquisitive by nature, and zealous in the pursuit of truth — always questioning, learning, and seeking meaning beyond the obvious.

---

# Project NOVA — landing page (State A)

The landing screen of Faris's portfolio: a floating glass nav, an orbit of five glass bubbles
(Skills, Projects, Blog, FAQ, About), a real 3D **Nova** robot that follows your cursor, a "Welcome to my Portfolio" headline and a
"Click to Explore" button. The particle transition and the portfolio sections come in later phases;
for now Skip intro / Explore lead to a small placeholder.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (also type-checks)
npm test         # node:test unit tests for the pure logic and the store
```

Node 22.x. Set `NEXT_PUBLIC_SITE_URL` to the real domain for the sitemap / robots / Open Graph URLs.

## How Nova works

Nova is built in code (`src/components/nova/buildRig.ts`) from plain three.js shapes: a big rounded helmet with a black
visor and glowing smile-arc eyes, headphone pods, a small body with a bolt badge, open arms and stubby legs.
There is no model file to load. `reference/nova_robot.glb` is the original model Faris supplied; it is kept for
reference only and is not used.
The head, eyes, mouth and both arms are separate groups, so only the head turns when tracking, the eyes slide and
blink on their own, and the arms can sway or wave. `NovaRobot.tsx` drives them every frame with damped motion,
clamped angles and a clamped frame delta. Touch devices skip cursor tracking and get idle animation plus tap reactions.
Without WebGL (or on very low-memory devices, or if the GL context is lost) a lightweight 2D Nova is shown instead.

## Notes

- The nav logo is a **placeholder** lightning mark — swap it in `GlassNav.tsx`.
- The menu button toggles `aria-expanded` but has no menu yet.
- Orbit buttons record the chosen section in the store; the sections arrive in a later phase.
