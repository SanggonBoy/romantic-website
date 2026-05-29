"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight } from "lucide-react";
import { useStage } from "@/_components/stage-provider";
import { reasons } from "@/_lib/reasons";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 240 : -240,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -240 : 240,
    opacity: 0,
  }),
};

export function Reasons() {
  const { goToNext } = useStage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const touchStart = useRef<number | null>(null);

  const isLast = currentIndex === reasons.length - 1;

  const goNext = useCallback(() => {
    if (isLast) {
      goToNext();
      return;
    }
    setDirection(1);
    setCurrentIndex((prev) => prev + 1);
  }, [isLast, goToNext]);

  const goPrev = useCallback(() => {
    if (currentIndex === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => prev - 1);
  }, [currentIndex]);

  const handleSwipe = useCallback(
    (deltaX: number) => {
      if (deltaX < -50) goNext();
      if (deltaX > 50) goPrev();
    },
    [goNext, goPrev]
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStart.current;
    handleSwipe(deltaX);
    touchStart.current = null;
  };

  const current = reasons[currentIndex];

  return (
    <div
      className="fixed inset-0 bg-night-plum"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 20% 50%, rgba(244,181,168,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,195,158,0.06) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="absolute top-12 left-1/2 -translate-x-1/2">
        <motion.span
          className="text-warm-peach/40 text-sm tracking-wide"
          key={currentIndex}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentIndex + 1} / {reasons.length}
        </motion.span>
      </div>

      <div className="flex items-center justify-center h-full px-6">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.25 },
            }}
            className="flex flex-col items-center text-center max-w-md"
          >
            <motion.span
              key={`num-${currentIndex}`}
              className="block text-7xl md:text-9xl font-heading italic text-warm-peach/15 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              {current.number}
            </motion.span>
            <h3 className="text-3xl md:text-5xl font-heading text-cream-text mb-6 leading-tight">
              {current.headline}
            </h3>
            <p className="text-lg md:text-xl text-cream-text/60 max-w-md leading-relaxed">
              {current.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
        {reasons.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "bg-warm-peach scale-125"
                : i < currentIndex
                  ? "bg-warm-peach/60"
                  : "bg-warm-peach/20"
            }`}
          />
        ))}
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
        <motion.button
          onClick={goNext}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 py-3 px-8 rounded-full bg-dusty-rose text-cream font-heading text-base hover:bg-dusty-rose/90 transition-colors"
        >
          {isLast ? "show me what's next" : "next"}
          {!isLast && <ChevronRight className="w-4 h-4" />}
        </motion.button>
      </div>
    </div>
  );
}
