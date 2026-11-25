import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import { requireMasterAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { demoRequest, type DemoRequest } from "@/lib/db/schema";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { DemoRequestsTable } from "@/components/admin/demo-requests-table";

export const metadata: Metadata = { title: "Demo requests" };

export const dynamic = "force-dynamic";

/**
 * Founders-only (master tenant) list of demo requests captured from the public
 * landing CTA. Leads are global (not tenant-scoped); only the founders see them.
 */
export default async function DemoRequestsPage() {
  await requireMasterAdmin();

  let requests: DemoRequest[] = [];
  try {
    requests = await db
      .select()
      .from(demoRequest)
      .orderBy(desc(demoRequest.createdAt))
      .limit(200);
  } catch {
    // No DB configured — render the empty state.
  }

  const newCount = requests.filter((r) => r.status === "new").length;

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-black sm:text-4xl">
          Demo requests
        </h1>
        <p className="text-sm text-black/55">
          Leads captured from the landing page &ldquo;Request a demo&rdquo; form.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 sm:max-w-md">
        <StatCard label="Total" value={requests.length} caption="all time" />
        <StatCard label="New" value={newCount} caption="not yet reviewed" />
      </div>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Requests</h2>
          <span className="text-sm tabular-nums text-black/55">{requests.length} total</span>
        </div>
        <DemoRequestsTable
          requests={requests.map((r) => ({
            id: r.id,
            email: r.email,
            status: r.status,
            createdAt: r.createdAt,
          }))}
        />
      </section>
    </div>
  );
}
