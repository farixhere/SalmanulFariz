"use client";

import { useEffect, useState } from "react";

export type WebGLStatus = "checking" | "ok" | "unsupported";

export function useWebGL(): WebGLStatus {
  const [status, setStatus] = useState<WebGLStatus>("checking");

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
      setStatus(gl ? "ok" : "unsupported");
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      setStatus("unsupported");
    }
  }, []);

  return status;
}
