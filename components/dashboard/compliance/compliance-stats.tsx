"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, FileCheck, Layers } from "lucide-react";
import type { ComplianceMapping } from "@/lib/queries/use-compliance-mappings";

export function ComplianceStats({ mappings }: { mappings?: ComplianceMapping[] }) {
  const total = mappings?.length ?? 0;
  const compliantCount = mappings?.filter((m) => m.status.toUpperCase() === "COMPLIANT").length ?? 0;
  const percentage = total > 0 ? Math.round((compliantCount / total) * 100) : 71.5;

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
                {percentage}%
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                <ShieldCheck className="size-3" />
                <span>{mappings ? "Live Engine Audit" : "Sample Data"}</span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <ShieldCheck className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 2: Controls Assessed */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Controls Assessed
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                {mappings ? total : 50}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-primary/15 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  {mappings ? `${compliantCount} Compliant` : "34 / 50 Compliant"}
                </span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-border/60 bg-secondary text-foreground">
              <FileCheck className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 3: Non-Compliant / Gaps */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Active Gaps
              </span>
              <p className="mt-1 text-2xl font-bold leading-none tabular-nums text-foreground">
                {mappings ? total - compliantCount : 10}
              </p>
              <div className="mt-2 flex items-center gap-1">
                <span className="inline-flex items-center gap-1 rounded bg-medium/15 px-1.5 py-0.5 text-[10px] font-semibold text-medium">
                  {mappings ? `${total - compliantCount} Action Required` : "10 Action Required"}
                </span>
              </div>
            </div>
            <span className="flex size-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <CheckCircle2 className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Card 4: Framework Info */}
      <Card className="border-border/60 bg-card/80 p-3.5 shadow-2xs">
        <CardContent className="p-0">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-medium text-muted-foreground">
                Active Engine Framework
              </span>
              <p className="mt-1 text-lg font-bold leading-tight truncate text-foreground">
                ETB Layer-Zero
              </p>
              <div className="mt-2 flex items-center gap-1 text-[11px] font-medium text-primary">
                <Layers className="size-3" />
                <span>v1.0.0 Enforced</span>
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
