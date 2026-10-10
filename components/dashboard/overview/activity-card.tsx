"use client";

import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";

/**
 * Activity over the last 24 hours. The metrics feed exposes no real time-series
 * yet, so this shows the honest dashed empty state. We never fabricate activity.
 * Loading / error / empty states all handled via the live query.
 */
export function ActivityCard() {
  const { isLoading, isError } = useComplianceMappings();

  const message = isLoading
    ? "Checking the engine for activity."
    : isError
      ? "Engine unreachable. Activity appears here once it reports."
      : "No activity yet. Data appears here as the engine reports.";

  return (
    <section className="rounded-2xl bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-white">Activity</h2>
        <span className="text-sm text-white/55">last 24 hours</span>
      </div>

      {/* Dashed-bar empty state */}
      <div
        className="mt-10 flex items-center gap-1.5"
        aria-hidden
      >
        {Array.from({ length: 32 }).map((_, i) => (
          <span key={i} className="h-1.5 flex-1 rounded-full bg-white/[0.08]" />
        ))}
      </div>

      <p className="mt-6 text-sm text-white/55">{message}</p>
    </section>
  );
}
