"use client";

import { useEffect, useState } from "react";

/**
 * - checking: not probed yet (server render / first paint)
 * - ok: WebGL works and the device can take the full 3D scene
 * - lite: WebGL works but the device reports very little memory, so use the 2D Nova
 * - unsupported: no WebGL
 */
export type WebGLStatus = "checking" | "ok" | "lite" | "unsupported";

export function useWebGL(): WebGLStatus {
  const [status, setStatus] = useState<WebGLStatus>("checking");

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
      if (!gl) return setStatus("unsupported");
      const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
      setStatus(memory !== undefined && memory <= 2 ? "lite" : "ok");
    } catch {
      setStatus("unsupported");
    }
  }, []);

  return status;
}
