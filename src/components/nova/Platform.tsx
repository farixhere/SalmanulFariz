"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 260;

function glowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(90,130,255,0.55)");
  g.addColorStop(0.45, "rgba(60,90,255,0.22)");
  g.addColorStop(1, "rgba(30,40,160,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const additive = {
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  toneMapped: false,
  side: THREE.DoubleSide,
} as const;

/** The soft glowing platform under Nova: radial glow, three thin rings and drifting particles. */
export function Platform({ reducedMotion }: { reducedMotion: boolean }) {
  const texture = useMemo(glowTexture, []);
  useEffect(() => () => texture.dispose(), [texture]);

  const particles = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 1.5;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.35 + Math.sin(angle * 2) * 0.12;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, []);
  useEffect(() => () => particles.dispose(), [particles]);

  const spin = useRef<THREE.Points>(null);
  useFrame((_, delta) => {
    if (reducedMotion || !spin.current) return;
    spin.current.rotation.y += Math.min(delta, 0.05) * 0.12;
  });

  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={0.005}>
        <planeGeometry args={[7.5, 7.5]} />
        <meshBasicMaterial map={texture} {...additive} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01}>
        <ringGeometry args={[1.55, 1.6, 96]} />
        <meshBasicMaterial color="#4f7dff" opacity={0.7} {...additive} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.012}>
        <ringGeometry args={[2.0, 2.05, 96]} />
        <meshBasicMaterial color="#22d3ff" opacity={0.9} {...additive} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.014}>
        <ringGeometry args={[2.45, 2.48, 96]} />
        <meshBasicMaterial color="#8b5cf6" opacity={0.55} {...additive} />
      </mesh>
      <points ref={spin} geometry={particles}>
        <pointsMaterial color="#8fd8ff" size={0.035} opacity={0.85} sizeAttenuation {...additive} />
      </points>
    </group>
  );
}
