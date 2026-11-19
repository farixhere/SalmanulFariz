"use client";

import dynamic from "next/dynamic";
import { Backdrop, Shards } from "./Backdrop";
import { GlassNav } from "./GlassNav";
import { Welcome } from "./Welcome";
import { TerminalText } from "./TerminalText";
import { ScrollHint } from "./ScrollHint";
import { OrbitNav } from "./OrbitNav";
import { ExploreButton } from "./ExploreButton";
import { useExperience, experienceStore } from "@/store/experience";

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
        <div className="frame">
          <GlassNav />
          <section className="entered" aria-live="polite">
            <h1 className="welcome-title">
              <span className="grad">Nova</span> is getting the portfolio ready.
            </h1>
            <p className="entered-sub">The full portfolio arrives in the next phase.</p>
            <button type="button" className="back-btn" onClick={() => experienceStore.getState().reset()}>
              Back to the start
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="landing">
      <Backdrop />
      <button type="button" className="skip-intro" onClick={() => experienceStore.getState().enter()}>
        Skip intro
      </button>
      <div className="frame">
        <Shards />
        <GlassNav />
        <OrbitNav />
        <div className="nova-box">
          <NovaScene />
        </div>
        <Welcome />
        <ExploreButton />
        <TerminalText />
        <ScrollHint />
      </div>
    </main>
  );
}
