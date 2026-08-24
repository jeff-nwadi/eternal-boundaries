"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

export function ThreatMap() {
  return (
    <Card className="relative flex flex-col justify-between border-border/60 bg-card/80 shadow-xs">
      <CardHeader className="flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
          Threat Map
        </CardTitle>
        <button type="button" className="text-muted-foreground hover:text-foreground">
          <MoreHorizontal className="size-4" />
        </button>
      </CardHeader>

      <CardContent className="relative flex-1 px-4 pb-4 pt-0">
        {/* World Map SVG graphic with threat node indicators */}
        <div className="relative flex h-36 w-full items-center justify-center overflow-hidden rounded-md bg-muted/20">
          <svg
            viewBox="0 0 800 400"
            className="h-full w-full opacity-35"
            fill="none"
            stroke="currentColor"
          >
            {/* Simplified World Continent Polygons / Outline */}
            <path
              d="M150 120 Q180 100 240 110 T300 160 Q280 220 220 250 T160 180 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M260 260 Q290 280 300 340 T270 380 Q240 340 250 290 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M420 100 Q480 80 540 120 T520 200 Q460 220 430 150 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M440 220 Q480 240 500 320 T450 360 Q420 300 430 250 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M580 110 Q680 90 740 150 T700 260 Q620 280 580 180 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
            <path
              d="M660 300 Q700 310 720 350 T670 370 Z"
              fill="currentColor"
              className="text-muted-foreground/30"
            />
          </svg>

          {/* Pulsing Threat Dots (Red & Green Dots) */}
          <span className="absolute left-[28%] top-[35%] size-2 rounded-full bg-destructive shadow-[0_0_8px_var(--destructive)] animate-pulse" />
          <span className="absolute left-[32%] top-[45%] size-1.5 rounded-full bg-destructive/80" />
          <span className="absolute left-[54%] top-[30%] size-2 rounded-full bg-destructive shadow-[0_0_8px_var(--destructive)] animate-pulse" />
          <span className="absolute left-[58%] top-[55%] size-1.5 rounded-full bg-primary" />
          <span className="absolute left-[72%] top-[40%] size-2 rounded-full bg-destructive shadow-[0_0_8px_var(--destructive)] animate-pulse" />
          <span className="absolute left-[78%] top-[48%] size-1.5 rounded-full bg-primary" />
          <span className="absolute left-[20%] top-[60%] size-1.5 rounded-full bg-primary" />
        </div>

        {/* Global Threat Pill Overlay (matching reference screenshot) */}
        <div className="mt-3 flex items-center justify-between rounded-lg border border-border/60 bg-popover/90 px-3 py-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-destructive animate-pulse" />
            <span className="font-semibold text-foreground">Threats detected</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-muted-foreground">Global</span>
            <span className="font-bold tabular-nums text-foreground">128</span>
            <span className="text-[10px] text-destructive font-medium">-12% vs last week</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
