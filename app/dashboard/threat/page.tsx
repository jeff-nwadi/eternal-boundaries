import { stixObjects, stixEdges } from "@/lib/mock-data";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { ThreatIndicators } from "@/components/dashboard/threat/threat-indicators";
import { LiveThreatFeed } from "@/components/dashboard/threat/live-threat-feed";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

export default function ThreatIntelligencePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Threat Intelligence"
        subtitle="Live STIX 2.1 objects from the Layer-Zero gate, plus a sample feed you can explore for relationship chains."
      />

      {/* Live engine feed (engine-reported, not independently verified). */}
      <LiveThreatFeed />

      {/* Sample feed with the relationship-chain drill-down (no live relationships yet). */}
      <ThreatIndicators objects={stixObjects} edges={stixEdges} />

      <DashboardTable />
    </div>
  );
}
