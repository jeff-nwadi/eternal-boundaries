"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Product preview window. PLACEHOLDER mocks: no real dashboard screenshots exist
 * yet (the dashboard is behind auth), so each tab renders a clean static mock of
 * the view, flagged with a "Sample data" tag. Never implied as real telemetry.
 * Palette-only (background / white / lime) — no severity hex here.
 */
const TABS = [
  "Threat Intelligence",
  "Vulnerabilities",
  "Compliance Mapping",
] as const;
type Tab = (typeof TABS)[number];

export function ProductPreview() {
  const [tab, setTab] = React.useState<Tab>("Threat Intelligence");
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [28, -28]);

  return (
    <div ref={ref} className="mx-auto w-full max-w-4xl">
      {/* Frosted frame */}
      <motion.div
        style={{ y }}
        className="rounded-[28px] border border-white/8 bg-white/[0.04] p-2 backdrop-blur-xl sm:p-3"
      >
        {/* App window */}
        <div className="overflow-hidden rounded-[20px] border border-white/8 bg-background">
          {/* Top bar: tabs + sample tag */}
          <div className="flex items-center justify-between gap-3 border-b border-white/8 px-3 py-2.5 sm:px-4">
            <div className="flex items-center gap-1 overflow-x-auto">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150",
                    tab === t
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white"
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
          <div className="p-3 sm:p-5">
            {tab === "Threat Intelligence" && <ThreatMock />}
            {tab === "Vulnerabilities" && <VulnMock />}
            {tab === "Compliance Mapping" && <ComplianceMock />}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Dot({ lime }: { lime?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "size-1.5 shrink-0 rounded-full",
        lime ? "bg-primary" : "bg-white/40"
      )}
    />
  );
}

function Row({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-white/8 py-2.5 text-sm last:border-0",
        className
      )}
    >
      {children}
    </div>
  );
}

function ThreatMock() {
  const rows = [
    ["APT Group - Out-of-Band Vector", "Threat actor", "Active", true],
    ["Arbitrary Execution Stream Payload", "Malware", "Tracking", true],
    ["LayerZero Injection Flaw", "Vulnerability", "Open", false],
  ] as const;
  return (
    <div className="text-left">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Live indicator feed</span>
        <span className="text-xs text-white/40">3 of 3 shown</span>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-x-6 text-xs uppercase tracking-wide text-white/40">
        <span>Indicator</span>
        <span>Status</span>
      </div>
      {rows.map(([name, type, status, lime]) => (
        <Row key={name} className="grid grid-cols-[1fr_auto] gap-x-6">
          <span className="flex items-center gap-2.5 min-w-0">
            <Dot lime={lime as boolean} />
            <span className="min-w-0">
              <span className="block truncate font-medium text-white">{name}</span>
              <span className="text-xs text-white/40">{type}</span>
            </span>
          </span>
          <span className="self-center text-xs text-white/60">{status}</span>
        </Row>
      ))}
    </div>
  );
}

function VulnMock() {
  const rows = [
    ["CVE-2026-ETBV-001", "Finance-Core-Gateway", "Critical", "Open"],
    ["Boundary Verification Bypass", "SOC-Edge-Router", "High", "Open"],
    ["Legacy Boundary Drift Leak", "Compliance-Vault", "Medium", "Patched"],
  ] as const;
  return (
    <div className="text-left">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-white">Findings by severity</span>
        <span className="text-xs text-white/40">with fix-it steps</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_auto] gap-x-5 text-xs uppercase tracking-wide text-white/40">
        <span>Finding</span>
        <span>Severity</span>
        <span>Status</span>
      </div>
      {rows.map(([name, asset, sev, status]) => (
        <Row key={name} className="grid grid-cols-[1fr_auto_auto] gap-x-5">
          <span className="min-w-0">
            <span className="block truncate font-medium text-white">{name}</span>
            <span className="text-xs text-white/40">{asset}</span>
          </span>
          <span className="self-center text-xs font-medium text-white">{sev}</span>
          <span className="self-center text-xs text-white/50">{status}</span>
        </Row>
      ))}
    </div>
  );
}

function ComplianceMock() {
  const frameworks = [
    ["NIST SP 800-53", "SC / SI families", 92],
    ["SOC 2 Type II", "CC6 / CC7 criteria", 88],
  ] as const;
  return (
    <div className="space-y-5 text-left">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-white">Coverage by framework</span>
        <span className="text-xs text-white/40">mapped, not certified</span>
      </div>
      {frameworks.map(([name, scope, pct]) => (
        <div key={name} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium text-white">{name}</span>
            <span className="text-sm tabular-nums text-white/60">
              {pct}
              <span className="text-xs text-white/40">%</span>
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs text-white/40">{scope}</span>
        </div>
      ))}
    </div>
  );
}
