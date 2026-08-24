"use client";

import * as React from "react";
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { vulnFindings, type VulnFinding } from "@/lib/mock-data";

export type SeverityDatum = { label: string; count: number; color: string };

/** Horizontal bar chart showing total findings distribution by severity */
export function SeverityChart({ data }: { data: SeverityDatum[] }) {
  return (
    <ResponsiveContainer width="100%" height={168}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 0, right: 20, bottom: 0, left: 0 }}
        barCategoryGap={8}
      >
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={64}
          tickLine={false}
          axisLine={false}
          tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
        />
        <Bar dataKey="count" radius={4} barSize={16} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.color} />
          ))}
          <LabelList
            dataKey="count"
            position="right"
            className="fill-muted-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

const statusChartConfig = {
  open: {
    label: "Still open",
    color: "var(--severity-critical)",
  },
  patched: {
    label: "Fixed",
    color: "var(--severity-low)",
  },
} satisfies ChartConfig;

export type VulnStatusSeverityItem = {
  severity: string;
  open: number;
  patched: number;
  openColor: string;
};

interface VulnStatusBySeverityChartProps {
  findings?: VulnFinding[];
  className?: string;
}

/**
 * Stacked bar chart with line-indicator tooltip showing Open vs. Patched findings
 * grouped by severity level (Critical, High, Medium, Low).
 */
export function VulnStatusBySeverityChart({
  findings = vulnFindings,
  className,
}: VulnStatusBySeverityChartProps) {
  // Aggregate open vs patched counts per severity
  const chartData = React.useMemo(() => {
    const severities = [
      { key: "CRITICAL", label: "Critical", openColor: "var(--severity-critical)" },
      { key: "HIGH", label: "High", openColor: "var(--severity-high)" },
      { key: "MEDIUM", label: "Medium", openColor: "var(--severity-medium)" },
      { key: "LOW", label: "Low", openColor: "var(--severity-low)" },
    ];

    return severities.map(({ key, label, openColor }) => {
      const matching = findings.filter(
        (f) => f.severity.toUpperCase() === key
      );
      const open = matching.filter(
        (f) => f.patch_status.toLowerCase() !== "patched"
      ).length;
      const patched = matching.filter(
        (f) => f.patch_status.toLowerCase() === "patched"
      ).length;

      return {
        severity: label,
        open,
        patched,
        openColor,
      };
    });
  }, [findings]);

  return (
    <Card className={className}>
      <CardHeader className="space-y-1 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold text-foreground">
              Fixed vs. still open
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              By severity
            </CardDescription>
          </div>
          <span className="shrink-0 rounded border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
            Sample data
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={statusChartConfig} className="h-[220px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <XAxis
              dataKey="severity"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Bar dataKey="open" stackId="a" radius={[0, 0, 4, 4]} barSize={32}>
              {chartData.map((entry) => (
                <Cell key={entry.severity} fill={entry.openColor} />
              ))}
            </Bar>
            <Bar
              dataKey="patched"
              stackId="a"
              fill="var(--severity-low)"
              radius={[4, 4, 0, 0]}
              barSize={32}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
