import type { Metadata } from "next";

import { complianceFrameworks, type ComplianceFramework } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExportReportButton } from "@/components/dashboard/compliance/export-report-button";

export const metadata: Metadata = { title: "Compliance Mapping" };

function statusVariant(status: string): "low" | "medium" | "high" | "outline" {
  const s = status.toLowerCase();
  if (s === "compliant") return "low";
  if (s.includes("review")) return "medium";
  if (s.includes("action")) return "high";
  return "outline";
}

export default function CompliancePage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold text-foreground">
            Compliance Mapping
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Control coverage as reported in the compliance ledger. Figures are
            the ledger&apos;s own summary values — the sample has no link back to
            the vulnerability findings, so none is shown.
          </p>
        </div>
        <ExportReportButton />
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {complianceFrameworks.map((framework) => (
          <FrameworkCard key={framework.name} framework={framework} />
        ))}
      </div>
    </div>
  );
}

function FrameworkCard({ framework }: { framework: ComplianceFramework }) {
  const { total_controls_tracked, covered_count, open_findings_count } =
    framework.summary;
  const coverage =
    total_controls_tracked > 0
      ? Math.round((covered_count / total_controls_tracked) * 100)
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{framework.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Summary numbers (as-given) */}
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Tracked" value={total_controls_tracked} accent="text-foreground" />
          <Stat label="Covered" value={covered_count} accent="text-primary" />
          <Stat label="Open" value={open_findings_count} accent="text-high" />
        </div>

        {/* Coverage bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Coverage</span>
            <span className="tabular-nums text-foreground">{coverage}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${coverage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {covered_count} of {total_controls_tracked} tracked controls
          </p>
        </div>

        {/* Control families listed in the ledger */}
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Control families
          </span>
          <ul className="divide-y divide-border rounded-lg border border-border">
            {framework.control_families.map((family) => (
              <li key={family.id} className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-primary">{family.id}</span>
                    <span className="text-sm font-medium text-foreground">
                      {family.name}
                    </span>
                  </div>
                  <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
                    {family.details}
                  </p>
                </div>
                <Badge variant={statusVariant(family.status)} className="shrink-0">
                  {family.status}
                </Badge>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground/70">
            {framework.control_families.length} of {total_controls_tracked} tracked
            controls detailed in the sample.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <p className={`mt-1 text-xl font-semibold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}
