"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, FileCheck, Layers, TrendingUp } from "lucide-react";

export function ComplianceStats() {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {/* Card 1: Overall Compliance Score */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Overall Compliance Score
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                71.5%
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                <TrendingUp className="size-3" />
                <span>+5.2% this quarter</span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: NIST SP 800-53 (Rev. 5) */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                NIST SP 800-53 (Rev. 5)
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                68%
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  34 / 50 Controls
                </span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-secondary text-foreground">
              <FileCheck className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: SOC 2 Type II */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                SOC 2 Type II
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                75%
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  30 / 40 Controls
                </span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Tracked Control Families */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Tracked Control Families
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                9
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                <CheckCircle2 className="size-3" />
                <span>All 9 Operational</span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-secondary text-foreground">
              <Layers className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
