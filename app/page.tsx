"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "motion/react";
import { StageProvider, useStage } from "@/_components/stage-provider";
import { Stage } from "@/_lib/stages";
import { EntryGate } from "@/_components/stages/entry-gate";
import { Hero } from "@/_components/stages/hero";
import { QuestionStatus } from "@/_components/stages/question-status";
import { ExitGraceful } from "@/_components/stages/exit-graceful";
import { Reasons } from "@/_components/stages/reasons";
import { TheAsk } from "@/_components/stages/the-ask";
import { Closing } from "@/_components/stages/closing";
import { CursorTrail } from "@/_components/effects/cursor-trail";

function StageRenderer() {
  const { stage, name, statusAttempts } = useStage();
  const hasNotifiedEntry = useRef(false);

  useEffect(() => {
    if (name && !hasNotifiedEntry.current) {
      hasNotifiedEntry.current = true;
      fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          field: "entered",
          value: "entered",
        }),
      }).catch(() => {});
    }
  }, [name]);

  return (
    <>
      <CursorTrail />
      <AnimatePresence mode="wait">
        {stage === Stage.EntryGate && <EntryGate key="entry" />}
        {stage === Stage.Hero && <Hero key="hero" />}
        {stage === Stage.StatusQuestion && (
          <QuestionStatus key={`status-${statusAttempts}`} />
        )}
        {stage === Stage.ExitGraceful && <ExitGraceful key="exit" />}
        {stage === Stage.Reasons && <Reasons key="reasons" />}
        {stage === Stage.TheAsk && <TheAsk key="ask" />}
        {stage === Stage.Closing && <Closing key="closing" />}
      </AnimatePresence>
    </>
  );
}

export default function Home() {
  return (
    <StageProvider>
      <StageRenderer />
    </StageProvider>
  );
}
