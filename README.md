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

`public/models/nova_robot.glb` is 193 flat meshes (no skeleton), Z-up, face on −Y.
`src/components/nova/buildRig.ts` rotates it upright and groups the meshes by name
(`src/lib/nova/parts.ts`): **head**, **eyes**, **mouth** (children of the head), **armL / armR**, and the body.
Each group is pivoted at a measured joint position, so only the head group turns when tracking,
the eyes slide and blink independently, and the arms can sway or wave.
`NovaRobot.tsx` drives it each frame with damped motion, clamped angles and a clamped frame delta.
Touch devices skip cursor tracking and get idle animation plus tap reactions.
Without WebGL (or on very low-memory devices, or if the GLB fails / the GL context is lost)
a lightweight 2D Nova is shown instead.

## Notes

- The nav logo is a **placeholder** lightning mark — swap it in `GlassNav.tsx`.
- The menu button toggles `aria-expanded` but has no menu yet.
- Orbit buttons record the chosen section in the store; the sections arrive in a later phase.
