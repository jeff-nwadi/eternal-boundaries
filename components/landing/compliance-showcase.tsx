"use client";

import * as React from "react";
import { ShieldCheck, FileCheck, type LucideIcon } from "lucide-react";

/**
 * Interactive compliance mapping. Coverage bars fill when the section scrolls
 * into view (CSS transition + one IntersectionObserver — no animation loop, so
 * it stays cheap), and each card's icon + control-family chips light up on hover.
 * The percentages are illustrative ("mapped, not certified"), matching the rest
 * of the marketing copy — never presented as an audit result.
 */
const FRAMEWORKS: {
  name: string;
  icon: LucideIcon;
  plain: string;
  pct: number;
  families: string[];
}[] = [
  {
    name: "NIST SP 800-53",
    icon: ShieldCheck,
    plain:
      "The U.S. federal control catalog. Findings map to the boundary and cryptographic controls (SC) and the integrity and monitoring controls (SI).",
    pct: 92,
    families: ["SC-7", "SC-8", "SC-13", "SI-2", "SI-4", "SI-7"],
  },
  {
    name: "SOC 2 Type II",
    icon: FileCheck,
    plain:
      "The trust and security audit standard. Findings map to the access controls (CC6) and the system operations and monitoring criteria (CC7).",
    pct: 88,
    families: ["CC6.1", "CC6.8", "CC7.1", "CC7.2"],
  },
];

export function ComplianceShowcase() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="grid gap-5 md:grid-cols-2">
      {FRAMEWORKS.map((fw, i) => {
        const Icon = fw.icon;
        return (
          <div
            key={fw.name}
            className="group rounded-2xl bg-background p-6 ring-1 ring-white/8 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-4">
              <span className="flex size-10 items-center justify-center rounded-lg bg-white/[0.04] text-white/50 transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                <Icon className="size-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="text-right leading-none">
                <span className="font-heading text-2xl font-semibold tabular-nums text-white">
                  {fw.pct}
                  <span className="text-sm text-white/40">%</span>
                </span>
                <span className="mt-1 block text-[11px] text-white/40">mapped</span>
              </span>
            </div>

            <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
              {fw.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {fw.plain}
            </p>

            {/* Coverage bar — fills in on first view */}
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full origin-left rounded-full bg-primary transition-transform duration-[900ms] ease-out"
                style={{
                  width: `${fw.pct}%`,
                  transform: inView ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: `${i * 150}ms`,
                }}
              />
            </div>

            {/* Control-family chips, highlighted on hover */}
            <div className="mt-4 flex flex-wrap gap-1.5">
              {fw.families.map((f) => (
                <span
                  key={f}
                  className="rounded-md bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] text-white/55 transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
