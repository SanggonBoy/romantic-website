"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";

export function EntryGate() {
  const { setName, goToNext } = useStage();
  const [value, setValue] = useState("");
  const [isExiting, setIsExiting] = useState(false);

  const handleSubmit = () => {
    if (!value.trim()) return;
    setName(value.trim());
    setIsExiting(true);
    setTimeout(() => goToNext(), 800);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          className="fixed inset-0 flex flex-col items-center justify-center bg-cream px-6"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <AmbientBg variant="light" />

          <motion.div
            className="flex flex-col items-center gap-8 max-w-sm w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.p
              className="text-muted-foreground text-sm tracking-wide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              before we begin...
            </motion.p>

            <motion.h1
              className="text-4xl md:text-5xl font-heading text-deep-cocoa text-center"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              What&apos;s your name?
            </motion.h1>

            <motion.div
              className="w-full flex flex-col gap-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6 }}
            >
              <Input
                type="text"
                placeholder="type here..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="text-center text-lg py-6 bg-cream-surface border-soft-gold/30 focus-visible:ring-dusty-rose/40 placeholder:italic placeholder:text-muted-foreground/50"
                autoFocus
              />
              <Button
                onClick={handleSubmit}
                disabled={!value.trim()}
                className="py-6 text-lg font-heading bg-dusty-rose hover:bg-dusty-rose/90 text-cream cursor-pointer disabled:opacity-30 transition-all duration-300"
              >
                enter
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
