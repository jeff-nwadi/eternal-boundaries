"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Server, MoreHorizontal, ChevronDown, ShieldAlert, Radio } from "lucide-react";

type SecurityThreat = {
  id: string;
  entity: string;
  subtext: string;
  type: "server" | "user" | "gateway";
  category: string;
  riskPct: number;
  riskColor: "red" | "orange" | "green";
  status: "Monitoring" | "Investigating" | "Mitigated";
};

const threatRows: SecurityThreat[] = [
  {
    id: "1",
    entity: "Finance-Core-Gateway-L0",
    subtext: "God Mode Root Flaw · CWE-1000",
    type: "gateway",
    category: "Execution Bypass",
    riskPct: 90,
    riskColor: "red",
    status: "Investigating",
  },
  {
    id: "2",
    entity: "SOC-Edge-Router-Primary",
    subtext: "Network Edge Bypass · Primary Router",
    type: "server",
    category: "Boundary Protection",
    riskPct: 75,
    riskColor: "orange",
    status: "Investigating",
  },
  {
    id: "3",
    entity: "Compliance-Reporting-Vault",
    subtext: "Legacy Boundary Drift Leak · Patched",
    type: "server",
    category: "Data Integrity",
    riskPct: 32,
    riskColor: "green",
    status: "Mitigated",
  },
  {
    id: "4",
    entity: "Zero-Click Actor Group",
    subtext: "Threat Actor · External Remote Vector",
    type: "user",
    category: "Authentication",
    riskPct: 20,
    riskColor: "orange",
    status: "Monitoring",
  },
];

export function SecurityThreatsTable() {
  return (
    <Card className="border-border/60 bg-card/80 shadow-xs">
      <CardHeader className="flex-row items-center justify-between pb-3 pt-4 px-4">
        <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
          <ShieldAlert className="size-4 text-muted-foreground" />
          Security Threats &amp; Assets
        </CardTitle>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1 rounded border border-border/60 bg-muted/40 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            View: All Protected Assets
            <ChevronDown className="size-3" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border/50 text-[10px] uppercase tracking-wider text-muted-foreground">
                <th className="py-2 font-medium">Asset / Entity</th>
                <th className="py-2 font-medium">Threat Category</th>
                <th className="py-2 font-medium">Risk Score</th>
                <th className="py-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {threatRows.map((row) => (
                <tr key={row.id} className="group hover:bg-muted/30">
                  {/* Entity Column */}
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/50 bg-secondary text-muted-foreground">
                        {row.type === "user" ? (
                          <User className="size-3.5" />
                        ) : row.type === "gateway" ? (
                          <Radio className="size-3.5" />
                        ) : (
                          <Server className="size-3.5" />
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-foreground">{row.entity}</p>
                        <p className="text-[10px] text-muted-foreground">{row.subtext}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category Column */}
                  <td className="py-2.5 px-3 text-muted-foreground font-medium">
                    {row.category}
                  </td>

                  {/* Risk Level Column with segmented bar */}
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 8 }).map((_, i) => {
                          const filled = i < Math.round((row.riskPct / 100) * 8);
                          return (
                            <span
                              key={i}
                              className={`h-2.5 w-1 rounded-xs transition-colors ${
                                filled
                                  ? row.riskColor === "green"
                                    ? "bg-primary"
                                    : row.riskColor === "orange"
                                    ? "bg-medium"
                                    : "bg-destructive"
                                  : "bg-muted"
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                        {row.riskPct}%
                      </span>
                    </div>
                  </td>

                  {/* Status Pill Column */}
                  <td className="py-2.5 pl-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium border ${
                          row.status === "Monitoring"
                            ? "border-primary/30 bg-primary/10 text-primary"
                            : row.status === "Investigating"
                            ? "border-medium/30 bg-medium/10 text-medium"
                            : "border-destructive/30 bg-destructive/10 text-destructive"
                        }`}
                      >
                        {row.status}
                      </span>
                      <button type="button" className="text-muted-foreground/60 hover:text-foreground">
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
