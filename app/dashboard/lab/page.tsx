import type { Metadata } from "next";

import { readConsumptionRows } from "@/lib/engine-lab/consumption";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { RetentionGrid } from "@/components/dashboard/engine-lab/retention-grid";

export const metadata: Metadata = { title: "Engine Lab" };
export const dynamic = "force-dynamic";

export default async function EngineLabPage() {
  const rows = await readConsumptionRows();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Engine Lab"
        subtitle="Offline benchmarks, parser studies and finite models from the engine handoff. Not live telemetry."
      />
      <RetentionGrid rows={rows} />
    </div>
  );
}
