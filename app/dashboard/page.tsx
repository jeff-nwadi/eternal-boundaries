import type { Metadata } from "next";
import Link from "next/link";

import {
  stixObjects,
  vulnFindings,
  vulnSummary,
  complianceFrameworks,
} from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { ActivityCard } from "@/components/dashboard/overview/activity-card";
import { EngineStatus } from "@/components/dashboard/overview/engine-status";
import { SeverityDistribution } from "@/components/dashboard/vulnerabilities/severity-distribution";
import {
  TopFindings,
  ActiveIndicators,
  FindingsByAsset,
  ControlCoverage,
} from "@/components/dashboard/overview/overview-panels";

export const metadata: Metadata = { title: "Overview" };

export default function OverviewPage() {
  // All figures derived from the received sample data (flagged "Sample data" in
  // the sidebar). No invented numbers.
  const openFindings = vulnFindings.filter(
    (f) => f.patch_status.toLowerCase() !== "patched"
  ).length;
  const actors = stixObjects.filter((o) => o.type === "threat-actor").length;
  const malware = stixObjects.filter((o) => o.type === "malware").length;
  const activeIndicators = actors + malware;
  const controlsTracked = complianceFrameworks.reduce(
    (sum, f) => sum + f.summary.total_controls_tracked,
    0
  );
  // Mapped = controls actually covered in the sample ledger. Shown as
  // "X of Y mapped" so the Overview agrees with the Compliance view.
  const controlsCovered = complianceFrameworks.reduce(
    (sum, f) => sum + f.summary.covered_count,
    0
  );
  // Simulation-only (CLAUDE.md §5.6). No real remediation records exist yet.
  const pendingRemediation = 0;

  // Severity counts, derived from the real findings (never invented).
  const severityCounts = vulnFindings.reduce<Record<string, number>>((acc, f) => {
    const key = f.severity.toUpperCase();
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});
  const criticalCount = severityCounts.CRITICAL ?? 0;

  const pill =
    "rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-medium text-black/60";

  return (
    <div className="flex flex-col gap-10">
      {/* Heading + the single primary action */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold text-black sm:text-4xl">Overview</h1>
          <p className="text-sm text-black/55">
            What your security console is showing right now.
          </p>
        </div>
        <Link
          href="/dashboard/vulnerabilities"
          className="inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
        >
          View open findings
        </Link>
      </header>

      {/* Four headline numbers — the focal point, now with quick indicators */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open findings"
          value={openFindings}
          caption={`${vulnFindings.length} total`}
          indicator={<span className={pill}>{vulnSummary.trend}</span>}
        />
        <StatCard
          label="Critical exposure"
          value={criticalCount}
          caption="need review"
          indicator={
            <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-medium text-black/60">
              <span
                className="size-1.5 rounded-full"
                style={{ backgroundColor: "var(--severity-critical)" }}
                aria-hidden
              />
              Critical
            </span>
          }
        />
        <StatCard
          label="Active indicators"
          value={activeIndicators}
          caption={`${actors} actor${actors === 1 ? "" : "s"}, ${malware} malware`}
          indicator={<span className={pill}>Live feed</span>}
        />
        <StatCard
          label="Control coverage"
          value={`${controlsCovered} / ${controlsTracked}`}
          caption="mapped of tracked · claimed"
          indicator={<span className={pill}>Claimed</span>}
        />
      </div>

      {/* Top row — severity, top findings, active indicators */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SeverityDistribution counts={severityCounts} />
        <TopFindings findings={vulnFindings} />
        <ActiveIndicators objects={stixObjects} />
      </div>

      {/* Activity */}
      <ActivityCard />

      {/* Bottom row — exposure by asset, control coverage */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <FindingsByAsset findings={vulnFindings} />
        <ControlCoverage frameworks={complianceFrameworks} />
      </div>

      {/* Quiet engine line */}
      <EngineStatus />
    </div>
  );
}
