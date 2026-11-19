import * as THREE from "three";

/** Emissive strength of the cyan face/accent glow at rest; the animation scales it per expression. */
export const GLOW_BASE = 1.6;

/** Arm angle (radians about Z) that holds the arms open and slightly down, like the reference art. */
export const ARM_OPEN = 1.35;

export interface NovaRig {
  /** Y-up, facing +Z (toward the camera), feet at y=0, about 3.4 units tall. */
  root: THREE.Group;
  /** Pivots at the neck. Yaw = rotation.y, pitch = rotation.x, roll = rotation.z. */
  head: THREE.Group;
  /** Both smiling-arc eyes; ride on the head. Slide with position, blink with scale.y. */
  eyes: THREE.Group;
  mouth: THREE.Group;
  /** Shoulder pivots. armL is on the viewer's left (x < 0). Rotation about Z swings the arm. */
  armL: THREE.Group;
  armR: THREE.Group;
  /** Rest positions of the groups (parent space), for additive offsets. */
  rest: { head: THREE.Vector3; eyes: THREE.Vector3; mouth: THREE.Vector3 };
  glow: THREE.MeshStandardMaterial[];
  dispose(): void;
}

/**
 * Builds Nova procedurally: a chibi astronaut robot with a huge rounded helmet, black visor with glowing
 * smile-arc eyes, headphone pods, a small body with a bolt badge, open arms and stubby legs.
 * Everything is plain three.js primitives, so there is no model file to load.
 */
