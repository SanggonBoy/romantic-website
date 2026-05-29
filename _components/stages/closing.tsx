"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { useStage } from "@/_components/stage-provider";
import { AmbientBg } from "@/_components/effects/ambient-bg";
import { WordReveal } from "@/_components/effects/word-reveal";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
const HAS_WHATSAPP = WHATSAPP_NUMBER.length > 0;

export function Closing() {
  const { finalAnswer } = useStage();
  const hasConfetti = useRef(false);

  useEffect(() => {
    if (finalAnswer === "yes" && !hasConfetti.current) {
      hasConfetti.current = true;
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#C8536A", "#E8B17E", "#F4B5A8", "#E8C39E"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#C8536A", "#E8B17E", "#F4B5A8", "#E8C39E"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [finalAnswer]);

  const variants: Record<
    string,
    { headline: string; subtext: string; emoji: string }
  > = {
    yes: {
      headline: "Oh wow. Thank you.",
      subtext: "You just made my whole week. My whole month, actually.",
      emoji: "✨",
    },
    thinking: {
      headline: "Take your time.",
      subtext: "There's no deadline. I'll wait, patiently.",
      emoji: "🤍",
    },
    no: {
      headline: "I understand.",
      subtext:
        "Thanks for hearing me out. We can still be friends, right?",
      emoji: "🤝",
    },
  };

  const v = variants[finalAnswer || "yes"];

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-night-plum px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0 }}
    >
      <AmbientBg variant="dark" />

      <div className="flex flex-col items-center gap-8 max-w-lg w-full text-center">
        <motion.span
          className="text-5xl"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.5,
            type: "spring",
            stiffness: 200,
            damping: 12,
          }}
        >
          {v.emoji}
        </motion.span>

        <WordReveal
          text={v.headline}
          as="h1"
          className="text-4xl md:text-6xl font-heading text-cream-text leading-tight"
          delay={0.8}
          staggerDelay={0.08}
        />

        <motion.p
          className="text-lg md:text-xl text-warm-peach/70 leading-relaxed max-w-md"
          initial={{ opacity: 0, y: 15, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          {v.subtext}
        </motion.p>

        {(finalAnswer === "yes" || finalAnswer === "thinking") &&
          HAS_WHATSAPP && (
            <motion.div
              className="mt-8 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 0.8 }}
            >
              <p className="text-sm text-cream-text/40 italic">
                want to talk more?
              </p>
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hey! I saw what you made for me :)")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-8 rounded-full bg-dusty-rose text-cream font-heading text-lg hover:bg-dusty-rose/90 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                let&apos;s talk
              </motion.a>
            </motion.div>
          )}

        {finalAnswer === "no" && (
          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.0, duration: 0.6 }}
          >
            <p className="text-sm text-cream-text/30 italic">
              — with love, from me to you
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
