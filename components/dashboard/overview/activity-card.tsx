"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile";
import { Panel } from "@/components/dashboard/ui/panel";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";

// Sample time-series (no real activity feed exists yet). Labelled "Sample data"
// in the header — never presented as a live signal.
const chartData = [
  { date: "2024-04-01", indicators: 222, alerts: 150 },
  { date: "2024-04-07", indicators: 245, alerts: 180 },
  { date: "2024-04-13", indicators: 342, alerts: 380 },
  { date: "2024-04-19", indicators: 243, alerts: 180 },
  { date: "2024-04-25", indicators: 215, alerts: 250 },
  { date: "2024-05-01", indicators: 165, alerts: 220 },
  { date: "2024-05-07", indicators: 388, alerts: 300 },
  { date: "2024-05-13", indicators: 197, alerts: 160 },
  { date: "2024-05-19", indicators: 235, alerts: 180 },
  { date: "2024-05-25", indicators: 201, alerts: 250 },
  { date: "2024-05-31", indicators: 178, alerts: 230 },
  { date: "2024-06-06", indicators: 294, alerts: 250 },
  { date: "2024-06-12", indicators: 492, alerts: 420 },
  { date: "2024-06-18", indicators: 107, alerts: 170 },
  { date: "2024-06-24", indicators: 132, alerts: 180 },
  { date: "2024-06-30", indicators: 446, alerts: 400 },
];

const chartConfig = {
  indicators: { label: "Indicators", color: "var(--primary)" },
  alerts: { label: "Alerts", color: "rgba(255,255,255,0.25)" },
} satisfies ChartConfig;

export function ActivityCard() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTimeRange("30d");
    }
  }, [isMobile]);

  const filteredData = React.useMemo(() => {
    const referenceDate = new Date("2024-06-30");
    const daysToSubtract = timeRange === "30d" ? 30 : timeRange === "7d" ? 7 : 90;
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return chartData.filter((item) => new Date(item.date) >= startDate);
  }, [timeRange]);

  const rangeControl = (
    <>
      <ToggleGroup
        type="single"
        value={timeRange}
        onValueChange={(v) => v && setTimeRange(v)}
        variant="outline"
        className="hidden sm:flex"
      >
        <ToggleGroupItem value="90d" className="px-3">3 months</ToggleGroupItem>
        <ToggleGroupItem value="30d" className="px-3">30 days</ToggleGroupItem>
        <ToggleGroupItem value="7d" className="px-3">7 days</ToggleGroupItem>
      </ToggleGroup>
      <Select value={timeRange} onValueChange={setTimeRange}>
        <SelectTrigger className="flex w-32 sm:hidden" size="sm" aria-label="Time range">
          <SelectValue placeholder="3 months" />
        </SelectTrigger>
        <SelectContent className="rounded-xl">
          <SelectItem value="90d" className="rounded-lg">3 months</SelectItem>
          <SelectItem value="30d" className="rounded-lg">30 days</SelectItem>
          <SelectItem value="7d" className="rounded-lg">7 days</SelectItem>
        </SelectContent>
      </Select>
    </>
  );

  return (
    <Panel title="Activity" description="Sample data, not a live feed" action={rangeControl}>
      <ChartContainer config={chartConfig} className="aspect-auto h-[260px] w-full">
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillIndicators" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-indicators)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--color-indicators)" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="fillAlerts" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-alerts)" stopOpacity={0.4} />
              <stop offset="95%" stopColor="var(--color-alerts)" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.06)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) =>
              new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
            }
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="alerts"
            type="natural"
            fill="url(#fillAlerts)"
            stroke="var(--color-alerts)"
            stackId="a"
          />
          <Area
            dataKey="indicators"
            type="natural"
            fill="url(#fillIndicators)"
            stroke="var(--color-indicators)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </Panel>
  );
}