export function buildRig(): NovaRig {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const mat = (m: THREE.MeshStandardMaterial) => {
    materials.push(m);
    return m;
  };
  const shell = mat(new THREE.MeshStandardMaterial({ color: "#f2f4ff", roughness: 0.32, metalness: 0.08 }));
  const shade = mat(new THREE.MeshStandardMaterial({ color: "#aab4ec", roughness: 0.4, metalness: 0.15 }));
  const dark = mat(new THREE.MeshStandardMaterial({ color: "#151a42", roughness: 0.45, metalness: 0.4 }));
  const visor = mat(new THREE.MeshStandardMaterial({ color: "#03040e", roughness: 0.08, metalness: 0.7 }));
  const rim = mat(new THREE.MeshStandardMaterial({ color: "#c9d1ff", roughness: 0.25, metalness: 0.3 }));
  const glowMat = () =>
    mat(
      new THREE.MeshStandardMaterial({
        color: "#22d3ff",
        emissive: new THREE.Color("#22d3ff"),
        emissiveIntensity: GLOW_BASE,
        toneMapped: false,
        roughness: 0.4,
      }),
    );
  const glow = glowMat();

  const add = (parent: THREE.Object3D, geo: THREE.BufferGeometry, m: THREE.Material, x = 0, y = 0, z = 0) => {
    geometries.push(geo);
    const mesh = new THREE.Mesh(geo, m);
    mesh.position.set(x, y, z);
    parent.add(mesh);
    return mesh;
  };
  const ellipsoid = (parent: THREE.Object3D, m: THREE.Material, rx: number, ry: number, rz: number, x = 0, y = 0, z = 0) => {
    const mesh = add(parent, new THREE.SphereGeometry(1, 48, 32), m, x, y, z);
    mesh.scale.set(rx, ry, rz);
    return mesh;
  };

  const root = new THREE.Group();

  // ---- Body ----
  ellipsoid(root, shell, 0.74, 0.7, 0.62, 0, 0.98, 0); // torso
  ellipsoid(root, shade, 0.6, 0.2, 0.52, 0, 0.44, 0.02); // hips
  const belt = add(root, new THREE.TorusGeometry(0.58, 0.045, 12, 48), dark, 0, 0.66, 0);
  belt.rotation.x = Math.PI / 2;
  belt.scale.set(1.08, 0.95, 1);
  // chest badge with a glowing bolt
  add(root, new THREE.BoxGeometry(0.5, 0.42, 0.1), dark, 0, 1.0, 0.58);
  const bolt = new THREE.Shape();
  [[0.09, 0.2], [-0.1, -0.02], [0, -0.02], [-0.07, -0.2], [0.12, 0.04], [0.02, 0.04]].forEach(([x, y], i) =>
    i === 0 ? bolt.moveTo(x, y) : bolt.lineTo(x, y),
  );
  add(root, new THREE.ShapeGeometry(bolt), glow, 0, 1.0, 0.64);
  // legs and feet
  for (const side of [-1, 1]) {
    add(root, new THREE.CapsuleGeometry(0.17, 0.16, 8, 16), shade, side * 0.28, 0.3, 0);
    ellipsoid(root, shell, 0.27, 0.14, 0.37, side * 0.28, 0.12, 0.1);
  }

  // ---- Arms (pivot at the shoulder; hang along -Y, then swing out about Z) ----
  const makeArm = (side: -1 | 1) => {
    const arm = new THREE.Group();
    arm.position.set(side * 0.72, 1.3, 0);
    ellipsoid(arm, shade, 0.2, 0.2, 0.2); // shoulder ball
    add(arm, new THREE.CapsuleGeometry(0.16, 0.55, 8, 16), shell, 0, -0.5, 0);
    const cuff = add(arm, new THREE.TorusGeometry(0.19, 0.05, 12, 32), dark, 0, -0.88, 0);
    cuff.rotation.x = Math.PI / 2;
    const cuffGlow = add(arm, new THREE.TorusGeometry(0.19, 0.022, 10, 32), glow, 0, -0.93, 0);
    cuffGlow.rotation.x = Math.PI / 2;
    ellipsoid(arm, shell, 0.21, 0.27, 0.12, 0, -1.18, 0); // open palm
    ellipsoid(arm, shell, 0.09, 0.15, 0.09, side * -0.2, -1.1, 0.04); // thumb
    root.add(arm);
    return arm;
  };
  const armL = makeArm(-1);
  const armR = makeArm(1);
  armL.rotation.z = -ARM_OPEN;
  armR.rotation.z = ARM_OPEN;

  // ---- Head ----
  const head = new THREE.Group();
  head.position.set(0, 1.5, 0);
  root.add(head);
  ellipsoid(head, shell, 1.2, 0.98, 1.05, 0, 0.9, 0); // helmet
  ellipsoid(head, rim, 1.0, 0.77, 0.52, 0, 0.9, 0.57); // visor rim
  ellipsoid(head, visor, 0.95, 0.72, 0.55, 0, 0.9, 0.6); // visor glass
  // headphone pods
  for (const side of [-1, 1]) {
    ellipsoid(head, shade, 0.22, 0.52, 0.46, side * 1.2, 0.9, -0.05);
    const ring = add(head, new THREE.TorusGeometry(0.3, 0.04, 12, 40), glow, side * 1.34, 0.9, -0.05);
    ring.rotation.y = Math.PI / 2;
  }

  // smiling-arc eyes (∩) and mouth (∪), slightly in front of the visor glass
  const eyes = new THREE.Group();
  const eyesRest = new THREE.Vector3(0, 0.96, 1.13);
  eyes.position.copy(eyesRest);
  for (const side of [-1, 1]) add(eyes, new THREE.TorusGeometry(0.17, 0.05, 12, 32, Math.PI), glow, side * 0.38, -0.08, 0);
  head.add(eyes);

  const mouth = new THREE.Group();
  const mouthRest = new THREE.Vector3(0, 0.8, 1.135);
  mouth.position.copy(mouthRest);
  const smile = add(mouth, new THREE.TorusGeometry(0.12, 0.034, 10, 24, Math.PI), glow, 0, 0.06, 0);
  smile.rotation.z = Math.PI;
  head.add(mouth);

  return {
    root,
    head,
    eyes,
    mouth,
    armL,
    armR,
    rest: { head: head.position.clone(), eyes: eyesRest.clone(), mouth: mouthRest.clone() },
    glow: [glow],
    dispose() {
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
    },
  };
}
