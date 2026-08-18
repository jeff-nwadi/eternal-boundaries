"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Runs before paint in the browser, no-ops on the server (avoids the SSR
// useLayoutEffect warning) so the "pending" hide never flashes for JS users.
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

type RevealProps = React.ComponentProps<"div"> & {
  /** Stagger offset in ms, applied via CSS transition-delay. */
  delay?: number;
  /** Render as a different element while keeping the reveal behaviour. */
  as?: React.ElementType;
};

/**
 * Reveals its children on first scroll into view: a compositor-only
 * opacity + translateY transition (see globals.css). If JS never runs the
 * content is shown immediately, and prefers-reduced-motion disables the
 * movement entirely — nothing is gated behind the animation.
 */
export function Reveal({
  className,
  delay = 0,
  as,
  style,
  children,
  ...props
}: RevealProps) {
  // Loosely typed on purpose: keeps the polymorphic `as` spread type-checking
  // even when a global JSX augmentation (e.g. @react-three/fiber) widens
  // JSX.IntrinsicElements and would otherwise collapse these props to `never`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Comp: any = as ?? "div";
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Only hide once we know JS is running; set before paint to avoid a flash.
    el.setAttribute("data-reveal", "pending");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Comp
      ref={ref}
      data-reveal={shown ? "shown" : undefined}
      style={{ ...style, ["--reveal-delay" as string]: `${delay}ms` }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
