import type { Metadata } from "next";

import { vulnSummary, vulnFindings } from "@/lib/mock-data";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { SeverityDistribution } from "@/components/dashboard/vulnerabilities/severity-distribution";
import { VulnTable } from "@/components/dashboard/vulnerabilities/vuln-table";

export const metadata: Metadata = { title: "Vulnerabilities" };

export default function VulnerabilitiesPage() {
  const counts: Record<string, number> = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const f of vulnFindings) {
    const key = f.severity.toUpperCase();
    if (key in counts) counts[key] += 1;
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        title="Vulnerabilities"
        subtitle="Weak spots in your systems, ranked by severity. Sample data."
      />

      {/* Executive summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard label="Total" value={vulnSummary.total_vulnerabilities} caption={vulnSummary.trend} />
        <StatCard label="Critical" value={vulnSummary.critical_count} valueClassName="text-critical" />
        <StatCard label="High" value={vulnSummary.high_count} valueClassName="text-high" />
        <StatCard label="Medium" value={vulnSummary.medium_count} valueClassName="text-medium" />
        <StatCard label="Fixed" value={vulnSummary.remediated_count} valueClassName="text-low" />
      </div>

      {/* Distribution */}
      <SeverityDistribution counts={counts} />

      {/* Findings */}
      <VulnTable findings={vulnFindings} />
    </div>
  );
}
