"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * Hero visualization: untrusted threat nodes on the left fire probes that are
 * stopped at the glowing lime boundary line; protected assets sit calm on the
 * right. All motion is transform/opacity only, pauses when off-screen, and is
 * disabled under prefers-reduced-motion (see globals.css `hv-*`).
 */
export function HeroVisual({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Threat nodes (left / untrusted) and the distance each probe travels to the
  // boundary at x=220.
  const threats = [
    { x: 110, y: 140 },
    { x: 140, y: 240 },
    { x: 170, y: 330 },
  ];
  const assets = [
    { x: 296, y: 150 },
    { x: 338, y: 242 },
    { x: 300, y: 330 },
  ];

  return (
    <div
      ref={ref}
      data-hv-active={active}
      className={cn(
        "relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-card",
        className
      )}
    >
      <svg
        viewBox="0 0 440 440"
        className="h-full w-full"
        role="img"
        aria-label="Threat activity stopped at the protected boundary"
      >
        <defs>
          <pattern id="hv-grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--border-strong)" />
          </pattern>
          <linearGradient id="hv-boundary" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--primary)" stopOpacity="0.85" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hv-scan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--primary)" stopOpacity="1" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <filter id="hv-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Zone texture + faint tints */}
        <rect width="440" height="440" fill="url(#hv-grid)" opacity="0.5" />
        <rect width="220" height="440" fill="var(--severity-critical)" opacity="0.025" />
        <rect x="220" width="220" height="440" fill="var(--primary)" opacity="0.03" />

        {/* Boundary line + glow + scan pulse */}
        <rect x="217" y="30" width="6" height="380" fill="url(#hv-boundary)" filter="url(#hv-glow)" opacity="0.6" />
        <rect x="219" y="30" width="2" height="380" fill="url(#hv-boundary)" />
        <rect x="218.5" y="30" width="3" height="64" rx="1.5" fill="url(#hv-scan)" className="hv-scan" />

        {/* Left: threat cluster (untrusted) */}
        <g stroke="var(--severity-critical)" strokeOpacity="0.35" strokeWidth="1">
          <line x1={threats[0].x} y1={threats[0].y} x2={threats[1].x} y2={threats[1].y} />
          <line x1={threats[1].x} y1={threats[1].y} x2={threats[2].x} y2={threats[2].y} />
        </g>
        {threats.map((t, i) => (
          <g key={`t-${i}`}>
            <circle
              cx={t.x}
              cy={t.y}
              r="9"
              fill="none"
              stroke="var(--severity-critical)"
              strokeOpacity="0.5"
              className="hv-pulse"
              style={{ animationDelay: `${i * 0.6}s` }}
            />
            <circle cx={t.x} cy={t.y} r="4" fill="var(--severity-critical)" />
          </g>
        ))}

        {/* Probes fired at the boundary + impact rings */}
        {threats.map((t, i) => {
          const dist = 220 - t.x;
          const delay = `${i * 0.9}s`;
          return (
            <g key={`p-${i}`}>
              <circle
                cx={t.x}
                cy={t.y}
                r="2.5"
                fill="var(--severity-critical)"
                className="hv-attack"
                style={{ ["--hv-dist" as string]: `${dist}px`, animationDelay: delay }}
              />
              <circle
                cx="220"
                cy={t.y}
                r="6"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="1.5"
                className="hv-impact"
                style={{ animationDelay: delay }}
              />
            </g>
          );
        })}

        {/* Right: protected assets */}
        <g stroke="var(--primary)" strokeOpacity="0.3" strokeWidth="1">
          <line x1={assets[0].x} y1={assets[0].y} x2={assets[1].x} y2={assets[1].y} />
          <line x1={assets[1].x} y1={assets[1].y} x2={assets[2].x} y2={assets[2].y} />
        </g>
        {assets.map((a, i) => (
          <g
            key={`a-${i}`}
            className="hv-pulse-soft"
            style={{ animationDelay: `${i * 0.8}s`, transformOrigin: `${a.x}px ${a.y}px` }}
          >
            <rect x={a.x - 7} y={a.y - 7} width="14" height="14" rx="3.5" fill="var(--primary)" fillOpacity="0.14" stroke="var(--primary)" strokeOpacity="0.55" />
            <circle cx={a.x} cy={a.y} r="1.6" fill="var(--primary)" />
          </g>
        ))}

        {/* Labels */}
        <text x="24" y="34" fontSize="10" letterSpacing="2.2" fill="var(--muted-foreground)">
          EXTERNAL
        </text>
        <text x="416" y="34" fontSize="10" letterSpacing="2.2" textAnchor="end" fill="var(--primary)" fillOpacity="0.8">
          PROTECTED
        </text>
        <text x="230" y="406" fontSize="8.5" letterSpacing="3" fill="var(--primary)" fillOpacity="0.6" transform="rotate(-90 230 406)">
          BOUNDARY
        </text>
      </svg>
    </div>
  );
}
