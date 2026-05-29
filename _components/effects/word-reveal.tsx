"use client";

import { motion, type Variants } from "motion/react";

interface WordRevealProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const wordVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(8px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export function WordReveal({
  text,
  className = "",
  delay = 0,
  staggerDelay = 0.06,
  as: Tag = "h2",
}: WordRevealProps) {
  const words = text.split(" ");

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: delay,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Tag className="flex flex-wrap gap-x-[0.3em] gap-y-0">
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block"
          >
            {word}
          </motion.span>
        ))}
      </Tag>
    </motion.div>
  );
}
