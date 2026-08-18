import type { Metadata } from "next";

import { stixObjects, stixEdges } from "@/lib/mock-data";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { ThreatView } from "@/components/dashboard/threat/threat-view";

export const metadata: Metadata = { title: "Threat Intelligence" };

export default function ThreatIntelligencePage() {
  // Static mock data (stix_stream_sample.json) — no live feed in this phase.
  return (
    <div className="space-y-6">
      <ChartAreaInteractive />
      <ThreatView objects={stixObjects} edges={stixEdges} />
    </div>
  );
}
