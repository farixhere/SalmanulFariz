"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { ARM_OPEN, buildRig, GLOW_BASE } from "./buildRig";
import { blinkScale, nextBlinkDelay } from "@/lib/nova/blink";
import { EXPRESSIONS, type Expression } from "@/lib/nova/expressions";
import { clamp, damp, lookTarget } from "@/lib/nova/motion";
import { isNear, NOVA_CENTER, NOVA_NEAR_RADIUS, toNdc } from "@/lib/nova/pointer";
import type { PointerState } from "@/hooks/usePointerRef";
import { experienceStore } from "@/store/experience";

const MAX_YAW = 0.55;
const MAX_PITCH = 0.3;
const EYE_SLIDE_X = 0.11;
const EYE_SLIDE_Y = 0.07;
const ARM_LIFT: Record<Expression, number> = { relaxed: 0, curious: 0.08, excited: 0.28, happy: 0.22 };

interface Props {
  pointer: MutableRefObject<PointerState>;
  reducedMotion: boolean;
  coarsePointer: boolean;
  onReady?: () => void;
}

export function NovaRobot({ pointer, reducedMotion, coarsePointer, onReady }: Props) {
  const rig = useMemo(() => buildRig(), []);
  const floatRef = useRef<THREE.Group>(null);

  // Mutable animation state lives in a ref so nothing re-renders per frame.
  const s = useRef({
    t: 0,
    yaw: 0,
    pitch: 0,
    headTilt: 0,
    eyeX: 0,
    eyeY: 0,
    eyeScaleY: 1,
    eyeTilt: 0,
    glow: 1,
    lift: 0,
    blinkAt: -1,
    nextBlink: 2.5,
    waveAt: -1,
    nextWave: 5,
    tapUntil: -1,
  });

  useEffect(() => () => rig.dispose(), [rig]);
  useEffect(() => onReady?.(), [onReady]);

  // A tap or click on Nova makes her smile for a moment (the touch-friendly reaction).
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const { x, y } = toNdc(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
      if (isNear(x, y, NOVA_CENTER.x, NOVA_CENTER.y, NOVA_NEAR_RADIUS)) {
        s.current.tapUntil = s.current.t + 1.2;
      }
    };
    window.addEventListener("pointerdown", onDown, { passive: true });
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  useFrame((_, delta) => {
    const st = s.current;
    // A hidden tab can resume with a huge delta; never let it snap the animation.
    const dt = Math.min(delta, 1 / 20);
    st.t += dt;
    const t = st.t;
    const motion = reducedMotion ? 0 : 1;
    const p = pointer.current;
    const tracking = !coarsePointer && p.active;

    // --- Mood: store (hover/click) wins, then a tap, then "cursor is near" ---
    const storeMood = experienceStore.getState().mood;
    const mood: Expression =
      storeMood !== "relaxed"
        ? storeMood
        : t < st.tapUntil
          ? "happy"
          : tracking && p.nearNova
            ? "curious"
            : "relaxed";
    const expr = EXPRESSIONS[mood];

    // --- Head: slow, clamped, returns to a gentle idle drift when the pointer is gone ---
    const look = tracking
      ? lookTarget(p.x, p.y, MAX_YAW, MAX_PITCH)
      : { yaw: 0.05 * Math.sin(t * 0.6) * motion, pitch: 0.025 * Math.sin(t * 0.45) * motion };
    st.yaw = damp(st.yaw, look.yaw, 4, dt);
    st.pitch = damp(st.pitch, look.pitch, 4, dt);
    st.headTilt = damp(st.headTilt, expr.headTilt, 5, dt);

    // --- Eyes: independent of the head, and faster, so they lead it ---
    const eyeTargetX = tracking ? clamp(p.x, -1, 1) * EYE_SLIDE_X : 0;
    const eyeTargetY = tracking ? clamp(p.y, -1, 1) * EYE_SLIDE_Y : 0;
    st.eyeX = damp(st.eyeX, eyeTargetX, 12, dt);
    st.eyeY = damp(st.eyeY, eyeTargetY, 12, dt);
    st.eyeScaleY = damp(st.eyeScaleY, expr.eyeScaleY, 8, dt);
    st.eyeTilt = damp(st.eyeTilt, expr.eyeTilt, 8, dt);
    st.glow = damp(st.glow, expr.eyeGlow, 6, dt);

    // --- Blinking runs on its own clock and only scales the eyes, so tracking is untouched ---
    if (motion) {
      if (st.blinkAt < 0 && t >= st.nextBlink) st.blinkAt = t;
      if (st.blinkAt >= 0 && t - st.blinkAt > 0.16) {
        st.blinkAt = -1;
        st.nextBlink = t + nextBlinkDelay(Math.random);
      }
    }
    const blink = st.blinkAt >= 0 ? blinkScale(t - st.blinkAt) : 1;

    // --- Apply (Y-up scene: yaw about Y, pitch about X, roll about Z; positive pitch looks up) ---
    const { head, eyes, mouth, armL, armR, rest } = rig;
    head.rotation.y = st.yaw;
    head.rotation.x = -st.pitch;
    head.rotation.z = st.headTilt;
    head.position.y = rest.head.y + 0.012 * Math.sin(t * 1.7) * motion; // breathing

    eyes.position.x = rest.eyes.x + st.eyeX;
    eyes.position.y = rest.eyes.y + st.eyeY;
    eyes.scale.y = blink * st.eyeScaleY;
    eyes.rotation.z = st.eyeTilt;
    mouth.position.x = rest.mouth.x + st.eyeX * 0.3;
    mouth.position.y = rest.mouth.y + st.eyeY * 0.3;

    // --- Arms: held open, sway gently, lift when happy/excited, occasional wave from the right arm ---
    st.lift = damp(st.lift, ARM_LIFT[mood], 6, dt);
    const sway = 0.035 * Math.sin(t * 1.3) * motion;
    if (motion && mood === "relaxed" && st.waveAt < 0 && t >= st.nextWave) st.waveAt = t;
    let wave = 0;
    if (st.waveAt >= 0) {
      const phase = (t - st.waveAt) / 2.4;
      if (phase >= 1) {
        st.waveAt = -1;
        st.nextWave = t + 7 + Math.random() * 7;
      } else {
        wave = Math.sin(Math.PI * phase) * (0.7 + 0.2 * Math.sin(phase * 31));
      }
    }
    armL.rotation.z = -(ARM_OPEN + st.lift + sway); // negative swings the viewer's-left arm outward/up
    armR.rotation.z = ARM_OPEN + st.lift + sway * 0.8 + wave;

    // --- Float and glow ---
    const bounce = mood === "excited" ? 0.05 * Math.abs(Math.sin(t * 6)) : 0;
    if (floatRef.current) floatRef.current.position.y = (0.05 * Math.sin(t * 1.1) + bounce) * motion;
    for (const m of rig.glow) m.emissiveIntensity = GLOW_BASE * st.glow;
  });

  return (
    <group ref={floatRef}>
      <primitive object={rig.root} />
    </group>
  );
}
