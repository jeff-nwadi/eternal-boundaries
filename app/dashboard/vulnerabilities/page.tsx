import type { Metadata } from "next";
import { TrendingDown, TrendingUp } from "lucide-react";

import { vulnSummary, vulnFindings } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { VulnTable } from "@/components/dashboard/vulnerabilities/vuln-table";

export const metadata: Metadata = { title: "Vulnerabilities" };

const SEVERITIES = [
  { key: "CRITICAL", label: "Critical", color: "bg-critical", text: "text-critical" },
  { key: "HIGH", label: "High", color: "bg-high", text: "text-high" },
  { key: "MEDIUM", label: "Medium", color: "bg-medium", text: "text-medium" },
  { key: "LOW", label: "Low", color: "bg-low", text: "text-low" },
] as const;

export default function VulnerabilitiesPage() {
  const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of vulnFindings) {
    const key = f.severity.toUpperCase();
    if (key in counts) counts[key] += 1;
  }
  const total = vulnSummary.total_vulnerabilities;
  const trendDown = vulnSummary.trend.toLowerCase() === "decreasing";
  const TrendIcon = trendDown ? TrendingDown : TrendingUp;

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold text-foreground">Vulnerabilities</h1>
        <p className="text-sm text-muted-foreground">
          Scan results from the sample, filterable by severity.
        </p>
      </header>

      {/* Executive summary rollup */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Total
              </span>
              <span
                className={`flex items-center gap-1 text-xs ${trendDown ? "text-low" : "text-high"}`}
              >
                <TrendIcon strokeWidth={1.75} className="size-3.5" />
                {vulnSummary.trend}
              </span>
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-foreground">
              {total}
            </p>
          </CardContent>
        </Card>
        <StatCard label="Critical" value={vulnSummary.critical_count} accent="text-critical" />
        <StatCard label="High" value={vulnSummary.high_count} accent="text-high" />
        <StatCard label="Medium" value={vulnSummary.medium_count} accent="text-medium" />
        <StatCard label="Remediated" value={vulnSummary.remediated_count} accent="text-low" />
      </div>

      {/* Severity distribution */}
      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Severity distribution
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {total} findings
            </span>
          </div>
          <div className="space-y-2">
            {SEVERITIES.map((sev) => {
              const count = counts[sev.key];
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={sev.key} className="flex items-center gap-3">
                  <span className={`w-16 text-xs ${sev.text}`}>{sev.label}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${sev.color}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs tabular-nums text-muted-foreground">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Findings table */}
      <VulnTable findings={vulnFindings} />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <Card>
      <CardContent className="p-4 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <p className={`mt-2 text-2xl font-semibold tabular-nums ${accent}`}>
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
