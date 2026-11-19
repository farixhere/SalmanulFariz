"use client";

import { Suspense, useCallback, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { NovaRobot } from "./NovaRobot";
import { Platform } from "./Platform";
import { NovaFallback } from "./NovaFallback";
import { NovaErrorBoundary } from "./NovaErrorBoundary";
import { useWebGL } from "@/hooks/useWebGL";
import { usePointerRef } from "@/hooks/usePointerRef";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

/**
 * Camera sees 4.3 world units of height at the origin. Nova is 3.5 tall, so at fit=1 she fills ~80% of the box,
 * with her feet near the bottom; on narrow boxes everything shrinks so the platform is never cut off.
 */
function Placement({ children }: { children: React.ReactNode }) {
  const width = useThree((s) => s.viewport.width);
  const fit = Math.min(1, Math.max(0.4, width / 8.2));
  return (
    <group scale={0.98 * fit} position={[0, -1.68, 0]}>
      {children}
    </group>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} color="#9fb4ff" />
      <directionalLight position={[3, 5, 6]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-4, 2, -2]} intensity={40} color="#22d3ff" distance={14} />
      <pointLight position={[4, 1.5, -2]} intensity={34} color="#8b5cf6" distance={14} />
      <pointLight position={[0, 2.2, 5]} intensity={14} color="#cfe0ff" distance={12} />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[0, 4, 3]} scale={[8, 3, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.4} position={[-5, 1, 1]} scale={[3, 6, 1]} color="#22d3ff" />
        <Lightformer form="rect" intensity={1.2} position={[5, 1, 1]} scale={[3, 6, 1]} color="#8b5cf6" />
      </Environment>
    </>
  );
}

export function NovaScene() {
  const status = useWebGL();
  const pointer = usePointerRef();
  const reducedMotion = useReducedMotion();
  const coarsePointer = useCoarsePointer();
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setFailed(true), []);

  if (status === "checking") {
    return <div className="nova-scene nova-loading" aria-hidden="true" />;
  }
  if (status === "unsupported" || status === "lite" || failed) {
    const note = failed
      ? "Nova couldn't load, but everything else works."
      : "Showing the lightweight Nova on this device.";
    return (
      <div className="nova-scene">
        <NovaFallback note={note} />
      </div>
    );
  }

  return (
    <div className="nova-scene">
      <p className="sr-only">
        Nova, a friendly 3D robot companion, floats above a glowing platform. It follows your cursor with its head and eyes.
      </p>
      {!ready && (
        <p className="nova-loading-label" role="status" aria-live="polite">
          Waking Nova…
        </p>
      )}
      <div aria-hidden="true" className="nova-canvas">
        <NovaErrorBoundary fallback={<NovaFallback note="Nova couldn't load, but everything else works." />} onError={onError}>
          <Canvas
            dpr={[1, 1.75]}
            camera={{ position: [0, 0.9, 7.5], fov: 32 }}
            gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener("webglcontextlost", (e) => {
                e.preventDefault();
                setFailed(true);
              });
            }}
          >
            <Suspense fallback={null}>
              <Lights />
              <Placement>
                <group scale={1.45}>
                  <Platform reducedMotion={reducedMotion} />
                </group>
                <NovaRobot
                  pointer={pointer}
                  reducedMotion={reducedMotion}
                  coarsePointer={coarsePointer}
                  onReady={onReady}
                />
              </Placement>
            </Suspense>
          </Canvas>
        </NovaErrorBoundary>
      </div>
    </div>
  );
}
