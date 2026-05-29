export enum Stage {
  EntryGate = "entry-gate",
  Hero = "hero",
  StatusQuestion = "status-question",
  ExitGraceful = "exit-graceful",
  Reasons = "reasons",
  TheAsk = "the-ask",
  Closing = "closing",
}

export type RelationshipStatus = "single" | "taken" | null;

export type FinalAnswer = "yes" | "thinking" | "no" | null;

export interface StageData {
  name: string;
  status: RelationshipStatus;
  finalAnswer: FinalAnswer;
  timestamp: string;
}

export const STAGE_ORDER: Stage[] = [
  Stage.EntryGate,
  Stage.Hero,
  Stage.StatusQuestion,
  // ExitGraceful or Reasons determined at runtime
  Stage.TheAsk,
  Stage.Closing,
];

export function getNextStage(current: Stage, status: RelationshipStatus): Stage {
  switch (current) {
    case Stage.EntryGate:
      return Stage.Hero;
    case Stage.Hero:
      return Stage.StatusQuestion;
    case Stage.StatusQuestion:
      return status === "taken" ? Stage.ExitGraceful : Stage.Reasons;
    case Stage.Reasons:
      return Stage.TheAsk;
    case Stage.TheAsk:
      return Stage.Closing;
    default:
      return Stage.Closing;
  }
}
