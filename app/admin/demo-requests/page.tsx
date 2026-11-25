import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import { requireMasterAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { demoRequest, type DemoRequest } from "@/lib/db/schema";
import { StatCard } from "@/components/dashboard/overview/stat-card";

export const metadata: Metadata = { title: "Demo requests" };

export const dynamic = "force-dynamic";

function fmt(date: Date) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

const statusPill: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  reviewed: "bg-black/[0.06] text-black/60",
  archived: "bg-black/[0.04] text-black/45",
};

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
        {requests.length === 0 ? (
          <div className="rounded-2xl bg-black/[0.04] p-6 text-sm text-black/55">
            No demo requests yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-black/[0.04]">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-black/55">
                  <th className="px-6 py-3 font-normal">Email</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                  <th className="px-6 py-3 font-normal">Received</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r) => (
                  <tr key={r.id} className="border-t border-black/[0.06]">
                    <td className="px-6 py-3 font-medium text-black">{r.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                          statusPill[r.status] ?? "bg-black/[0.06] text-black/60"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 tabular-nums text-black/55">{fmt(r.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
