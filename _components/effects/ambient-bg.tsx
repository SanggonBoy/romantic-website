"use client";

import { motion } from "motion/react";

interface AmbientBgProps {
  variant?: "light" | "dark";
}

export function AmbientBg({ variant = "light" }: AmbientBgProps) {
  const isLight = variant === "light";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{
          background: isLight
            ? [
                "radial-gradient(ellipse at 20% 50%, rgba(232,177,126,0.15) 0%, transparent 60%)",
                "radial-gradient(ellipse at 80% 20%, rgba(200,83,106,0.1) 0%, transparent 60%)",
                "radial-gradient(ellipse at 40% 80%, rgba(232,177,126,0.12) 0%, transparent 60%)",
                "radial-gradient(ellipse at 20% 50%, rgba(232,177,126,0.15) 0%, transparent 60%)",
              ]
            : [
                "radial-gradient(ellipse at 20% 50%, rgba(244,181,168,0.08) 0%, transparent 60%)",
                "radial-gradient(ellipse at 80% 20%, rgba(232,195,158,0.06) 0%, transparent 60%)",
                "radial-gradient(ellipse at 40% 80%, rgba(244,181,168,0.07) 0%, transparent 60%)",
                "radial-gradient(ellipse at 20% 50%, rgba(244,181,168,0.08) 0%, transparent 60%)",
              ],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px 128px",
        }}
        animate={{
          x: [0, -10, 5, -5, 0],
          y: [0, 5, -5, 10, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
