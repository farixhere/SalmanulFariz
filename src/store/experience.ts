"use client";

import { useSyncExternalStore } from "react";
import {
  createExperienceStore,
  type ExperienceSnapshot,
} from "./createExperienceStore";

export type { SectionId } from "./createExperienceStore";

export const experienceStore = createExperienceStore();

/**
 * Subscribe to the experience store. Select primitives (or the whole snapshot);
 * a selector that builds a new object every call would re-render forever.
 */
export function useExperience(): ExperienceSnapshot;
export function useExperience<T>(selector: (s: ExperienceSnapshot) => T): T;
export function useExperience<T>(selector?: (s: ExperienceSnapshot) => T) {
  const read = () => {
    const snap = experienceStore.getState();
    return selector ? selector(snap) : snap;
  };
  return useSyncExternalStore(experienceStore.subscribe, read, read);
}
