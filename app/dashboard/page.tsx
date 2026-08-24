import type { Metadata } from "next";
import {
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  MoreHorizontal,
  Shield,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import { requireAuth } from "@/lib/auth-guards";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThreatTacticsMatrix } from "@/components/dashboard/overview/threat-tactics-matrix";
import { ThreatMap } from "@/components/dashboard/overview/threat-map";
import { AlertCenter } from "@/components/dashboard/overview/alert-center";
import { SecurityThreatsTable } from "@/components/dashboard/overview/security-threats-table";
import { ResponseDistributionChart } from "@/components/dashboard/overview/response-distribution-chart";

export const metadata: Metadata = { title: "Overview Dashboard" };

export default async function OverviewPage() {
  const session = await requireAuth();
  const userName = session.user.name ?? "Schweid";

  return (
    <div className="space-y-4">
      {/* Top Header Row with Date & Action Controls */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {userName}
          </h1>
          <p className="text-xs text-muted-foreground">
            Latest security activity overview
          </p>
        </div>

        {/* Date Selector & Action Buttons (matching screenshot) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
            <Calendar className="size-3.5" />
            <span className="font-medium text-foreground">Jan 15 - Jan 19, 2026</span>
            <ChevronDown className="size-3" />
          </div>

          <Button variant="default" size="sm" className="h-8 gap-1.5 px-3 text-xs font-semibold">
            <Download className="size-3.5" />
            Export
          </Button>

          <Button variant="outline" size="icon-sm" className="h-8 size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </header>

      {/* Top Metric Cards Row (4 Cards) */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Card 1: Threats Blocked */}
        <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Threats Blocked
                </span>
                <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                  14,832
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                  <TrendingUp className="size-3" />
                  <span>+42% from last week</span>
                </div>
              </div>
              <span className="flex size-8 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 text-blue-400">
                <Shield className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Active Incidents */}
        <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Active Incidents
                </span>
                <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                  7
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                    <AlertTriangle className="size-2.5" />
                    2 Critical
                  </span>
                </div>
              </div>
              <span className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
                <AlertTriangle className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Risk Score */}
        <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Risk Score
                </span>
                <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                  94<span className="text-base font-normal text-muted-foreground">/100</span>
                </p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                  <CheckCircle2 className="size-3" />
                  <span>Excellent</span>
                </div>
              </div>
              <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <TrendingUp className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Compliance */}
        <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
          <CardContent className="p-0">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Compliance
                </span>
                <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                  98.3%
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                    <CheckCircle2 className="size-2.5" />
                    SOC 2 Certified
                  </span>
                </div>
              </div>
              <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section (3 Grid Columns) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ThreatTacticsMatrix />
        <ThreatMap />
        <AlertCenter />
      </div>

      {/* Bottom Section (2 Grid Columns) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <SecurityThreatsTable />
        <ResponseDistributionChart />
      </div>
    </div>
  );
}
