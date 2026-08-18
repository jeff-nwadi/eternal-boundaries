import type { Metadata } from "next";
import { TrendingDown, TrendingUp } from "lucide-react";

import { vulnSummary, vulnFindings } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { VulnTable } from "@/components/dashboard/vulnerabilities/vuln-table";
import { SeverityChart } from "@/components/dashboard/vulnerabilities/severity-chart";

export const metadata: Metadata = { title: "Vulnerabilities" };

export default function VulnerabilitiesPage() {
  const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of vulnFindings) {
    const key = f.severity.toUpperCase();
    if (key in counts) counts[key] += 1;
  }

  const chartData = [
    { label: "Critical", count: counts.CRITICAL, color: "var(--severity-critical)" },
    { label: "High", count: counts.HIGH, color: "var(--severity-high)" },
    { label: "Medium", count: counts.MEDIUM, color: "var(--severity-medium)" },
    { label: "Low", count: counts.LOW, color: "var(--severity-low)" },
  ];

  const total = vulnSummary.total_vulnerabilities;
  const trendDown = vulnSummary.trend.toLowerCase() === "decreasing";
  const TrendIcon = trendDown ? TrendingDown : TrendingUp;

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Scan results from the sample, filterable by severity.
      </p>

      {/* Executive summary rollup */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Card>
          <CardContent className="px-4 py-4">
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

      {/* Severity distribution (recharts) */}
      <Card>
        <CardContent className="space-y-3 px-5 py-5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">
              Severity distribution
            </span>
            <span className="text-xs tabular-nums text-muted-foreground">
              {total} findings
            </span>
          </div>
          <SeverityChart data={chartData} />
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
      <CardContent className="px-4 py-4">
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
