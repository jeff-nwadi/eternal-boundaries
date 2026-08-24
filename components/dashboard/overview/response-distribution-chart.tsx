"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

type DayBar = {
  day: string;
  open: number;
  inProgress: number;
  resolved: number;
  escalated: number;
};

const weekData: DayBar[] = [
  { day: "Mon", open: 15, inProgress: 25, resolved: 20, escalated: 10 },
  { day: "Tue", open: 20, inProgress: 30, resolved: 25, escalated: 12 },
  { day: "Wed", open: 18, inProgress: 28, resolved: 30, escalated: 15 },
  { day: "Thu", open: 35, inProgress: 55, resolved: 70, escalated: 25 },
  { day: "Fri", open: 22, inProgress: 35, resolved: 30, escalated: 10 },
  { day: "Sat", open: 14, inProgress: 20, resolved: 25, escalated: 8 },
  { day: "Sun", open: 18, inProgress: 22, resolved: 28, escalated: 10 },
];

export function ResponseDistributionChart() {
  return (
    <Card className="flex flex-col justify-between border-border/60 bg-card/80 shadow-xs">
      <CardHeader className="flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
          Response Status Distribution
        </CardTitle>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between px-4 pb-4 pt-2">
        {/* Vertical Stacked Bar Chart */}
        <div className="flex h-36 items-end justify-between gap-2 px-2 pt-4">
          {weekData.map((d) => {
            const total = d.open + d.inProgress + d.resolved + d.escalated;
            const openPct = (d.open / total) * 100;
            const inProgressPct = (d.inProgress / total) * 100;
            const resolvedPct = (d.resolved / total) * 100;
            const escalatedPct = (d.escalated / total) * 100;

            return (
              <div key={d.day} className="flex flex-1 flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className="w-full max-w-[28px] flex flex-col-reverse overflow-hidden rounded-xs bg-muted/30"
                  style={{ height: `${Math.min(100, total * 0.75)}%` }}
                >
                  <span style={{ height: `${escalatedPct}%` }} className="bg-primary/30 w-full" />
                  <span style={{ height: `${inProgressPct}%` }} className="bg-primary/60 w-full" />
                  <span style={{ height: `${resolvedPct}%` }} className="bg-primary w-full shadow-[0_0_4px_rgba(175,243,62,0.5)]" />
                  <span style={{ height: `${openPct}%` }} className="bg-primary/80 w-full" />
                </div>
                <span className="text-[10px] text-muted-foreground font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>

        {/* Legend at bottom */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-xs bg-primary/30" />
            <span>Escalated</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-xs bg-primary" />
            <span>Resolved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-xs bg-primary/60" />
            <span>In Progress</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-xs bg-primary/80" />
            <span>Open</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
