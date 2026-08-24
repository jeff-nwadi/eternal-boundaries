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
import { RemediationControl } from "@/components/dashboard/vulnerabilities/remediation-control";
import type { RemediationStatusMap } from "@/app/api/remediate/status/route";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SEVERITY_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
type SeverityFilter = (typeof SEVERITY_FILTERS)[number];

export function VulnTable({ findings }: { findings: VulnFinding[] }) {
  const [filter, setFilter] = React.useState<SeverityFilter>("ALL");
  const [statuses, setStatuses] = React.useState<RemediationStatusMap>({});

  // Load persisted remediation status once so each row starts in the right
  // state (open / verifying / covered / verification_error) across reloads.
  React.useEffect(() => {
    let active = true;
    fetch("/api/remediate/status", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { statuses: {} }))
      .then((d: { statuses?: RemediationStatusMap }) => {
        if (active) setStatuses(d.statuses ?? {});
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

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
              <TableHead>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="cursor-help underline decoration-dotted decoration-muted-foreground/40 underline-offset-2">
                      CVE
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>The public ID for a known security flaw.</TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead>Vulnerability</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Affected system</TableHead>
              <TableHead>Patch status</TableHead>
              <TableHead className="min-w-[280px]">How to fix it</TableHead>
              <TableHead className="min-w-[180px]">Verify fix</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={7}
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
                  <TableCell className="min-w-[180px] whitespace-normal">
                    <RemediationControl
                      vulnerabilityId={f.cve_id}
                      targetAsset={f.affected_asset}
                      initialStatus={statuses[f.cve_id]?.status ?? "open"}
                      initialDetail={statuses[f.cve_id]?.detail ?? null}
                    />
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
