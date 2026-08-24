"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

const tactics = [
  "Initial Access",
  "Execution",
  "Discovery",
  "Defense Evasion",
  "Lateral Movement",
];

const dates = ["Jan 12", "Jan 13", "Jan 14", "Jan 15", "Jan 16"];

// Preset matrix intensity pattern matching reference screenshot (0: dark, 1: dim, 2: bright green)
const matrixData: number[][] = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2], // Initial Access
  [2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2], // Execution
  [2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2], // Discovery
  [2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], // Defense Evasion
  [2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1], // Lateral Movement
];

export function ThreatTacticsMatrix() {
  return (
    <Card className="border-border/60 bg-card/80 shadow-xs">
      <CardHeader className="flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
          Threat Tactics Activity
        </CardTitle>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2">
        <div className="space-y-2 text-xs">
          {tactics.map((tactic, rowIndex) => (
            <div key={tactic} className="flex items-center justify-between gap-3">
              <span className="w-28 shrink-0 truncate text-[11px] font-medium text-muted-foreground">
                {tactic}
              </span>
              <div className="flex flex-1 items-center justify-between gap-1">
                {matrixData[rowIndex].map((val, colIndex) => (
                  <span
                    key={`${rowIndex}-${colIndex}`}
                    className={`size-2.5 rounded-full transition-all ${
                      val === 2
                        ? "bg-primary shadow-[0_0_6px_rgba(175,243,62,0.4)]"
                        : val === 1
                        ? "bg-primary/40"
                        : "bg-muted/80"
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Date X-Axis */}
        <div className="mt-3 flex justify-between pl-28 text-[10px] text-muted-foreground">
          {dates.map((date) => (
            <span key={date}>{date}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
