import type { Metadata } from "next";
import { Download, MoreHorizontal, Radio, ShieldCheck } from "lucide-react";

import { complianceFrameworks, type ComplianceFramework } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ControlTable } from "@/components/dashboard/compliance/control-table";
import { ComplianceCaveat } from "@/components/dashboard/compliance/compliance-caveat";
import { ComplianceStats } from "@/components/dashboard/compliance/compliance-stats";
import { ComplianceAuditMatrix } from "@/components/dashboard/compliance/compliance-audit-matrix";

export const metadata: Metadata = { title: "Compliance Mapping" };

/** Trim the long ledger names to a short tab label. */
function shortLabel(name: string): string {
  if (name.startsWith("NIST")) return "NIST 800-53";
  if (name.startsWith("SOC")) return "SOC 2";
  return name;
}

export default function CompliancePage() {
  const frameworks = complianceFrameworks;

  if (frameworks.length === 0) {
    return (
      <Card size="sm">
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No frameworks in the compliance ledger sample.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Compliance Mapping Console
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
            <Radio className="size-3 text-primary animate-pulse" />
            <span className="font-medium text-foreground">Audit Ledger Live</span>
            <ComplianceCaveat />
          </div>

          <Button variant="default" size="sm" className="h-8 gap-1.5 px-3 text-xs font-semibold">
            <Download className="size-3.5" />
            Export Compliance Report
          </Button>

          <Button variant="outline" size="icon-sm" className="h-8 size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </header>

      {/* Top 4 Compliance Metric Cards */}
      <ComplianceStats />

      {/* Framework Tabs & Coverage View */}
      <Tabs defaultValue={frameworks[0].name} className="gap-4">
        <TabsList>
          {frameworks.map((f) => (
            <TabsTrigger key={f.name} value={f.name}>
              {shortLabel(f.name)}
            </TabsTrigger>
          ))}
        </TabsList>

        {frameworks.map((f) => (
          <TabsContent key={f.name} value={f.name}>
            <FrameworkPanel framework={f} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function FrameworkPanel({ framework }: { framework: ComplianceFramework }) {
  const { total_controls_tracked, covered_count, open_findings_count } =
    framework.summary;
  const coverage =
    total_controls_tracked > 0
      ? Math.round((covered_count / total_controls_tracked) * 100)
      : 0;

  return (
    <div className="space-y-4 pt-1">
      {/* Compact Coverage Indicator Bar */}
      <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="text-2xl leading-none font-bold tabular-nums text-foreground">
            {coverage}
            <span className="text-sm font-normal text-muted-foreground">%</span>
          </span>
          <div className="w-48">
            <Progress value={coverage} className="h-1.5" />
            <p className="mt-1 text-[11px] font-medium text-muted-foreground">
              {covered_count} of {total_controls_tracked} controls covered
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
            MET: {covered_count}
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-medium/15 px-2 py-0.5 text-[10px] font-semibold text-medium border border-medium/20">
            GAPS: {total_controls_tracked - covered_count}
          </span>
          {open_findings_count > 0 && (
            <span className="inline-flex items-center gap-1 rounded bg-destructive/15 px-2 py-0.5 text-[10px] font-semibold text-destructive border border-destructive/20">
              OPEN: {open_findings_count}
            </span>
          )}
        </div>
      </div>

      {/* 2-Column Grid: Control Table + Audit Matrix Side Panel */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ControlTable families={framework.control_families} />
        <ComplianceAuditMatrix />
      </div>
    </div>
  );
}
