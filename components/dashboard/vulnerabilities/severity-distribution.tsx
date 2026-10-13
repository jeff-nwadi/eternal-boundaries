import { Panel } from "@/components/dashboard/ui/panel";

const SEVERITIES = [
  { key: "CRITICAL", label: "Critical", color: "var(--severity-critical)" },
  { key: "HIGH", label: "High", color: "var(--severity-high)" },
  { key: "MEDIUM", label: "Medium", color: "var(--severity-medium)" },
  { key: "LOW", label: "Low", color: "var(--severity-low)" },
] as const;

/**
 * Severity distribution as one segmented bar plus a legend of counts — a single
 * calm visual instead of a busy chart. Counts are passed in (derived from the
 * real findings), never invented.
 */
export function SeverityDistribution({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const total = SEVERITIES.reduce((sum, s) => sum + (counts[s.key] ?? 0), 0);

  return (
    <Panel title="By severity" description={`${total} findings`}>
      {/* Segmented bar */}
      <div className="flex h-2.5 w-full gap-1 overflow-hidden" aria-hidden>
        {total === 0 ? (
          <span className="h-full flex-1 rounded-full bg-white/[0.08]" />
        ) : (
          SEVERITIES.map((s) => {
            const count = counts[s.key] ?? 0;
            if (count === 0) return null;
            return (
              <span
                key={s.key}
                className="h-full rounded-full"
                style={{ flexGrow: count, backgroundColor: s.color }}
              />
            );
          })
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        {SEVERITIES.map((s) => (
          <div key={s.key} className="flex items-center gap-2.5">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: s.color }}
              aria-hidden
            />
            <span className="text-sm text-white/55">{s.label}</span>
            <span className="text-sm font-medium tabular-nums text-white">
              {counts[s.key] ?? 0}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}
