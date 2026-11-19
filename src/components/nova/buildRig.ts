import * as THREE from "three";
import { classifyPart, type PartGroup } from "@/lib/nova/parts";

type Vec3 = readonly [number, number, number];
type RigGroup = Exclude<PartGroup, "body">;

/**
 * Absolute pivot of each rig group in the GLB's own Z-up space (measured from the model:
 * neck top, centre of the eye/mouth arcs on the visor, shoulder joints).
 */
export const PIVOTS: Record<RigGroup, Vec3> = {
  head: [0, 0, 2.15],
  eyes: [0, -0.662, 2.882],
  mouth: [0, -0.666, 2.63],
  armL: [-0.57, 0, 1.9],
  armR: [0.57, 0, 1.9],
};

/** Eyes and mouth ride on the head; everything else hangs off the model root. */
const PARENT: Record<RigGroup, RigGroup | null> = {
  head: null,
  eyes: "head",
  mouth: "head",
  armL: null,
  armR: null,
};

export const GLOW_BASE = 1.6;
export const HEAD_SCALE = 1.25;
const GLOW_MATERIAL_NAME = "Electric cyan glow";

export interface NovaRig {
  /** Y-up, facing +Z (toward the camera), feet at the origin, 3.5 units tall. */
  root: THREE.Group;
  head: THREE.Group;
  eyes: THREE.Group;
  mouth: THREE.Group;
  armL: THREE.Group;
  armR: THREE.Group;
  /** Local rest positions of the groups (parent space), for additive offsets. */
  rest: Record<RigGroup, THREE.Vector3>;
  glow: THREE.MeshStandardMaterial[];
  dispose(): void;
}

export function buildRig(source: THREE.Object3D): NovaRig {
  const meshes: THREE.Mesh[] = [];
  source.traverse((o) => {
    if ((o as THREE.Mesh).isMesh) meshes.push(o as THREE.Mesh);
  });

  // The model is Z-up with its face on -Y; rotate so it is Y-up and faces +Z.
  const model = new THREE.Group();
  model.rotation.x = -Math.PI / 2;
  const root = new THREE.Group();
  root.add(model);

  const groups = {} as Record<RigGroup, THREE.Group>;
  const rest = {} as Record<RigGroup, THREE.Vector3>;
  (Object.keys(PIVOTS) as RigGroup[]).forEach((key) => {
    const g = new THREE.Group();
    g.name = `nova-${key}`;
    const parentKey = PARENT[key];
    const abs = PIVOTS[key];
    const parentAbs = parentKey ? PIVOTS[parentKey] : ([0, 0, 0] as const);
    g.position.set(abs[0] - parentAbs[0], abs[1] - parentAbs[1], abs[2] - parentAbs[2]);
    rest[key] = g.position.clone();
    groups[key] = g;
  });
  (Object.keys(PIVOTS) as RigGroup[]).forEach((key) => {
    const parentKey = PARENT[key];
    (parentKey ? groups[parentKey] : model).add(groups[key]);
  });
  groups.head.rotation.order = "ZXY"; // yaw outermost, like a real neck
  groups.head.scale.setScalar(HEAD_SCALE); // a slightly bigger head reads cuter, closer to the reference art

  const cloned = new Map<THREE.Material, THREE.MeshStandardMaterial>();
  const glow: THREE.MeshStandardMaterial[] = [];
  const materialFor = (src: THREE.Material) => {
    let m = cloned.get(src);
    if (m) return m;
    m = (src as THREE.MeshStandardMaterial).clone();
    m.flatShading = false; // the GLB has no normals; we compute smooth ones below
    m.metalness = Math.min(m.metalness, 0.6);
    if (m.name === GLOW_MATERIAL_NAME) {
      m.toneMapped = false;
      m.emissiveIntensity = GLOW_BASE;
      glow.push(m);
    }
    m.needsUpdate = true;
    cloned.set(src, m);
    return m;
  };

  for (const mesh of meshes) {
    const geometry = mesh.geometry as THREE.BufferGeometry;
    if (!geometry.getAttribute("normal")) geometry.computeVertexNormals();
    const original = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.Material;
    const part = mesh.clone(false);
    part.material = materialFor(original);

    const key = classifyPart(mesh.name);
    if (key === "body") {
      model.add(part);
    } else {
      const abs = PIVOTS[key];
      part.position.set(-abs[0], -abs[1], -abs[2]); // vertices are in model space; offset by the pivot
      groups[key].add(part);
    }
  }

  return {
    root,
    head: groups.head,
    eyes: groups.eyes,
    mouth: groups.mouth,
    armL: groups.armL,
    armR: groups.armR,
    rest,
    glow,
    dispose() {
      cloned.forEach((m) => m.dispose());
    },
  };
}
