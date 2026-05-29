"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import {
  Stage,
  type RelationshipStatus,
  type FinalAnswer,
} from "@/_lib/stages";

interface StageContextValue {
  stage: Stage;
  name: string;
  status: RelationshipStatus;
  finalAnswer: FinalAnswer;
  statusAttempts: number;
  setStage: (stage: Stage) => void;
  setName: (name: string) => void;
  setStatus: (status: RelationshipStatus) => void;
  setFinalAnswer: (answer: FinalAnswer) => void;
  goToNext: () => void;
}

const StageContext = createContext<StageContextValue | null>(null);

function computeNextStage(
  current: Stage,
  status: RelationshipStatus,
  statusAttempts: number
): Stage {
  switch (current) {
    case Stage.EntryGate:
      return Stage.Hero;
    case Stage.Hero:
      return Stage.StatusQuestion;
    case Stage.StatusQuestion:
      if (status === "taken" && statusAttempts < 2) {
        return Stage.StatusQuestion;
      }
      return status === "taken" ? Stage.ExitGraceful : Stage.Reasons;
    case Stage.Reasons:
      return Stage.TheAsk;
    case Stage.TheAsk:
      return Stage.Closing;
    default:
      return Stage.Closing;
  }
}

export function StageProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<Stage>(Stage.EntryGate);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<RelationshipStatus>(null);
  const [finalAnswer, setFinalAnswer] = useState<FinalAnswer>(null);
  const [statusAttempts, setStatusAttempts] = useState(0);

  const stageRef = useRef(stage);
  const statusRef = useRef(status);
  const statusAttemptsRef = useRef(statusAttempts);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);
  useEffect(() => {
    statusAttemptsRef.current = statusAttempts;
  }, [statusAttempts]);

  const goToNext = useCallback(() => {
    const currentStage = stageRef.current;
    const currentStatus = statusRef.current;
    let attempts = statusAttemptsRef.current;

    if (currentStage === Stage.StatusQuestion && currentStatus === "taken") {
      attempts += 1;
      statusAttemptsRef.current = attempts;
      setStatusAttempts(attempts);
    }

    const next = computeNextStage(currentStage, currentStatus, attempts);
    setStage(next);
  }, []);

  return (
    <StageContext.Provider
      value={{
        stage,
        name,
        status,
        finalAnswer,
        statusAttempts,
        setStage,
        setName,
        setStatus,
        setFinalAnswer,
        goToNext,
      }}
    >
      {children}
    </StageContext.Provider>
  );
}

export function useStage() {
  const ctx = useContext(StageContext);
  if (!ctx) throw new Error("useStage must be used within StageProvider");
  return ctx;
}
