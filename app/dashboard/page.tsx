import type { Metadata } from "next";

import { stixObjects, stixEdges } from "@/lib/mock-data";
import { ThreatView } from "@/components/dashboard/threat/threat-view";

export const metadata: Metadata = { title: "Threat Intelligence" };

export default function ThreatIntelligencePage() {
  // Static mock data (stix_stream_sample.json) — no live feed in this phase.
  return <ThreatView objects={stixObjects} edges={stixEdges} />;
}
