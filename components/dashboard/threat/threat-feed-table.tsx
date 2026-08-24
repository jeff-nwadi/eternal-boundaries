"use client";

import * as React from "react";
import {
  Bug,
  ChevronDown,
  Info,
  Radio,
  Search,
  ShieldAlert,
  ShieldOff,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { StixObject } from "@/lib/mock-data";

const TYPE_META: Record<string, { icon: LucideIcon; label: string }> = {
  "threat-actor": { icon: Users, label: "Threat Actor" },
  malware: { icon: Bug, label: "Malware" },
  vulnerability: { icon: ShieldOff, label: "Vulnerability" },
};

function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: ShieldOff, label: type };
}

type ThreatIndicator = {
  id: string;
  name: string;
  type: string;
  severity: "Critical" | "High" | "Medium";
  confidence: number;
  lastSeen: string;
  description?: string;
  classifications?: string[];
  rawObject?: StixObject;
};

export function ThreatFeedTable({ objects }: { objects: StixObject[] }) {
  const [search, setSearch] = React.useState("");
  const [filterType, setFilterType] = React.useState("all");

  const items: ThreatIndicator[] = React.useMemo(() => {
    return objects.map((obj) => {
      const isCritical = obj.name?.toLowerCase().includes("god mode") || obj.type === "vulnerability";
      const isHigh = obj.type === "threat-actor";
      const severity = isCritical ? "Critical" : isHigh ? "High" : "Medium";
      const confidence = isCritical ? 98 : isHigh ? 95 : 88;
      const classifications = obj.threat_actor_types ?? obj.malware_types ?? [];

      return {
        id: obj.id,
        name: obj.name ?? obj.id,
        type: obj.type,
        severity,
        confidence,
        lastSeen: obj.modified ? `${obj.modified.slice(0, 10)}` : "Today",
        description: obj.description,
        classifications,
        rawObject: obj,
      };
    });
  }, [objects]);

  const [selectedId, setSelectedId] = React.useState<string>(items[0]?.id ?? "");

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.id.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || item.type === filterType;
      return matchSearch && matchType;
    });
  }, [items, search, filterType]);

  const selectedItem = items.find((i) => i.id === selectedId) ?? filteredItems[0] ?? items[0];

  return (
    <Card className="border-border/60 bg-card/80 shadow-xs">
      <CardHeader className="flex flex-wrap items-center justify-between gap-3 pb-3 pt-4 px-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="size-4 text-primary" />
          <CardTitle className="text-sm font-semibold tracking-tight text-foreground">
            Live Threat Stream &amp; Indicators
          </CardTitle>
        </div>

        {/* Search & Filter Controls */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search threat indicators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 w-48 pl-8 text-xs bg-muted/30"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-8 rounded-md border border-border/60 bg-muted/30 px-2 text-xs font-medium text-foreground focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="threat-actor">Threat Actor</option>
            <option value="malware">Malware</option>
            <option value="vulnerability">Vulnerability</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
          {/* Table */}
          <div className="overflow-x-auto no-scrollbar rounded-md border border-border/50">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/60 bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 px-3 font-medium">Indicator / Name</th>
                  <th className="py-2.5 px-3 font-medium">Type</th>
                  <th className="py-2.5 px-3 font-medium">Severity</th>
                  <th className="py-2.5 px-3 font-medium">Confidence</th>
                  <th className="py-2.5 px-3 font-medium text-right">Last Seen</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-muted-foreground">
                      No threat indicators match your search.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const meta = typeMeta(item.type);
                    const Icon = meta.icon;
                    const isSelected = item.id === selectedItem?.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-accent/40 font-medium"
                            : "hover:bg-muted/30"
                        }`}
                      >
                        {/* Name */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <span className="flex size-6 shrink-0 items-center justify-center rounded border border-border/50 bg-secondary text-foreground">
                              <Icon className="size-3.5" />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-foreground">
                                {item.name}
                              </p>
                              <p className="truncate font-mono text-[10px] text-muted-foreground">
                                {item.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Type */}
                        <td className="py-2.5 px-3 text-muted-foreground">
                          {meta.label}
                        </td>

                        {/* Severity Badge */}
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              item.severity === "Critical"
                                ? "bg-destructive/20 text-destructive border border-destructive/30"
                                : item.severity === "High"
                                ? "bg-high/20 text-high border border-high/30"
                                : "bg-medium/20 text-medium border border-medium/30"
                            }`}
                          >
                            {item.severity}
                          </span>
                        </td>

                        {/* Confidence Bar */}
                        <td className="py-2.5 px-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${item.confidence}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
                              {item.confidence}%
                            </span>
                          </div>
                        </td>

                        {/* Last Seen */}
                        <td className="py-2.5 px-3 text-right text-muted-foreground">
                          {item.lastSeen}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Selected Item Telemetry Inspector */}
          {selectedItem && (
            <div className="rounded-md border border-border/60 bg-muted/20 p-3.5 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-border/50 pb-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Info className="size-3.5" />
                  Indicator Inspector
                </span>
                <Badge variant="outline" className="text-[9px] uppercase font-mono">
                  {selectedItem.type}
                </Badge>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-foreground leading-snug">
                  {selectedItem.name}
                </h4>
                <p className="font-mono text-[10px] text-muted-foreground break-all">
                  {selectedItem.id}
                </p>
              </div>

              {selectedItem.description && (
                <p className="rounded border border-border/40 bg-background/50 p-2 text-muted-foreground text-pretty leading-relaxed text-[11px]">
                  {selectedItem.description}
                </p>
              )}

              {selectedItem.classifications && selectedItem.classifications.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.classifications.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] py-0 px-1.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1 border-t border-border/50 pt-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence:</span>
                  <span className="font-semibold text-foreground">{selectedItem.confidence}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-primary">Live Tracking</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
