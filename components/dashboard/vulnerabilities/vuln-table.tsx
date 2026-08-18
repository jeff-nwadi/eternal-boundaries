"use client";

import * as React from "react";
import { Filter } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VulnFinding } from "@/lib/mock-data";
import {
  StatusPill,
  severityTone,
  patchTone,
} from "@/components/dashboard/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SEVERITY_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
type SeverityFilter = (typeof SEVERITY_FILTERS)[number];

export function VulnTable({ findings }: { findings: VulnFinding[] }) {
  const [filter, setFilter] = React.useState<SeverityFilter>("ALL");

  const visible =
    filter === "ALL"
      ? findings
      : findings.filter((f) => f.severity.toUpperCase() === filter);

  return (
    <div className="min-w-0 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Filter
            strokeWidth={1.75}
            className="size-3.5 transition-transform duration-200 ease-out hover:scale-110"
          />
          Severity
        </span>
        <div className="flex flex-wrap gap-1">
          {SEVERITY_FILTERS.map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilter(sev)}
              aria-pressed={filter === sev}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs font-medium capitalize transition-colors duration-150 ease-out",
                filter === sev
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {sev.toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>CVE</TableHead>
              <TableHead>Vulnerability</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Affected asset</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="min-w-[280px]">Remediation guidance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={6}
                  className="py-10 text-center whitespace-normal text-muted-foreground"
                >
                  No findings at this severity in the sample.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((f) => (
                <TableRow key={f.cve_id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {f.cve_id}
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    {f.vulnerability_name}
                  </TableCell>
                  <TableCell>
                    <StatusPill label={f.severity} tone={severityTone(f.severity)} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {f.affected_asset}
                  </TableCell>
                  <TableCell>
                    <StatusPill label={f.patch_status} tone={patchTone(f.patch_status)} />
                  </TableCell>
                  {/*
                    Rendered verbatim from mock_vuln_scan.json. This text is
                    UNVERIFIED per CLAUDE.md §5.3 ("Termux gateway", invented
                    proper nouns, etc.) — not audited or actionable guidance,
                    and must not be presented as production-ready.
                  */}
                  <TableCell className="min-w-[280px] whitespace-normal text-pretty text-sm leading-relaxed text-muted-foreground">
                    {f.remediation_guidance}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
