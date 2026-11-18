"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { isNear, NOVA_CENTER, NOVA_NEAR_RADIUS, toNdc } from "@/lib/nova/pointer";

export interface PointerState {
  /** Pointer position in NDC (-1..1, y up). */
  x: number;
  y: number;
  /** False until a mouse/pen moves, after it leaves the window, and for touch input. */
  active: boolean;
  nearNova: boolean;
}

/**
 * Tracks the pointer into a ref so mouse movement never triggers a React re-render;
 * the 3D scene reads the ref inside `useFrame`.
 */
export function usePointerRef(): MutableRefObject<PointerState> {
  const ref = useRef<PointerState>({ x: 0, y: 0, active: false, nearNova: false });

  useEffect(() => {
    const state = ref.current;

    const neutral = () => {
      state.active = false;
      state.nearNova = false;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return neutral();
      const { x, y } = toNdc(e.clientX, e.clientY, window.innerWidth, window.innerHeight);
      state.x = x;
      state.y = y;
      state.active = true;
      state.nearNova = isNear(x, y, NOVA_CENTER.x, NOVA_CENTER.y, NOVA_NEAR_RADIUS);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", neutral);
    window.addEventListener("blur", neutral);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", neutral);
      window.removeEventListener("blur", neutral);
    };
  }, []);

  return ref;
}
