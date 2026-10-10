import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { stixObjects, stixEdges } from "@/lib/mock-data";
import { buildChain, IndicatorDetail } from "@/components/dashboard/threat/indicator-detail";

export const dynamic = "force-dynamic";

export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const selected = stixObjects.find((o) => o.id === decodeURIComponent(id));
  if (!selected) notFound();

  const chain = buildChain(stixObjects, stixEdges);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard/threat"
        className="inline-flex items-center gap-2 text-sm text-white/55 transition-colors hover:text-white"
      >
        <ArrowLeft className="size-4" strokeWidth={1.75} />
        Back to indicators
      </Link>

      <section className="rounded-2xl bg-white/[0.04]">
        <IndicatorDetail selected={selected} chain={chain} />
      </section>
    </div>
  );
}
