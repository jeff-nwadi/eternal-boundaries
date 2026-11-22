"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useReducedMotion } from "motion/react";

import { CanvasRevealEffect } from "@/components/ui/sign-in-flow-1";
import { BrandMark } from "@/components/landing/brand-mark";

const BRAND_RGB: [number, number, number] = [91, 43, 210];

/** Shared full-screen auth layout: purple dot-matrix background + centered slot. */
export function AuthShell({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  const showCanvas = mounted && !prefersReducedMotion;

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-background">
      <div className="absolute inset-0 z-0">
        {showCanvas && (
          <div className="absolute inset-0">
            <CanvasRevealEffect
              animationSpeed={3}
              containerClassName="bg-background"
              colors={[BRAND_RGB, BRAND_RGB]}
              dotSize={6}
              reverse={false}
            />
          </div>
        )}
        {/* Soft cream fades at top and bottom so the dot-matrix reads as a
            subtle texture against the light background, with no dark center. */}
        <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 p-6">
        <Link
          href="/"
          aria-label="Eternal Boundaries home"
          className="inline-flex rounded-md transition-opacity duration-150 ease-out hover:opacity-80"
        >
          <BrandMark />
        </Link>
      </div>

      <div className="relative z-10 flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-sm rounded-2xl border border-black/10 bg-card/90 p-8 shadow-xl shadow-black/5 backdrop-blur-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export const authInputClass =
  "w-full rounded-lg border border-black/10 bg-black/[0.03] px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30 disabled:opacity-60";
