"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";
import { WordReveal } from "@/_components/effects/word-reveal";
import type { FinalAnswer } from "@/_lib/stages";

export function TheAsk() {
  const { name, setFinalAnswer, goToNext } = useStage();
  const [selected, setSelected] = useState<FinalAnswer>(null);
  const [isExiting, setIsExiting] = useState(false);
  const handleSelect = async (answer: FinalAnswer) => {
    setSelected(answer);
    setFinalAnswer(answer);

    try {
      await fetch("/api/response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          field: "finalAnswer",
          value: answer,
        }),
      });
    } catch {
      // silent fail
    }

    setIsExiting(true);
    setTimeout(() => goToNext(), 800);
  };

  const options: { label: string; value: FinalAnswer }[] = [
    { label: "Yes", value: "yes" },
    { label: "I need to think about it", value: "thinking" },
    { label: "I'm sorry, I can't", value: "no" },
  ];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-cream px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.0 }}
    >
      <AmbientBg variant="light" />

      <div className="flex flex-col items-center gap-8 max-w-lg w-full">
        <WordReveal
          text={`So... ${name},`}
          as="h1"
          className="text-4xl md:text-6xl font-heading text-deep-cocoa text-center"
          delay={0.3}
          staggerDelay={0.08}
        />

        <motion.p
          className="text-xl md:text-2xl font-heading italic text-deep-cocoa/80 text-center leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          ...would you let me try to be the reason you smile every day?
        </motion.p>

        <AnimatePresence>
          {!isExiting && (
            <motion.div
              className="flex flex-col gap-3 w-full mt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.0, duration: 0.6 }}
            >
              {options.map((opt, i) => (
                <motion.button
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  disabled={selected !== null}
                  className={`w-full py-4 px-6 rounded-2xl border-2 text-center font-heading text-lg transition-all duration-300 cursor-pointer
                    ${
                      selected === opt.value
                        ? opt.value === "yes"
                          ? "border-dusty-rose bg-dusty-rose text-cream"
                          : "border-dusty-rose bg-dusty-rose/10 text-deep-cocoa"
                        : "border-cream-surface bg-white text-deep-cocoa hover:border-dusty-rose/40 hover:bg-dusty-rose/5"
                    }
                    ${selected && selected !== opt.value ? "opacity-30 scale-95" : ""}
                  `}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 3.2 + i * 0.15,
                    type: "spring",
                    stiffness: 200,
                    damping: 18,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {opt.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
