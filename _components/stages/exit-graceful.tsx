"use client";

import { motion } from "motion/react";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";
import { WordReveal } from "@/_components/effects/word-reveal";

export function ExitGraceful() {
  const { name } = useStage();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-night-plum px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <AmbientBg variant="dark" />

      <div className="flex flex-col items-center gap-8 max-w-lg w-full text-center">
        <WordReveal
          text="Okay."
          as="h1"
          className="text-5xl md:text-7xl font-heading text-cream-text"
          delay={0.5}
        />

        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p className="text-xl md:text-2xl text-warm-peach/80 leading-relaxed">
            Thanks for being honest, {name}.
          </p>
          <p className="text-lg text-cream-text/60 leading-relaxed max-w-md">
            I don&apos;t want to get in the way of what you have.
            <br />
            I really do hope you&apos;re happy.
          </p>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.6 }}
        >
          <p className="text-sm text-cream-text/30 italic">
            thanks for reading this far, {name}.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
