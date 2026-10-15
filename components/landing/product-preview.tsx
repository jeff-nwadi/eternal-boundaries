"use client";

import * as React from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { Users, Bug, ShieldOff, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Interactive product preview. The tabs auto-cycle (pausing on hover/click) and
 * each view is a compact, animated mock built from the same primitives as the
 * real dashboard. PLACEHOLDER data only — the live dashboard is behind auth —
 * so every panel carries a "Sample data" tag and is never implied as real
 * telemetry. Respects prefers-reduced-motion (no auto-advance, no parallax).
 */
const TABS = ["Threat Intelligence", "Vulnerabilities", "Compliance Mapping"] as const;
type Tab = (typeof TABS)[number];

const CYCLE_MS = 4600;

export function ProductPreview() {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduce = useReducedMotion();

  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);

  React.useEffect(() => {
    if (reduce || paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % TABS.length), CYCLE_MS);
    return () => clearInterval(id);
  }, [reduce, paused]);

  const tab = TABS[index];

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-4xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <motion.div
        style={{ y }}
        className="rounded-[28px] border border-white/8 bg-white/[0.04] p-2 backdrop-blur-xl sm:p-3"
      >
        <div className="overflow-hidden rounded-[20px] border border-white/8 bg-background">
          {/* Tab bar */}
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              {TABS.map((t, i) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setIndex(i);
                    setPaused(true);
                  }}
                  className={cn(
                    "relative shrink-0 overflow-hidden rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                    i === index ? "bg-white/10 text-white" : "text-white/50 hover:text-white"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="shrink-0 rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/50">
              Sample data
            </span>
          </div>

          {/* Content */}
          <div className="relative min-h-[300px] p-4 sm:min-h-[280px] sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {tab === "Threat Intelligence" && <ThreatMock reduce={!!reduce} />}
                {tab === "Vulnerabilities" && <VulnMock reduce={!!reduce} />}
                {tab === "Compliance Mapping" && <ComplianceMock reduce={!!reduce} />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------------- Threat: animated relationship chain ---------------- */

const CHAIN = [
  { icon: Users, name: "APT Group", kind: "Attacker", edge: "uses" },
  { icon: Bug, name: "Execution Stream Payload", kind: "Malware", edge: "exploits" },
  { icon: ShieldOff, name: "LayerZero Injection Flaw", kind: "Weak spot", edge: "targets" },
] as const;

function ThreatMock({ reduce }: { reduce: boolean }) {
  return (
    <div className="text-left">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Attack chain</span>
        <span className="text-xs text-white/40">external → protected</span>
      </div>

      <div className="flex flex-col gap-0 lg:flex-row lg:items-stretch lg:gap-0">
        {CHAIN.map((node, i) => {
          const Icon = node.icon;
          return (
            <React.Fragment key={node.name}>
              <motion.div
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 + i * 0.12, duration: 0.3 }}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-3"
              >
                <Icon className="size-4 shrink-0 text-white/70" strokeWidth={1.75} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {node.name}
                  </span>
                  <span className="text-xs text-white/40">{node.kind}</span>
                </span>
              </motion.div>

              {/* connector / edge label */}
              <div className="flex items-center justify-center py-1 lg:flex-col lg:px-1 lg:py-0">
                <span className="hidden text-[10px] uppercase tracking-wide text-white/35 lg:block">
                  {node.edge}
                </span>
                <span className="h-4 w-px bg-primary/50 lg:h-px lg:w-5" aria-hidden />
              </div>
            </React.Fragment>
          );
        })}

        {/* Boundary / protected side */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 + CHAIN.length * 0.12, duration: 0.3 }}
          className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border-l-2 border-primary bg-primary/[0.06] px-3 py-3"
        >
          <span className="text-[10px] font-medium uppercase tracking-wide text-primary">
            Boundary
          </span>
          <span className="text-sm text-white/55">Your systems</span>
        </motion.div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-white/40">
        <ArrowRight className="size-3.5 text-primary" strokeWidth={2} />
        Click any indicator to trace its full chain.
      </div>
    </div>
  );
}

