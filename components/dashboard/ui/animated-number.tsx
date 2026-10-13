"use client";

import * as React from "react";
import { animate } from "animejs";

/**
 * Counts up to `value` on mount with anime.js — a small, tasteful flourish for
 * the dashboard's headline figures. Honors prefers-reduced-motion (shows the
 * final value immediately) and re-runs if the value changes.
 */
export function AnimatedNumber({
  value,
  durationMs = 900,
}: {
  value: number;
  durationMs?: number;
}) {
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }
    const obj = { n: 0 };
    const a = animate(obj, {
      n: value,
      duration: durationMs,
      ease: "out(3)",
      onUpdate: () => setDisplay(obj.n),
    });
    return () => {
      a.pause?.();
    };
  }, [value, durationMs]);

  return <>{Math.round(display).toLocaleString()}</>;
}
