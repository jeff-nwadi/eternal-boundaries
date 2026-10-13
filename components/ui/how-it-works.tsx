"use client";

import { useRef, type CSSProperties } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useInView,
  useReducedMotion,
} from "motion/react";
import { Pin } from "lucide-react";

import { cn } from "@/lib/utils";

interface CardProps {
  number: string;
  title: string;
  description: string;
  className?: string;
  rotate?: string;
}

const Card = ({ number, title, description, className, rotate }: CardProps) => (
  <div
    className={cn(
      // Only compositor props animate on hover; kept under 200ms and ease-out.
      "relative w-full transition-[transform] duration-200 ease-out hover:z-30 hover:-translate-y-1 hover:scale-[1.03] md:w-[280px]",
      rotate,
      className
    )}
  >
    <div className="rounded-2xl border border-border bg-card p-2 shadow-sm">
      <Pin
        strokeWidth={1.75}
        className="mx-auto mb-6 size-7 rotate-45 fill-primary/15 text-primary"
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background/60 p-4">
        <span className="mb-4 font-heading text-4xl font-semibold leading-none tabular-nums text-primary">
          {number}
        </span>
        <h3 className="mb-2 text-xl font-semibold leading-tight text-foreground">
          {title}
        </h3>
        <p className="text-pretty text-sm leading-relaxed tracking-tight text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  </div>
);

export interface Step {
  title: string;
  description: string;
}

export interface StepPosition {
  className?: string;
  rotate?: string;
}

export interface HowItWorksProps {
  features?: Step[];
  className?: string;
  stepPositions?: StepPosition[];
}

const DEFAULT_CARD_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[15%]", rotate: "rotate-[8deg]" },
  {
    className: "md:absolute md:top-[120px] md:right-[15%]",
    rotate: "-rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[450px] md:left-[15%]",
    rotate: "rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[570px] md:right-[10%]",
    rotate: "-rotate-[8deg]",
  },
  {
    className: "md:absolute md:top-[850px] md:left-[15%]",
    rotate: "rotate-[8deg]",
  },
];

const DEFAULT_FEATURES: Step[] = [
  {
    title: "Get invited",
    description:
      "Access is invite-only. An admin provisions your account and sends a secure sign-in link.",
  },
  {
    title: "See everything in one place",
    description:
      "Live threats, ranked vulnerabilities, and compliance coverage across three clean views.",
  },
  {
    title: "Understand and act",
    description:
      "Trace any attack chain, follow plain-language fixes, and see where you stand on NIST and SOC 2.",
  },
];

export default function HowItWorks({
  features,
  className,
  stepPositions,
}: HowItWorksProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();

  const data = features && features.length > 0 ? features : DEFAULT_FEATURES;
  const positions = stepPositions ?? DEFAULT_CARD_POSITIONS;

  let height = 1130;
  if (data.length === 1) height = 400;
  else if (data.length === 2) height = 450;
  else if (data.length === 3) height = 800;
  else if (data.length === 4) height = 900;

  // The dashed path only loops while the section is on screen and motion is
  // allowed — otherwise it rests static (baseline-ui: pause off-screen loops).
  const animatePath = inView && !prefersReducedMotion;

  return (
    <LazyMotion features={domAnimation}>
      <div ref={containerRef} className={cn("relative", className)}>
        {/* Subtle monitoring-surface grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border-strong) 1px, transparent 1px)",
            backgroundSize: "100% 32px",
          }}
        />
        {/* Edge fades so scattered cards never collide with the section edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background to-transparent" />

        <div className="relative z-10 mx-auto w-full max-w-6xl">
          <div
            className="relative mx-auto flex w-full max-w-[1000px] flex-col space-y-8 md:block md:h-[var(--md-height)] md:space-y-0"
            style={{ "--md-height": `${height}px` } as CSSProperties}
          >
            {data.length > 1 && (
              <svg
                className="pointer-events-none absolute left-0 top-0 z-0 hidden h-full w-full md:block"
                viewBox={`0 0 1000 ${height}`}
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {(() => {
                  const pathD = data.reduce((acc, _, index) => {
                    if (index >= data.length - 1) return acc;
                    if (index === 0)
                      return "M 290 150 C 500 150, 550 270, 710 270";
                    if (index === 1) return acc + " C 850 270, 500 350, 290 450";
                    if (index === 2) return acc + " C 290 600, 550 720, 750 720";
                    if (index === 3) return acc + " C 950 720, 500 800, 290 850";
                    return acc;
                  }, "");
                  return (
                    <m.path
                      d={pathD}
                      stroke="currentColor"
                      className="text-primary/45"
                      strokeWidth="2"
                      strokeDasharray="8 6"
                      fill="none"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                      initial={{ strokeDashoffset: 0 }}
                      animate={{ strokeDashoffset: animatePath ? -140 : 0 }}
                      transition={
                        animatePath
                          ? { duration: 3, repeat: Infinity, ease: "linear" }
                          : { duration: 0 }
                      }
                    />
                  );
                })()}
              </svg>
            )}

            {data.map((step, index) => {
              const position = positions[index % positions.length];
              return (
                <Card
                  key={step.title}
                  number={`0${index + 1}`}
                  title={step.title}
                  description={step.description}
                  rotate={position.rotate}
                  className={position.className}
                />
              );
            })}
          </div>
        </div>
      </div>
    </LazyMotion>
  );
}
