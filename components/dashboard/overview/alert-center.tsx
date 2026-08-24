"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MoreHorizontal, Bell } from "lucide-react";

type AlertItem = {
  id: string;
  title: string;
  asset: string;
  severity: "High" | "Medium" | "Low";
  time: string;
  hasGreenDot?: boolean;
};

const alerts: AlertItem[] = [
  {
    id: "1",
    title: "God Mode Exploit Attempt",
    asset: "Finance-Core-Gateway-L0",
    severity: "High",
    time: "1 hour ago",
    hasGreenDot: true,
  },
  {
    id: "2",
    title: "Network Edge Isolation Warning",
    asset: "SOC-Edge-Router-Primary",
    severity: "High",
    time: "2 hours ago",
  },
  {
    id: "3",
    title: "Boundary Drift Sync Detected",
    asset: "Compliance-Reporting-Vault",
    severity: "Medium",
    time: "4 hours ago",
  },
];

export function AlertCenter() {
  return (
    <Card className="flex flex-col justify-between border-border/60 bg-card/80 shadow-xs">
      <div>
        <CardHeader className="flex-row items-center justify-between pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="size-4 text-muted-foreground" />
            Alert Center
          </CardTitle>
          <button type="button" className="text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </CardHeader>

        <CardContent className="px-4 pb-2 pt-1 space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between gap-3 border-b border-border/40 pb-2.5 last:border-0"
            >
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate text-xs font-semibold text-foreground">
                    {alert.title}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.2 text-[10px] font-semibold ${
                      alert.severity === "High"
                        ? "bg-destructive/20 text-destructive border border-destructive/30"
                        : "bg-medium/20 text-medium border border-medium/30"
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {alert.asset} · {alert.time}
                </p>
              </div>

              {alert.hasGreenDot && (
                <span className="size-2 shrink-0 rounded-full bg-primary" />
              )}
            </div>
          ))}
        </CardContent>
      </div>

      <div className="px-4 pb-4 pt-1">
        <Link
          href="/dashboard/vulnerabilities"
          className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          View All Alerts
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </Card>
  );
}
