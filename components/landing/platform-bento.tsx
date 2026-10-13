"use client";

import * as React from "react";
import { animate, stagger } from "animejs";
import { Users, Bug, ShieldOff, ShieldCheck } from "lucide-react";

/**
 * Interactive "what you get" bento. Each tile shows a micro-visual instead of a
 * paragraph; hovering a tile plays a short anime.js micro-interaction (a probe
 * travels the attack chain, severity bars rise, the coverage ring draws, a fix
 * is confirmed). Respects prefers-reduced-motion — visuals rest in a complete
 * state and simply don't replay.
 */
const RING_R = 30;
const RING_C = 2 * Math.PI * RING_R;
const RING_PCT = 90;

export function PlatformBento() {
  const root = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const tiles = Array.from(el.querySelectorAll<HTMLElement>("[data-tile]"));
    const cleanups: (() => void)[] = [];

    for (const tile of tiles) {
      const kind = tile.dataset.tile;
      const onEnter = () => {
        if (kind === "chain") {
          const dot = tile.querySelector<HTMLElement>("[data-chain-dot]");
          if (dot) {
            animate(dot, {
              left: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              duration: 1100,
              ease: "inOut(2)",
            });
          }
          animate(tile.querySelectorAll<HTMLElement>("[data-chain-node]"), {
            scale: [1, 1.12, 1],
            duration: 620,
            delay: stagger(90),
            ease: "out(2)",
          });
        } else if (kind === "severity") {
          animate(tile.querySelectorAll<HTMLElement>("[data-sev-bar]"), {
            scaleY: [0.25, 1],
            duration: 640,
            delay: stagger(80),
            ease: "out(3)",
          });
        } else if (kind === "coverage") {
          const ring = tile.querySelector<SVGCircleElement>("[data-ring]");
          if (ring) {
            animate(ring, {
              strokeDashoffset: [RING_C, RING_C * (1 - RING_PCT / 100)],
              duration: 900,
              ease: "out(3)",
            });
          }
        } else if (kind === "remediate") {
          const check = tile.querySelector<HTMLElement>("[data-check]");
          if (check) {
            animate(check, {
              scale: [0, 1],
              opacity: [0, 1],
              duration: 520,
              ease: "out(3)",
            });
          }
        }
      };
      tile.addEventListener("mouseenter", onEnter);
      cleanups.push(() => tile.removeEventListener("mouseenter", onEnter));
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return (
    <div
      ref={root}
      className="grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]"
    >
      {/* A — attack chain (wide) */}
      <Tile
        kind="chain"
        title="Trace the full attack chain"
        subtitle="Threat actor to targeted asset, resolved from STIX relationships."
        className="md:col-span-2"
      >
        <div className="relative mt-5 flex items-center gap-2">
          {/* track */}
          <div className="absolute inset-x-1 top-1/2 h-px -translate-y-1/2 bg-white/10" aria-hidden />
          <span
            data-chain-dot
            className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0"
            aria-hidden
          />
          {[
            { icon: Users, label: "Attacker" },
            { icon: Bug, label: "Malware" },
            { icon: ShieldOff, label: "Weak spot" },
          ].map(({ icon: Icon, label }) => (
            <span
              key={label}
              data-chain-node
              className="relative z-10 flex flex-1 flex-col items-center gap-1.5 rounded-xl bg-white/[0.04] py-3"
            >
              <Icon className="size-4 text-white/70" strokeWidth={1.75} />
              <span className="text-[11px] text-white/55">{label}</span>
            </span>
          ))}
          <span className="relative z-10 flex flex-1 flex-col items-center gap-1.5 rounded-xl border-l-2 border-primary bg-primary/[0.06] py-3">
            <span className="text-[11px] font-medium uppercase tracking-wide text-primary">
              Boundary
            </span>
          </span>
        </div>
      </Tile>

      {/* B — severity (tall) */}
      <Tile
        kind="severity"
        title="Ranked by severity"
        subtitle="Worst weak spots first."
        className="md:row-span-2"
      >
        <div className="mt-6 flex h-28 items-end gap-3">
          {[
            { h: "100%", c: "var(--severity-critical)" },
            { h: "72%", c: "var(--severity-high)" },
            { h: "48%", c: "var(--severity-medium)" },
            { h: "26%", c: "var(--severity-low)" },
          ].map((b, i) => (
            <span
              key={i}
              data-sev-bar
              className="w-full origin-bottom rounded-md"
              style={{ height: b.h, backgroundColor: b.c }}
              aria-hidden
            />
          ))}
        </div>
      </Tile>

      {/* C — compliance ring */}
      <Tile
        kind="coverage"
        title="Mapped to NIST & SOC 2"
        subtitle="See exactly where you stand."
      >
        <div className="mt-4 flex items-center gap-4">
          <div className="relative grid size-[88px] shrink-0 place-items-center">
            <svg width="88" height="88" viewBox="0 0 88 88" aria-hidden>
              <circle cx="44" cy="44" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                data-ring
                cx="44"
                cy="44"
                r={RING_R}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={RING_C}
                strokeDashoffset={RING_C * (1 - RING_PCT / 100)}
                transform="rotate(-90 44 44)"
              />
            </svg>
            <span className="absolute font-heading text-lg font-semibold tabular-nums text-white">
              {RING_PCT}%
            </span>
          </div>
          <span className="text-sm text-white/55">Coverage across mapped control families.</span>
        </div>
      </Tile>

      {/* D — remediation */}
      <Tile
        kind="remediate"
        title="Plain-language fixes"
        subtitle="Each finding ships with steps to close it."
      >
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-white/[0.04] px-3 py-3">
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-white">
              LayerZero Injection Flaw
            </span>
            <span className="text-xs text-white/40">Finance-Core-Gateway</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-low">
            <span data-check className="inline-flex">
              <ShieldCheck className="size-4" strokeWidth={2} aria-hidden />
            </span>
            Covered
          </span>
        </div>
      </Tile>
    </div>
  );
}

function Tile({
  kind,
  title,
  subtitle,
  className,
  children,
}: {
  kind: string;
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      data-tile={kind}
      className={`flex flex-col rounded-2xl bg-card p-6 ring-1 ring-white/8 transition-colors duration-200 ${className ?? ""}`}
    >
      <h3 className="font-heading text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      {children}
    </div>
  );
}
