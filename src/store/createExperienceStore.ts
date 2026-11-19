import type { Expression } from "../lib/nova/expressions.ts";

export type SectionId = "skills" | "projects" | "blog" | "faq" | "about";
export type Phase = "idle" | "reacting";

export interface ExperienceState {
  /** True once the visitor has left the landing (State B). */
  entered: boolean;
  phase: Phase;
  mood: Expression;
  /** Section the visitor asked to open from the orbit nav. */
  target: SectionId | null;
}

export interface ExperienceActions {
  hoverExplore(on: boolean): void;
  /** Starts the Explore reaction. Ignored unless the phase is idle. */
  explore(): void;
  openSection(id: SectionId): void;
  enter(): void;
  reset(): void;
}

export type ExperienceSnapshot = ExperienceState & ExperienceActions;

export interface ExperienceStore {
  getState(): ExperienceSnapshot;
  subscribe(listener: () => void): () => void;
}

const INITIAL: ExperienceState = {
  entered: false,
  phase: "idle",
  mood: "relaxed",
  target: null,
};

/** Framework-free store so the logic is testable without React. */
export function createExperienceStore(options: { onExplore?: () => void } = {}): ExperienceStore {
  let state: ExperienceState = { ...INITIAL };
  const listeners = new Set<() => void>();

  const set = (partial: Partial<ExperienceState>) => {
    const keys = Object.keys(partial) as (keyof ExperienceState)[];
    if (keys.every((k) => state[k] === partial[k])) return;
    state = { ...state, ...partial };
    snapshot = { ...state, ...actions };
    listeners.forEach((l) => l());
  };

  const actions: ExperienceActions = {
    hoverExplore(on) {
      if (state.phase === "reacting") return;
      set({ mood: on ? "excited" : "relaxed" });
    },
    explore() {
      if (state.phase !== "idle") return;
      set({ phase: "reacting", mood: "happy" });
      options.onExplore?.();
    },
    openSection(id) {
      set({ target: id });
    },
    enter() {
      set({ entered: true });
    },
    reset() {
      set({ ...INITIAL });
    },
  };

  let snapshot: ExperienceSnapshot = { ...state, ...actions };

  return {
    getState: () => snapshot,
    subscribe(listener) {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}
