"use client";

import * as React from "react";
import { ReactLenis } from "lenis/react";

/**
 * Lenis smooth scrolling for the marketing pages. Bound to the window (root).
 * Smoothing is switched off under prefers-reduced-motion (lerp 1 = instant).
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    setReduced(
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false
    );
  }, []);

  return (
    <ReactLenis
      root
      options={{
        lerp: reduced ? 1 : 0.1,
        smoothWheel: !reduced,
        duration: 1.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
