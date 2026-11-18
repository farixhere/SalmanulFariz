"use client";

import dynamic from "next/dynamic";
import { Backdrop } from "./Backdrop";
import { GlassNav } from "./GlassNav";
import { Welcome } from "./Welcome";
import { TerminalText } from "./TerminalText";
import { useExperience } from "@/store/experience";
import { experienceStore } from "@/store/experience";

// WebGL only exists in the browser, so the scene never renders on the server.
const NovaScene = dynamic(() => import("@/components/nova/NovaScene").then((m) => m.NovaScene), {
  ssr: false,
  loading: () => <div className="nova-scene nova-loading" aria-hidden="true" />,
});

export function Landing() {
  const entered = useExperience((s) => s.entered);

  if (entered) {
    return (
      <main className="landing">
        <Backdrop />
        <GlassNav />
        <section className="entered" aria-live="polite">
          <h1 className="welcome-title">
            <span className="grad">Nova</span> is getting the portfolio ready.
          </h1>
          <p className="welcome-tagline">The full portfolio arrives in the next phase.</p>
          <button type="button" className="skip-btn" onClick={() => experienceStore.getState().reset()}>
            Back to Nova
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="landing">
      <Backdrop />
      <button type="button" className="skip-btn skip-intro" onClick={() => experienceStore.getState().enter()}>
        Skip intro
      </button>
      <GlassNav />
      <section className="stage">
        <div className="stage-nova">
          <NovaScene />
          {/* Task 6: <OrbitNav /> mounts here, around Nova */}
        </div>
        <Welcome />
        {/* Task 7: <ExploreButton /> mounts here */}
      </section>
      <TerminalText />
      <div className="scroll-hint" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </main>
  );
}
