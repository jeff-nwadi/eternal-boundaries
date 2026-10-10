"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePayloads, type CveControlMatrixItem } from "@/lib/queries/use-payloads";
import { Panel } from "@/components/dashboard/ui/panel";
import { StatusLabel } from "@/components/dashboard/ui/status-label";
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
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/** Fallback matrix (CLAUDE.md §5.4 shape) when the live endpoint is empty. */
const SAMPLE_MATRIX_ITEMS: CveControlMatrixItem[] = [
  {
    cve_id: "CVE-2026-34567",
    affected_asset: "host-prod-db-01",
    severity: "CRITICAL",
    enforcement_status: "ENFORCED",
    linked_controls: [
      { control_id: "NIST-SP-800-53-SI-2", control_name: "Flaw Remediation", framework: "NIST SP 800-53", status: "NON_COMPLIANT" },
      { control_id: "SOC2-CC-7.1", control_name: "Vulnerability Management", framework: "SOC 2 Type II", status: "NON_COMPLIANT" },
    ],
  },
  {
    cve_id: "CVE-2026-99812",
    affected_asset: "gateway-edge-04",
    severity: "HIGH",
    enforcement_status: "ACTIVE",
    linked_controls: [
      { control_id: "NIST-SP-800-53-SC-7", control_name: "Boundary Protection", framework: "NIST SP 800-53", status: "COMPLIANT" },
    ],
  },
  {
    cve_id: "CVE-2026-12345",
    affected_asset: "app-server-02",
    severity: "MEDIUM",
    enforcement_status: "MONITORING",
    linked_controls: [
      { control_id: "SOC2-CC-6.8", control_name: "Unauthorized Software Prevention", framework: "SOC 2 Type II", status: "COMPLIANT" },
    ],
  },
];

export function DashboardTable({ className }: { className?: string }) {
  const { data, isLoading, isError, error, isFetching, refetch } = usePayloads();

  const rawList = data?.cve_control_matrix ?? data?.findings ?? data?.payloads;
  const isSample = !(Array.isArray(rawList) && rawList.length > 0);
  const items = isSample ? SAMPLE_MATRIX_ITEMS : rawList!;

  const action = (
    <div className="flex items-center gap-3">
      <span className="inline-flex items-center gap-1.5 text-sm text-white/55">
        <span
          className={cn("size-1.5 rounded-full", isSample ? "bg-white/40" : "bg-primary")}
          aria-hidden
        />
        {isSample ? "Sample" : "Live"}
      </span>
      <button
        type="button"
        onClick={() => refetch()}
        disabled={isFetching}
        aria-label="Refresh"
        className="inline-flex size-8 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
      >
        <RefreshCw className={cn("size-4", isFetching && "animate-spin")} />
      </button>
    </div>
  );

  return (
    <Panel
      className={className}
      title="CVE control matrix"
      description="Per-finding control traceability against NIST SP 800-53 and SOC 2."
      action={action}
    >
      {isLoading ? (
        <div className="flex flex-col gap-2">
          <div className="h-6 w-full animate-pulse rounded-lg bg-white/[0.06]" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-white/[0.04]" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-white/[0.04]" />
        </div>
      ) : isError ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-white/55">
            Could not load live mappings. {error?.message ?? ""}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-white/[0.06] px-3 py-1.5 text-sm font-medium text-white/80 hover:bg-white/[0.1] hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : (
        <TooltipProvider delayDuration={150}>
          <div className="-mx-3 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-sm font-normal text-white/55">CVE</TableHead>
                  <TableHead className="text-sm font-normal text-white/55">Asset</TableHead>
                  <TableHead className="text-sm font-normal text-white/55">Severity</TableHead>
                  <TableHead className="min-w-[320px] text-sm font-normal text-white/55">
                    Linked controls
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, idx) => (
                  <TableRow key={item.cve_id || idx}>
                    <TableCell className="py-5 align-top font-mono text-sm font-medium text-white">
                      {item.cve_id}
                    </TableCell>
                    <TableCell className="py-5 align-top font-mono text-sm text-white/55">
                      {item.affected_asset}
                    </TableCell>
                    <TableCell className="py-5 align-top">
                      <StatusLabel value={item.severity} />
                    </TableCell>
                    <TableCell className="py-5 align-top">
                      <div className="flex flex-col gap-3">
                        {item.linked_controls && item.linked_controls.length > 0 ? (
                          item.linked_controls.map((ctrl, cIdx) => (
                            <div
                              key={ctrl.control_id || cIdx}
                              className="flex min-w-[320px] items-center gap-3"
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="shrink-0 cursor-help rounded-md bg-white/[0.06] px-2 py-1 font-mono text-xs text-white underline-offset-2 decoration-dotted decoration-white/30 hover:underline">
                                    {ctrl.control_id}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-medium">{ctrl.control_name}</p>
                                  {ctrl.framework ? (
                                    <p className="mt-1 text-xs text-background/70">
                                      {ctrl.framework}
                                    </p>
                                  ) : null}
                                </TooltipContent>
                              </Tooltip>
                              <span className="flex-1 text-sm text-white/55">
                                {ctrl.control_name}
                              </span>
                              {/* §5.4: nested control status is restricted to CLAIMED
                                  (unverified) until gate-off/gate-on tests pass. */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="shrink-0 cursor-help">
                                    <StatusLabel value="CLAIMED" />
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <p className="font-medium">CLAIMED (unverified)</p>
                                  <p className="mt-1 text-xs text-background/70">
                                    Status stays CLAIMED until gate-off/gate-on verification passes.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </div>
                          ))
                        ) : (
                          <span className="text-sm text-white/40">No linked controls</span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      )}
    </Panel>
  );
}

export default DashboardTable;
