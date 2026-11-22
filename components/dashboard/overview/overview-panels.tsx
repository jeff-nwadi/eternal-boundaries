import { Panel } from "@/components/dashboard/ui/panel";
import type { VulnFinding, StixObject, ComplianceFramework } from "@/lib/mock-data";

const SEVERITY_RANK: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "var(--severity-critical)",
  HIGH: "var(--severity-high)",
  MEDIUM: "var(--severity-medium)",
  LOW: "var(--severity-low)",
};

function sevKey(s: string): string {
  return s.toUpperCase();
}

/** Small severity chip: colored dot + label. */
export function SeverityBadge({ severity }: { severity: string }) {
  const key = sevKey(severity);
  const color = SEVERITY_COLOR[key] ?? "var(--severity-low)";
  const label = key.charAt(0) + key.slice(1).toLowerCase();
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-medium text-black/70">
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {label}
    </span>
  );
}

/**
 * Top findings, highest severity first — the "what needs attention" list.
 * Ranked from the real sample findings; nothing invented.
 */
export function TopFindings({ findings }: { findings: VulnFinding[] }) {
  const ranked = [...findings].sort(
    (a, b) => (SEVERITY_RANK[sevKey(a.severity)] ?? 9) - (SEVERITY_RANK[sevKey(b.severity)] ?? 9),
  );

  return (
    <Panel title="Top findings" description="Highest severity first · sample data">
      <ol className="flex flex-col gap-3.5">
        {ranked.map((f, i) => (
          <li key={`${f.cve_id}-${i}`} className="flex items-center gap-3 text-sm">
            <span className="w-4 shrink-0 tabular-nums text-black/40">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate text-black" title={f.vulnerability_name}>
              {f.vulnerability_name}
            </span>
            <SeverityBadge severity={f.severity} />
          </li>
        ))}
        {ranked.length === 0 ? (
          <li className="text-sm text-black/55">No findings in the sample.</li>
        ) : null}
      </ol>
    </Panel>
  );
}

/**
 * Active indicators from the STIX sample feed (actors, malware, vulnerabilities).
 */
export function ActiveIndicators({ objects }: { objects: StixObject[] }) {
  const typeLabel: Record<string, string> = {
    "threat-actor": "Actor",
    malware: "Malware",
    vulnerability: "Vulnerability",
  };
  const items = objects.filter((o) => o.type in typeLabel);

  return (
    <Panel title="Active indicators" description="From the STIX sample feed">
      <ul className="flex flex-col gap-3.5">
        {items.map((o) => (
          <li key={o.id} className="flex items-center gap-3 text-sm">
            <span className="w-24 shrink-0 text-xs uppercase tracking-wide text-black/40">
              {typeLabel[o.type]}
            </span>
            <span className="min-w-0 flex-1 truncate text-black" title={o.name}>
              {o.name}
            </span>
          </li>
        ))}
        {items.length === 0 ? (
          <li className="text-sm text-black/55">No indicators in the sample.</li>
        ) : null}
      </ul>
    </Panel>
  );
}

/**
 * Open findings grouped by affected asset, with a proportional bar — the
 * "where exposure sits" view. Derived from the real sample findings.
 */
export function FindingsByAsset({ findings }: { findings: VulnFinding[] }) {
  const counts = new Map<string, number>();
  for (const f of findings) {
    counts.set(f.affected_asset, (counts.get(f.affected_asset) ?? 0) + 1);
  }
  const rows = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const max = rows.reduce((m, [, n]) => Math.max(m, n), 0) || 1;

  return (
    <Panel title="Findings by asset" description="Where exposure sits · sample data">
      <div className="flex flex-col gap-4">
        {rows.map(([asset, count]) => (
          <div key={asset} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="min-w-0 truncate text-black" title={asset}>{asset}</span>
              <span className="shrink-0 tabular-nums text-black/55">{count}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
              <span
                className="block h-full rounded-full bg-primary"
                style={{ width: `${(count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {rows.length === 0 ? (
          <p className="text-sm text-black/55">No findings in the sample.</p>
        ) : null}
      </div>
    </Panel>
  );
}

/**
 * Control coverage per framework — covered vs tracked, from the sample ledger.
 * Status is reported by the sample, not independently verified.
 */
export function ControlCoverage({ frameworks }: { frameworks: ComplianceFramework[] }) {
  return (
    <Panel title="Control coverage" description="Covered vs tracked · sample data">
      <div className="flex flex-col gap-5">
        {frameworks.map((fw) => {
          const { covered_count: covered, total_controls_tracked: total } = fw.summary;
          const pct = total > 0 ? Math.round((covered / total) * 100) : 0;
          const name = fw.name.startsWith("NIST") ? "NIST SP 800-53" : fw.name;
          return (
            <div key={fw.name} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="truncate text-black">{name}</span>
                <span className="shrink-0 tabular-nums text-black/55">
                  {covered}/{total} · {pct}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/[0.06]">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}
