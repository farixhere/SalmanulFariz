export type PartGroup = "head" | "eyes" | "mouth" | "armL" | "armR" | "body";

const HEAD_PREFIXES = ["Helmet", "Visor", "Black glass", "Ear "];
const ARM_PREFIXES = [
  "Shoulder joint",
  "Shoulder pauldron",
  "Shoulder light strip",
  "Upper arm",
  "Elbow",
  "Forearm",
  "Wrist",
  "Open palm",
  "Finger",
  "Thumb",
];

/**
 * Assigns one of the GLB's flat meshes to a rig group by its name.
 * In the model, the "-1" suffix is the viewer's left side (x < 0) and "1" the right (x > 0).
 */
export function classifyPart(name: string): PartGroup {
  if (name.startsWith("Cyan smiling eye")) return "eyes";
  if (name.startsWith("Happy curved mouth")) return "mouth";
  if (HEAD_PREFIXES.some((p) => name.startsWith(p))) return "head";
  if (ARM_PREFIXES.some((p) => name.startsWith(p))) {
    const side = name.match(/\s(-1|1)(?=[\s_]|$)/)?.[1];
    if (side === "-1") return "armL";
    if (side === "1") return "armR";
  }
  return "body";
}
