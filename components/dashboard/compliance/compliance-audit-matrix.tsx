"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ShieldCheck, Activity, Lock, FileCheck } from "lucide-react";

type ComplianceFilter = {
  id: string;
  name: string;
  framework: string;
  status: "Enforced" | "Active" | "Operational";
};

const complianceFilters: ComplianceFilter[] = [
  {
    id: "1",
    name: "NIST SP 800-53 Audit Stream",
    framework: "NIST SP 800-53 (Rev. 5)",
    status: "Enforced",
  },
  {
    id: "2",
    name: "SOC 2 Type II Evidence Vault",
    framework: "SOC 2 Trust Criteria",
    status: "Active",
  },
  {
    id: "3",
    name: "Control Drift Intercept Engine",
    framework: "Continuous Monitoring",
    status: "Operational",
  },
];

export function ComplianceAuditMatrix() {
  return (
    <div className="space-y-4">
      {/* Audit Readiness Breakdown Card */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            Audit Readiness Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-1 space-y-3 text-xs">
          {/* Item 1: Automated Control Checks */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Automated Control Verification</span>
              <span className="font-semibold text-foreground">85%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary w-[85%]" />
            </div>
          </div>

          {/* Item 2: Evidence Vault Collection */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Evidence Vault Artifacts</span>
              <span className="font-semibold text-foreground">90%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary w-[90%]" />
            </div>
          </div>

          {/* Item 3: Manual Audits & Gap Reviews */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Manual Audits &amp; Gap Reviews</span>
              <span className="font-semibold text-foreground">60%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-medium w-[60%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Compliance Filters Card */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <FileCheck className="size-4 text-primary" />
            Active Framework Protections
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-1 space-y-2.5 text-xs">
          {complianceFilters.map((f) => (
            <div
              key={f.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-muted/20 p-2.5"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="truncate font-semibold text-foreground">{f.name}</p>
                <p className="text-[10px] text-muted-foreground">{f.framework}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                <CheckCircle2 className="size-3" />
                {f.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
