"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { Backdrop, Shards } from "./Backdrop";
import { GlassNav } from "./GlassNav";
import { Welcome } from "./Welcome";
import { TerminalText } from "./TerminalText";
import { ScrollHint } from "./ScrollHint";
import { OrbitNav } from "./OrbitNav";
import { ExploreButton } from "./ExploreButton";
import { Dissolve } from "./Dissolve";
import { PortfolioHome } from "./PortfolioHome";
import { useExperience, experienceStore } from "@/store/experience";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useCoarsePointer } from "@/hooks/useCoarsePointer";

// WebGL only exists in the browser, so the scene never renders on the server.
const NovaScene = dynamic(() => import("@/components/nova/NovaScene").then((m) => m.NovaScene), {
  ssr: false,
  loading: () => <div className="nova-scene nova-loading" aria-hidden="true" />,
});

const REACT_MS = 1000; // how long Nova reacts to the click before the dissolve starts
const REACT_MS_REDUCED = 400;

function lowMemory(): boolean {
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return memory !== undefined && memory <= 2;
}

export function Landing() {
  const entered = useExperience((s) => s.entered);
  const phase = useExperience((s) => s.phase);
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();

  // Entrance sequence: click -> Nova reacts -> dissolve -> State B. Leaving the phase cancels the timer.
  useEffect(() => {
    if (phase !== "reacting") return;
    const id = setTimeout(() => experienceStore.getState().beginTransition(), reduced ? REACT_MS_REDUCED : REACT_MS);
    return () => clearTimeout(id);
  }, [phase, reduced]);

  const dissolving = phase === "transitioning" && !entered;

  return (
    <main className={`landing${dissolving ? " is-dissolving" : ""}`}>
      <Backdrop />
      {!entered && (
        <button type="button" className="skip-intro" onClick={() => experienceStore.getState().skip()}>
          Skip intro
        </button>
      )}
      <div className="frame">
        <GlassNav />
        {entered ? (
          <PortfolioHome />
        ) : (
          <>
            <Shards />
            <OrbitNav />
            <div className="nova-box">
              <NovaScene />
            </div>
            <Welcome />
            <ExploreButton />
            <TerminalText />
            <ScrollHint />
          </>
        )}
      </div>
      {dissolving && (
        <Dissolve simple={reduced || lowMemory()} coarse={coarse} onDone={() => experienceStore.getState().enter()} />
      )}
    </main>
  );
}
