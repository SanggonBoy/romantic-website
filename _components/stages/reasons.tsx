"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";
import { reasons } from "@/_lib/reasons";

export function Reasons() {
  const { goToNext } = useStage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isIdle, setIsIdle] = useState(false);
  const idleTimer = useRef<NodeJS.Timeout | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const buttonOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);

  const cueOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  const activeIndex = useTransform(scrollYProgress, (v) => {
    const idx = Math.round(v * (reasons.length - 1));
    return Math.min(idx, reasons.length - 1);
  });

  const resetIdle = () => {
    setIsIdle(false);
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => setIsIdle(true), 4000);
  };

  useEffect(() => {
    idleTimer.current = setTimeout(() => setIsIdle(true), 4000);
    window.addEventListener("scroll", resetIdle, { passive: true });
    return () => {
      window.removeEventListener("scroll", resetIdle);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  return (
    <div ref={containerRef} className="bg-night-plum min-h-[600vh] relative">
      <AmbientBg variant="dark" />

      <div className="sticky top-0 h-[100dvh] flex flex-col items-center justify-center px-6 overflow-hidden">
        <motion.p
          className="text-warm-peach/50 text-sm tracking-widest uppercase mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          a few things I notice about you...
        </motion.p>

        {reasons.map((reason, i) => {
          const start = i / reasons.length;
          const end = (i + 1) / reasons.length;

          return (
            <ReasonSection
              key={i}
              reason={reason}
              scrollProgress={scrollYProgress}
              start={start}
              end={end}
              isFirst={i === 0}
            />
          );
        })}

        <motion.button
          onClick={goToNext}
          className="absolute bottom-12 text-warm-peach/40 text-sm italic cursor-pointer hover:text-warm-peach/70 transition-colors"
          style={{ opacity: buttonOpacity }}
          initial={{ opacity: 0 }}
        >
          there&apos;s one more thing...
        </motion.button>

        <ProgressDots activeIndex={activeIndex} />

        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: cueOpacity }}
        >
          <motion.span className="text-warm-peach/50 text-xs italic tracking-wide">
            scroll
          </motion.span>
          <motion.div
            animate={
              isIdle
                ? { y: [0, -16, 0], transition: { duration: 0.8, repeat: Infinity } }
                : { y: [0, -8, 0], transition: { duration: 1.5, repeat: Infinity } }
            }
          >
            <ChevronDown className="w-5 h-5 text-warm-peach/50" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function ProgressDots({
  activeIndex,
}: {
  activeIndex: MotionValue<number>;
}) {
  return (
    <div className="fixed right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
      {reasons.map((_, i) => (
        <ProgressDot key={i} index={i} activeIndex={activeIndex} />
      ))}
    </div>
  );
}

function ProgressDot({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: MotionValue<number>;
}) {
  const scale = useTransform(
    activeIndex,
    reasons.map((_, i) => i),
    reasons.map((_, i) => (i === index ? 1.3 : 1))
  );

  const backgroundColor = useTransform(
    activeIndex,
    reasons.map((_, i) => i),
    reasons.map((_, i) =>
      i === index
        ? "rgba(244, 181, 168, 1)"
        : i < index
          ? "rgba(244, 181, 168, 0.6)"
          : "rgba(244, 181, 168, 0.2)"
    )
  );

  return (
    <motion.div
      className="w-2 h-2 rounded-full"
      style={{ backgroundColor, scale }}
    />
  );
}

function ReasonSection({
  reason,
  scrollProgress,
  start,
  end,
  isFirst,
}: {
  reason: { number: string; headline: string; body: string };
  scrollProgress: MotionValue<number>;
  start: number;
  end: number;
  isFirst: boolean;
}) {
  const opacity = useTransform(
    scrollProgress,
    isFirst
      ? [start, start + 0.05, end - 0.05, end]
      : [start, start + 0.05, end - 0.05, end],
    isFirst ? [1, 1, 1, 0] : [0, 1, 1, 0]
  );

  const y = useTransform(
    scrollProgress,
    [start, start + 0.05, end - 0.05, end],
    [60, 0, 0, -60]
  );

  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
      style={{ opacity, y }}
    >
      <motion.span className="block text-7xl md:text-9xl font-heading italic text-warm-peach/15 mb-4">
        {reason.number}
      </motion.span>
      <h3 className="text-3xl md:text-5xl font-heading text-cream-text mb-6 leading-tight">
        {reason.headline}
      </h3>
      <p className="text-lg md:text-xl text-cream-text/60 max-w-md leading-relaxed">
        {reason.body}
      </p>
    </motion.div>
  );
}
