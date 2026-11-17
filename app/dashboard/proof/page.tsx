import type { Metadata } from "next";

import { readModbusProof } from "@/lib/proof/modbus-proof";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { GateProof } from "@/components/dashboard/proof/gate-proof";

export const metadata: Metadata = { title: "Gate Proof" };
export const dynamic = "force-dynamic";

export default async function GateProofPage() {
  const proof = await readModbusProof();

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Gate Proof"
        subtitle="One real Modbus/TCP attack, sent with the gate off vs on. Lab target, single case."
      />
      <GateProof proof={proof} />
    </div>
  );
}
