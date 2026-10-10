"use client";

import { Download, MoreHorizontal, Radio, AlertCircle, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LiveControlTable, ControlTable } from "@/components/dashboard/compliance/control-table";
import { ComplianceCaveat } from "@/components/dashboard/compliance/compliance-caveat";
import { ComplianceStats } from "@/components/dashboard/compliance/compliance-stats";
import { ComplianceAuditMatrix } from "@/components/dashboard/compliance/compliance-audit-matrix";
import { DashboardTable } from "@/components/dashboard/DashboardTable";
import { complianceFrameworks } from "@/lib/mock-data";

export default function CompliancePage() {
  const { data, isLoading, isError, error, refetch } = useComplianceMappings();

  const mappings = data?.mappings ?? [];
  const frameworkName = data?.framework ?? "ETB Layer-Zero Framework";
  const frameworkVersion = data?.version ?? "1.0.0";

  const totalControls = mappings.length;
  const compliantCount = mappings.filter(m => m.status.toUpperCase() === "COMPLIANT").length;
  const coverage = totalControls > 0 ? Math.round((compliantCount / totalControls) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Compliance Mapping Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Framework &amp; control-level audit summary from the backend engine.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
            <Radio className="size-3 text-primary animate-pulse" />
            <span className="font-medium text-foreground">
              {isLoading ? "Connecting to Engine..." : isError ? "Engine Connection Error" : "Audit Ledger Live"}
            </span>
            <ComplianceCaveat />
          </div>

          <Button variant="default" size="sm" className="h-8 gap-1.5 px-3 text-xs font-semibold">
            <Download className="size-3.5" />
            Export Compliance Report
          </Button>

          <Button variant="outline" size="icon-sm" className="h-8 size-8" onClick={() => refetch()}>
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {/* Top 4 Compliance Metric Cards */}
      <ComplianceStats mappings={data ? mappings : undefined} />

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground flex flex-col items-center gap-3">
            <Loader2 className="size-6 animate-spin text-primary" />
            <span>Fetching live compliance mappings from engine...</span>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {isError && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground">Engine Connection Failed</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {error instanceof Error ? error.message : "Could not retrieve live compliance mappings."}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="shrink-0 gap-1.5 text-xs">
              <RefreshCw className="size-3.5" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Live Data View */}
      {!isLoading && !isError && data && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-4 py-2.5 shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl leading-none font-bold tabular-nums text-foreground">
                {coverage}
                <span className="text-sm font-normal text-muted-foreground">%</span>
              </span>
              <div className="w-48">
                <Progress value={coverage} className="h-1.5" />
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {compliantCount} of {totalControls} controls compliant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                MET: {compliantCount}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-medium/15 px-2 py-0.5 text-[10px] font-semibold text-medium border border-medium/20">
                GAPS: {totalControls - compliantCount}
              </span>
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-foreground border border-border">
                {frameworkName} v{frameworkVersion}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <LiveControlTable mappings={mappings} />
            <ComplianceAuditMatrix />
          </div>
        </div>
      )}

      {/* Fallback to Mock Framework Tabs if no live data returned or while offline */}
      {!isLoading && !data && complianceFrameworks.length > 0 && (
        <Tabs defaultValue={complianceFrameworks[0].name} className="gap-4">
          <TabsList>
            {complianceFrameworks.map((f) => (
              <TabsTrigger key={f.name} value={f.name}>
                {f.name.startsWith("NIST") ? "NIST 800-53" : "SOC 2"}
              </TabsTrigger>
            ))}
          </TabsList>

          {complianceFrameworks.map((f) => (
            <TabsContent key={f.name} value={f.name}>
              <div className="space-y-4 pt-1">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
                  <ControlTable families={f.control_families} />
                  <ComplianceAuditMatrix />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Standalone CVE Control Enforcement Matrix Panel */}
      <DashboardTable />
    </div>
  );
}
