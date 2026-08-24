"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Shield, Activity, Lock, Radio } from "lucide-react";

type MitigationFilter = {
  id: string;
  name: string;
  target: string;
  status: "Active" | "Operational" | "Enforced";
};

const mitigations: MitigationFilter[] = [
  {
    id: "1",
    name: "LayerZero Execution Intercept",
    target: "Finance-Core-Gateway-L0",
    status: "Active",
  },
  {
    id: "2",
    name: "Boundary Packet Drop Matrix",
    target: "SOC-Edge-Router-Primary",
    status: "Enforced",
  },
  {
    id: "3",
    name: "Loopback Drift Isolation",
    target: "Compliance-Reporting-Vault",
    status: "Operational",
  },
];

export function ThreatProtectionMatrix() {
  return (
    <div className="space-y-4">
      {/* Category Breakdown Card */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Activity className="size-4 text-muted-foreground" />
            Threat Vector Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-1 space-y-3 text-xs">
          {/* Item 1: Threat Actors */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Threat Actors (Nation-State / Crimeware)</span>
              <span className="font-semibold text-foreground">40%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-destructive w-[40%]" />
            </div>
          </div>

          {/* Item 2: Exploit Kits & Malware */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Exploit Kits &amp; Malware Payloads</span>
              <span className="font-semibold text-foreground">35%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-medium w-[35%]" />
            </div>
          </div>

          {/* Item 3: Vulnerabilities */}
          <div className="space-y-1">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>System &amp; Root Flaws (CWE Tracks)</span>
              <span className="font-semibold text-foreground">25%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary w-[25%]" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Protections Card */}
      <Card className="border-border/60 bg-card/80 shadow-xs">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Shield className="size-4 text-primary" />
            Active Protection Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-1 space-y-2.5 text-xs">
          {mitigations.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between gap-2 rounded-md border border-border/40 bg-muted/20 p-2.5"
            >
              <div className="space-y-0.5 min-w-0">
                <p className="truncate font-semibold text-foreground">{m.name}</p>
                <p className="text-[10px] text-muted-foreground">{m.target}</p>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary border border-primary/20">
                <CheckCircle2 className="size-3" />
                {m.status}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
