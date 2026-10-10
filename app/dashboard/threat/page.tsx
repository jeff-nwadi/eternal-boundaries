import { stixObjects, stixEdges } from "@/lib/mock-data";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { ThreatIndicators } from "@/components/dashboard/threat/threat-indicators";
import { DashboardTable } from "@/components/dashboard/DashboardTable";

export default function ThreatIntelligencePage() {
  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Threat Intelligence"
        subtitle="STIX 2.1 indicators from the sample feed. Select one to trace how it connects across the boundary."
      />

      <ThreatIndicators objects={stixObjects} edges={stixEdges} />

      <DashboardTable />
    </div>
  );
}
