import type { Metadata } from "next";
import { Download, MoreHorizontal, Radio, ShieldAlert } from "lucide-react";

import { stixObjects } from "@/lib/mock-data";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ThreatStats } from "@/components/dashboard/threat/threat-stats";
import { ThreatFeedTable } from "@/components/dashboard/threat/threat-feed-table";
import { ThreatProtectionMatrix } from "@/components/dashboard/threat/threat-protection-matrix";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Threat Intelligence" };

export default function ThreatIntelligencePage() {
  return (
    <div className="space-y-4">
      {/* Header Toolbar */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <ShieldAlert className="size-6 text-primary" />
            Threat Intelligence Console
          </h1>
          <p className="text-xs text-muted-foreground">
            Real-time STIX 2.1 threat feed, attack vector graphs, &amp; threat indicators
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card px-3 py-1.5 text-xs text-muted-foreground shadow-2xs">
            <Radio className="size-3 text-primary animate-pulse" />
            <span className="font-medium text-foreground">STIX 2.1 Feed Active</span>
          </div>

          <Button variant="default" size="sm" className="h-8 gap-1.5 px-3 text-xs font-semibold">
            <Download className="size-3.5" />
            Export STIX Feed
          </Button>

          <Button variant="outline" size="icon-sm" className="h-8 size-8">
            <MoreHorizontal className="size-4" />
          </Button>
        </div>
      </header>

      {/* Top 4 Threat Metric Cards */}
      <ThreatStats />

      {/* Interactive Activity Chart */}
      <ChartAreaInteractive />

      {/* Replaced Bottom Section: Live Threat Feed Stream Table & Protection Matrix */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <ThreatFeedTable objects={stixObjects} />
        <ThreatProtectionMatrix />
      </div>
    </div>
  );
}
