"use client";

import { useId } from "react";
import type { ComponentProps, ComponentType, SVGProps } from "react";

import { cn } from "@/lib/utils";

type FeatureType = {
  title: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
};

type FeatureCardProps = ComponentProps<"div"> & {
  feature: FeatureType;
};

export function FeatureCard({ feature, className, ...props }: FeatureCardProps) {
  const p = genPattern(feature.title);

  return (
    <div className={cn("relative overflow-hidden p-6", className)} {...props}>
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 h-full w-full [mask-image:linear-gradient(white,transparent)]">
        <div className="from-foreground/5 to-foreground/1 absolute inset-0 bg-gradient-to-r [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] opacity-100">
          <GridPattern
            width={20}
            height={20}
            x="-12"
            y="4"
            squares={p}
            className="fill-foreground/5 stroke-foreground/25 absolute inset-0 h-full w-full mix-blend-overlay"
          />
        </div>
      </div>
      <feature.icon
        className="size-6 text-primary"
        strokeWidth={1.5}
        aria-hidden
      />
      <h3 className="mt-8 text-base font-medium text-foreground">
        {feature.title}
      </h3>
      <p className="relative z-20 mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        {feature.description}
      </p>
    </div>
  );
}

function GridPattern({
  width,
  height,
  x,
  y,
  squares,
  ...props
}: ComponentProps<"svg"> & {
  width: number;
  height: number;
  x: string;
  y: string;
  squares?: number[][];
}) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${patternId})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([sx, sy], index) => (
            <rect
              strokeWidth="0"
              key={index}
              width={width + 1}
              height={height + 1}
              x={sx * width}
              y={sy * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

// Deterministic, title-seeded pattern so the server and client render the exact
// same squares. The original Math.random()-at-render version differs between
// SSR and hydration, which trips a React hydration mismatch.
function genPattern(seed: string, length = 5): number[][] {
  const rand = mulberry32(hash(seed));
  return Array.from({ length }, () => [
    Math.floor(rand() * 4) + 7, // x between 7 and 10
    Math.floor(rand() * 6) + 1, // y between 1 and 6
  ]);
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
