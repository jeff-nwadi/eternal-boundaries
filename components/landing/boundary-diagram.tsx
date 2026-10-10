"use client";

import * as React from "react";
import { animate, stagger } from "animejs";

/**
 * The signature boundary motif, animated with anime.js: untrusted threat dots
 * drift in from the left, meet the lime boundary line, and dissolve (blocked),
 * while the protected nodes on the right pulse. Hovering sends a scan down the
 * line. Respects prefers-reduced-motion.
 */
const THREATS = ["16%", "32%", "48%", "64%", "80%"];
const NODES = ["26%", "44%", "62%", "80%"];

export function BoundaryDiagram() {
  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const dots = el.querySelectorAll<HTMLElement>("[data-threat]");
    const nodes = el.querySelectorAll<HTMLElement>("[data-node]");
    const line = el.querySelector<HTMLElement>("[data-line]");
    const scan = el.querySelector<HTMLElement>("[data-scan]");

    const anims = [
      animate(dots, {
        left: ["8%", "48%"],
        opacity: [0, 1, 1, 0],
        scale: [0.6, 1, 1, 0.4],
        duration: 2000,
        delay: stagger(320),
        loop: true,
        ease: "inOut(2)",
      }),
      animate(nodes, {
        scale: [1, 1.35, 1],
        opacity: [0.5, 1, 0.5],
        duration: 2200,
        delay: stagger(200),
        loop: true,
        ease: "inOut(2)",
      }),
      line
        ? animate(line, {
            opacity: [0.5, 1, 0.5],
            duration: 2600,
            loop: true,
            ease: "inOut(2)",
          })
        : null,
    ];

    const onEnter = () => {
      if (!scan) return;
      animate(scan, {
        top: ["8%", "92%"],
        opacity: [0, 1, 0],
        duration: 700,
        ease: "out(2)",
      });
    };
    el.addEventListener("mouseenter", onEnter);

    return () => {
      el.removeEventListener("mouseenter", onEnter);
      for (const a of anims) a?.pause?.();
    };
  }, []);

  return (
    <div
      ref={root}
      className="relative mx-auto h-[280px] w-full max-w-3xl overflow-hidden rounded-2xl bg-card/60 ring-1 ring-white/8"
    >
      {/* Zone labels */}
      <span className="absolute left-5 top-4 text-[11px] font-medium uppercase tracking-wider text-white/40">
        External
      </span>
      <span className="absolute right-5 top-4 text-[11px] font-medium uppercase tracking-wider text-white/40">
        Protected
      </span>

      {/* Boundary line + glow */}
      <div className="absolute inset-y-8 left-1/2 w-10 -translate-x-1/2 bg-primary/10 blur-xl" aria-hidden />
      <div
        data-line
        className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-primary"
        aria-hidden
      />
      {/* Hover scan segment travelling down the line */}
      <div
        data-scan
        className="absolute left-1/2 h-10 w-0.5 -translate-x-1/2 rounded-full bg-primary opacity-0"
        aria-hidden
      />
      {/* Boundary chip */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/30 bg-background px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary">
        Boundary
      </span>

      {/* Threat dots (left) */}
      {THREATS.map((top) => (
        <span
          key={top}
          data-threat
          style={{ top, left: "8%" }}
          className="absolute size-2 -translate-y-1/2 rounded-full bg-white/70"
          aria-hidden
        />
      ))}

      {/* Protected nodes (right) */}
      {NODES.map((top) => (
        <span
          key={top}
          data-node
          style={{ top, left: "88%" }}
          className="absolute size-2.5 -translate-y-1/2 rounded-full bg-primary"
          aria-hidden
        />
      ))}
    </div>
  );
}
