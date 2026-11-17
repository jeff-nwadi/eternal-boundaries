"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/**
 * Lenis smooth scrolling for the marketing pages. Bound to the window (root).
 * Smoothing is switched off under prefers-reduced-motion (lerp 1 = instant).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.08,
        smoothWheel: !reduced,
        duration: 1.05,
      }}
    >
      {children}
    </ReactLenis>
  );
}
