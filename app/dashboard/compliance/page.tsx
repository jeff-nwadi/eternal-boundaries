"use client";

import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { Panel } from "@/components/dashboard/ui/panel";
import { LiveControlTable, ControlTable } from "@/components/dashboard/compliance/control-table";
import { CoverageCard } from "@/components/dashboard/compliance/coverage-card";
import { ComplianceCaveat } from "@/components/dashboard/compliance/compliance-caveat";
import { ExportReportButton } from "@/components/dashboard/compliance/export-report-button";
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
  const sourceLabel = hasLive
    ? `${data?.framework ?? "Engine"} v${data?.version ?? "1.0.0"} (engine's self-reported label) · not independently verified`
    : "Sample data · not yet verified against live findings";

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Compliance Mapping"
        subtitle="Findings rolled up against NIST SP 800-53 and SOC 2 controls."
        action={<ComplianceCaveat />}
      />

      <div className="flex justify-end">
        <ExportReportButton
          frameworks={complianceFrameworks}
          mappings={mappings}
          isLive={hasLive}
          covered={covered}
          total={total}
          sourceLabel={sourceLabel}
          disabled={isLoading}
        />
      </div>

      {/* Coverage summary — the one focal point for this view */}
      {isLoading ? (
        <section className="flex items-center gap-10 rounded-2xl bg-black/[0.04] p-6">
          <div className="size-[140px] shrink-0 animate-pulse rounded-full bg-black/[0.06]" />
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-black/[0.06]" />
        </section>
      ) : (
        <CoverageCard
          covered={covered}
          total={total}
          sourceLabel={sourceLabel}
          hasLive={hasLive}
        />
      )}

      {/* Controls list — quiet, keeps the "what it checks" column + tooltips */}
      {!isLoading && (
        <div className="flex flex-col gap-10">
          {isError ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-black/[0.04] p-6">
              <p className="text-sm text-black/55">
                {error instanceof Error && error.message.includes("404")
                  ? "Live compliance feed isn’t available on this engine yet — showing sample controls."
                  : "Live engine unreachable — showing sample controls."}
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                className="rounded-lg bg-black/[0.06] px-3 py-1.5 text-sm font-medium text-black/80 hover:bg-black/[0.1] hover:text-black"
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
