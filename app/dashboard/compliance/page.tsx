"use client";

import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { Panel } from "@/components/dashboard/ui/panel";
import { LiveControlTable, ControlTable } from "@/components/dashboard/compliance/control-table";
import { ComplianceCaveat } from "@/components/dashboard/compliance/compliance-caveat";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { complianceFrameworks } from "@/lib/mock-data";

export default function CompliancePage() {
  const { data, isLoading, isError, error, refetch } = useComplianceMappings();

  const mappings = data?.mappings ?? [];
  const hasLive = mappings.length > 0;

  // Coverage is derived only from real records: the live engine ledger when
  // present, otherwise the sample frameworks. Never a hardcoded figure.
  const liveTotal = mappings.length;
  const liveCompliant = mappings.filter((m) => m.status.toUpperCase() === "COMPLIANT").length;

  const mockCovered = complianceFrameworks.reduce((a, f) => a + f.summary.covered_count, 0);
  const mockTotal = complianceFrameworks.reduce((a, f) => a + f.summary.total_controls_tracked, 0);

  const covered = hasLive ? liveCompliant : mockCovered;
  const total = hasLive ? liveTotal : mockTotal;
  const coverage = total > 0 ? Math.round((covered / total) * 100) : 0;
  const sourceLabel = hasLive
    ? `${data?.framework ?? "Engine"} v${data?.version ?? "1.0.0"} · reported by engine, not independently verified`
    : "Sample data · not yet verified against live findings";

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Compliance Mapping"
        subtitle="Findings rolled up against NIST SP 800-53 and SOC 2 controls."
        action={<ComplianceCaveat />}
      />

      {/* Coverage headline — the one focal point for this view */}
      {isLoading ? (
        <section className="flex flex-col gap-5 rounded-2xl bg-white/[0.04] p-6">
          <div className="h-12 w-32 animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-1.5 w-full animate-pulse rounded-full bg-white/[0.06]" />
        </section>
      ) : (
        <section className="flex flex-col gap-5 rounded-2xl bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm text-white/55">Control coverage</span>
              <span className="font-heading text-5xl font-semibold tabular-nums text-white">
                {coverage}%
              </span>
            </div>
            <span className="text-sm text-white/55">
              {covered} of {total} controls {hasLive ? "compliant" : "covered"}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${coverage}%` }}
            />
          </div>
          <p className="text-sm text-white/40">{sourceLabel}</p>
        </section>
      )}

      {/* Controls list — quiet, keeps the "what it checks" column + tooltips */}
      {!isLoading && (
        <div className="flex flex-col gap-10">
          {isError ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white/[0.04] p-6">
              <p className="text-sm text-white/55">
                Live engine unreachable, showing sample controls.{" "}
                {error instanceof Error ? error.message : ""}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/[0.1] hover:text-white"
              >
                Retry
              </button>
            </div>
          ) : null}

          {hasLive ? (
            <Panel title="Controls" description="Control-level status from the engine ledger.">
              <LiveControlTable mappings={mappings} />
            </Panel>
          ) : (
            complianceFrameworks.map((f) => (
              <Panel
                key={f.name}
                title={f.name.startsWith("NIST") ? "NIST SP 800-53" : "SOC 2 Type II"}
                description={`${f.summary.covered_count} of ${f.summary.total_controls_tracked} controls covered in the sample.`}
              >
                <ControlTable families={f.control_families} />
              </Panel>
            ))
          )}
        </div>
      )}

      {/* Per-finding CVE to control matrix (every status displays CLAIMED) */}
      <DashboardTable />
    </div>
  );
}
