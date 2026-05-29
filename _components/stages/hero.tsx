"use client";

import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";
import { WordReveal } from "@/_components/effects/word-reveal";

export function Hero() {
  const { name, goToNext } = useStage();

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-night-plum px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <AmbientBg variant="dark" />

      <div className="flex flex-col items-center gap-8 max-w-lg w-full">
        <WordReveal
          text={`Hi, ${name}.`}
          as="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-heading text-cream-text text-center leading-tight"
          delay={0.5}
          staggerDelay={0.08}
        />

        <motion.p
          className="text-xl md:text-2xl text-warm-peach/80 font-heading italic text-center"
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          mind if I borrow a moment of your time?
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.0, type: "spring", stiffness: 200, damping: 15 }}
        >
          <Button
            onClick={goToNext}
            variant="outline"
            className="py-6 px-10 text-lg font-heading border-warm-peach/30 text-warm-peach hover:bg-warm-peach/10 cursor-pointer transition-all duration-300"
          >
            sure
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
