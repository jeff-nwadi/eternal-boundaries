"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "motion/react";

/**
 * Per-word staggered text reveal (motion.dev / motion/react). Splits each line
 * into words and reveals them one after another via a parent container variant
 * with staggerChildren. Respects prefers-reduced-motion (renders static).
 *
 * Marked data-stagger-text so the anime.js hero entrance skips it (the two
 * libraries must not animate the same node).
 */
const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.08 },
  },
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerText({
  lines,
  className,
}: {
  lines: string[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <h1 className={className} data-stagger-text>
        {lines.map((line, i) => (
          <React.Fragment key={line}>
            {i > 0 ? <br /> : null}
            {line}
          </React.Fragment>
        ))}
      </h1>
    );
  }

  return (
    <motion.h1
      className={className}
      data-stagger-text
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {lines.map((line) => {
        const words = line.split(" ");
        return (
          <span key={line} className="block">
            {words.map((word, wi) => (
              <React.Fragment key={`${word}-${wi}`}>
                <motion.span
                  variants={wordVariant}
                  className="inline-block [will-change:transform,opacity]"
                >
                  {word}
                </motion.span>
                {wi < words.length - 1 ? " " : null}
              </React.Fragment>
            ))}
          </span>
        );
      })}
    </motion.h1>
  );
}
