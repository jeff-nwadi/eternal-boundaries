"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Bug, ShieldAlert, ShieldCheck, ShieldOff, Users } from "lucide-react";

export function ThreatStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Card 1: Active Threat Vectors */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Active Threat Vectors
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                3
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                  <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                  Zero-Click Group
                </span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
              <Users className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Top Exploit Vector */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Top Exploit Vector
              </span>
              <p className="mt-1 text-lg font-bold leading-tight tracking-tight text-foreground truncate max-w-[140px]">
                God Mode Payload
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-medium/15 px-1.5 py-0.5 text-[10px] font-semibold text-medium">
                  LayerZero Bypass
                </span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-medium/20 bg-medium/10 text-medium">
              <Bug className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Vulnerabilities Tracked */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Vulnerabilities Tracked
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                1<span className="text-base font-normal text-muted-foreground"> open</span>
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-destructive">
                <AlertTriangle className="size-3" />
                <span>CWE-1000 Track</span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-destructive/20 bg-destructive/10 text-destructive">
              <ShieldOff className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Security Posture */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Security Posture
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                92.4%
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                <ShieldCheck className="size-3" />
                <span>Perimeter Defense Active</span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <ShieldAlert className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
