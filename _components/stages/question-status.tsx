"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";
import type { RelationshipStatus } from "@/_lib/stages";

export function QuestionStatus() {
  const { name, statusAttempts, setStatus, goToNext } = useStage();
  const [selected, setSelected] = useState<RelationshipStatus>(null);
  const [isExiting, setIsExiting] = useState(false);

  const isSecondAttempt = statusAttempts >= 1;

  const handleSelect = async (value: RelationshipStatus) => {
    setSelected(value);
    setStatus(value);

    try {
      await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          field: isSecondAttempt ? "status-retry" : "status",
          value,
        }),
      });
    } catch {
      // silent fail
    }

    setIsExiting(true);
    setTimeout(() => goToNext(), 600);
  };

  const attempt1 = {
    question: "Are you seeing someone right now?",
    options: [
      {
        label: "Yes, I'm with someone",
        sublabel: "and I'm happy",
        value: "taken" as RelationshipStatus,
      },
      {
        label: "No, I'm not",
        sublabel: "not right now",
        value: "single" as RelationshipStatus,
      },
    ],
  };

  const attempt2 = {
    question: "Are you really sure about that?",
    options: [
      {
        label: "Yeah, I really am",
        sublabel: "I'm sorry",
        value: "taken" as RelationshipStatus,
      },
      {
        label: "Actually... no",
        sublabel: "maybe I'm free",
        value: "single" as RelationshipStatus,
      },
    ],
  };

  const current = isSecondAttempt ? attempt2 : attempt1;

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          key={isSecondAttempt ? "retry" : "first"}
          className="fixed inset-0 flex flex-col items-center justify-center bg-cream px-6"
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.6 }}
        >
          <AmbientBg variant="light" />

          <div className="flex flex-col items-center gap-10 max-w-md w-full">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-muted-foreground text-sm tracking-wide mb-4">
                {isSecondAttempt
                  ? `I just had to ask ${name}...`
                  : `Before I go on, ${name}...`}
              </p>
              <h2 className="text-3xl md:text-4xl font-heading text-deep-cocoa leading-snug">
                {current.question}
              </h2>
            </motion.div>

            <motion.div
              className="flex flex-col gap-4 w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {current.options.map((opt, i) => (
                <motion.button
                  key={`${isSecondAttempt}-${opt.value}`}
                  onClick={() => handleSelect(opt.value)}
                  disabled={selected !== null}
                  className={`group relative w-full py-5 px-6 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer
                    ${
                      selected === opt.value
                        ? "border-dusty-rose bg-dusty-rose/10"
                        : "border-cream-surface bg-white hover:border-dusty-rose/40 hover:bg-dusty-rose/5"
                    }
                    ${
                      selected && selected !== opt.value
                        ? "opacity-30 scale-95"
                        : ""
                    }
                  `}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.7 + i * 0.15,
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-lg font-heading text-deep-cocoa block">
                    {opt.label}
                  </span>
                  <span className="text-sm text-muted-foreground italic">
                    {opt.sublabel}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
