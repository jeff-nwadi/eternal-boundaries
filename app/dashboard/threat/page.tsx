"use client";

import { Download, MoreHorizontal, Radio, RefreshCw } from "lucide-react";
import { stixObjects } from "@/lib/mock-data";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ThreatStats } from "@/components/dashboard/threat/threat-stats";
import { ThreatFeedTable } from "@/components/dashboard/threat/threat-feed-table";
import { ThreatProtectionMatrix } from "@/components/dashboard/threat/threat-protection-matrix";
import { Button } from "@/components/ui/button";
import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";

export default function ThreatIntelligencePage() {
  const { isLoading, isError, refetch } = useComplianceMappings();

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            Threat Intelligence Console
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            STIX 2.1 Threat Intel stream &amp; boundary protection status.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
            <Radio className="size-3 text-primary animate-pulse" />
            <span className="font-medium text-foreground">
              {isLoading ? "Connecting to Engine..." : isError ? "Engine Connection Error" : "Engine Stream Active"}
            </span>
          </div>

          <Button variant="default" size="sm" className="h-8 gap-1.5 px-3 text-xs font-semibold">
            <Download className="size-3.5" />
            Export STIX Feed
          </Button>

          <Button variant="outline" size="icon-sm" className="h-8 size-8" onClick={() => refetch()}>
            <RefreshCw className={`size-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {/* Top 4 Threat Metric Cards */}
      <ThreatStats />

      {/* Interactive Activity Chart */}
      <ChartAreaInteractive />

      {/* Bottom Section: STIX Threat Feed Stream Table & Protection Matrix */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ThreatFeedTable objects={stixObjects} />
        <ThreatProtectionMatrix />
      </div>
    </div>
  );
}