/* ---------------- Vulnerabilities: severity bar + rows ---------------- */

const SEV = [
  { label: "Critical", count: 1, color: "var(--severity-critical)" },
  { label: "High", count: 1, color: "var(--severity-high)" },
  { label: "Medium", count: 1, color: "var(--severity-medium)" },
  { label: "Low", count: 0, color: "var(--severity-low)" },
] as const;

const FINDINGS = [
  { name: "LayerZero Injection Flaw", asset: "Finance-Core-Gateway", sev: "Critical", color: "var(--severity-critical)" },
  { name: "Boundary Verification Bypass", asset: "SOC-Edge-Router", sev: "High", color: "var(--severity-high)" },
  { name: "Config Drift Exposure", asset: "Compliance-Vault", sev: "Medium", color: "var(--severity-medium)" },
] as const;

function VulnMock({ reduce }: { reduce: boolean }) {
  const total = SEV.reduce((s, x) => s + x.count, 0);
  return (
    <div className="text-left">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Findings by severity</span>
        <span className="text-xs text-white/40">{total} open</span>
      </div>

      {/* Segmented bar */}
      <div className="flex h-2.5 w-full gap-1 overflow-hidden">
        {SEV.filter((s) => s.count > 0).map((s, i) => (
          <motion.span
            key={s.label}
            className="h-full rounded-full"
            style={{ flexGrow: s.count, backgroundColor: s.color }}
            initial={reduce ? false : { scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="mt-4 flex flex-col">
        {FINDINGS.map((f, i) => (
          <motion.div
            key={f.name}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.12 + i * 0.1, duration: 0.3 }}
            className="flex items-center gap-3 border-b border-white/8 py-2.5 last:border-0"
          >
            <span
              className="size-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: f.color }}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-white">{f.name}</span>
              <span className="text-xs text-white/40">{f.asset}</span>
            </span>
            <span
              className="shrink-0 text-xs font-medium"
              style={{ color: f.color }}
            >
              {f.sev}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Compliance: coverage ring + bars ---------------- */

const FRAMEWORKS = [
  { name: "NIST SP 800-53", scope: "SC / SI families", pct: 92 },
  { name: "SOC 2 Type II", scope: "CC6 / CC7 criteria", pct: 88 },
] as const;

function ComplianceMock({ reduce }: { reduce: boolean }) {
  const avg = Math.round(FRAMEWORKS.reduce((s, f) => s + f.pct, 0) / FRAMEWORKS.length);
  const r = 42;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center gap-6 text-left sm:flex-row sm:gap-10">
      {/* Ring — sized so the figure sits comfortably inside the arc */}
      <div className="relative grid size-[132px] shrink-0 place-items-center">
        <svg width="132" height="132" viewBox="0 0 132 132" aria-hidden>
          <circle cx="66" cy="66" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
          <motion.circle
            cx="66"
            cy="66"
            r={r}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            transform="rotate(-90 66 66)"
            initial={reduce ? false : { strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - avg / 100) }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute flex flex-col items-center leading-none">
          <span className="font-heading text-[1.60rem] font-semibold tabular-nums text-white">
            {avg}%
          </span>
          <span className="mt-1 text-[8px] uppercase tracking-wide text-white/40">
            coverage
          </span>
        </div>
      </div>

      {/* Framework bars */}
      <div className="flex w-full flex-1 flex-col gap-4">
        {FRAMEWORKS.map((f, i) => (
          <div key={f.name} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-white">{f.name}</span>
              <span className="text-sm tabular-nums text-white/60">{f.pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={reduce ? false : { scaleX: 0, originX: 0 }}
                animate={{ scaleX: f.pct / 100, originX: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                style={{ width: "100%" }}
              />
            </div>
            <span className="text-xs text-white/40">{f.scope}</span>
          </div>
        ))}
        <span className="text-xs text-white/40">Mapped to controls, not certified.</span>
      </div>
    </div>
  );
}
