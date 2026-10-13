import type { Metadata } from "next";
import Link from "next/link";

import { stixObjects, vulnFindings, complianceFrameworks } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { ActivityCard } from "@/components/dashboard/overview/activity-card";
import { EngineStatus } from "@/components/dashboard/overview/engine-status";

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
  // Simulation-only (CLAUDE.md §5.6). No real remediation records exist yet.
  const pendingRemediation = 0;

  return (
    <div className="flex flex-col gap-10">
      {/* Heading + the single lime action */}
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold text-white sm:text-4xl">Overview</h1>
          <p className="text-sm text-white/55">
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

      {/* Four headline numbers — the focal point */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Open findings"
          value={openFindings}
          caption={`${vulnFindings.length} total`}
        />
        <StatCard
          label="Active indicators"
          value={activeIndicators}
          caption={`${actors} actor${actors === 1 ? "" : "s"}, ${malware} malware`}
        />
        <StatCard
          label="Controls tracked"
          value={controlsTracked}
          caption="Status: claimed"
        />
        <StatCard
          label="Pending remediation"
          value={pendingRemediation}
          caption="Simulated"
        />
      </div>

      {/* Activity */}
      <ActivityCard />

      {/* Quiet engine line */}
      <EngineStatus />
    </div>
  );
}
