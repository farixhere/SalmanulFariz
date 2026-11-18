"use client";

import { useMediaQuery } from "./useMediaQuery";

/** True on touch-first devices, where cursor tracking is replaced by idle animation. */
export function useCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse), (hover: none)");
}
