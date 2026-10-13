"use client";

import * as React from "react";
import { Search, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import type { VulnFinding } from "@/lib/mock-data";
import type { RemediationStatusMap } from "@/app/api/remediate/status/route";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Panel } from "@/components/dashboard/ui/panel";
import { StatusLabel } from "@/components/dashboard/ui/status-label";
import { RemediationControl } from "@/components/dashboard/vulnerabilities/remediation-control";

const SEVERITY_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;
type SeverityFilter = (typeof SEVERITY_FILTERS)[number];

export function VulnTable({ findings }: { findings: VulnFinding[] }) {
  const [filter, setFilter] = React.useState<SeverityFilter>("ALL");
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<VulnFinding | null>(null);
  const [statuses, setStatuses] = React.useState<RemediationStatusMap>({});

  // Load persisted remediation status once so each row reflects the right state.
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

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return findings.filter((f) => {
      const matchesSeverity = filter === "ALL" || f.severity.toUpperCase() === filter;
      const matchesQuery =
        !q ||
        [f.cve_id, f.vulnerability_name, f.affected_asset].some((s) =>
          s.toLowerCase().includes(q)
        );
      return matchesSeverity && matchesQuery;
    });
  }, [findings, filter, query]);

  const search = (
    <div className="relative w-full sm:w-64">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-white/40"
        aria-hidden
      />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search findings…"
        className="h-9 pl-8"
        aria-label="Search findings"
      />
    </div>
  );

  return (
    <Panel title="Findings" action={search}>
      {/* Severity filter pills */}
      <div className="flex flex-wrap gap-1.5">
        {SEVERITY_FILTERS.map((sev) => (
          <button
            key={sev}
            type="button"
            onClick={() => setFilter(sev)}
            aria-pressed={filter === sev}
            className={cn(
              "rounded-full px-3 py-1 text-sm font-medium capitalize transition-colors duration-150",
              filter === sev
                ? "bg-white/[0.1] text-white"
                : "text-white/55 hover:bg-white/[0.04] hover:text-white"
            )}
          >
            {sev.toLowerCase()}
          </button>
        ))}
      </div>

      <div className="-mx-3 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-sm font-normal text-white/55">CVE</TableHead>
              <TableHead className="text-sm font-normal text-white/55">Vulnerability</TableHead>
              <TableHead className="text-sm font-normal text-white/55">Severity</TableHead>
              <TableHead className="text-sm font-normal text-white/55">Asset</TableHead>
              <TableHead className="text-sm font-normal text-white/55">Patch status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={5} className="h-20 text-center text-white/55">
                  No findings match your filters.
                </TableCell>
              </TableRow>
            ) : (
              visible.map((f) => (
                <TableRow
                  key={f.cve_id}
                  onClick={() => setSelected(f)}
                  tabIndex={0}
                  role="button"
                  aria-label={`View ${f.vulnerability_name}`}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelected(f);
                    }
                  }}
                  className="cursor-pointer focus-visible:bg-white/[0.04] focus-visible:outline-none"
                >
                  <TableCell className="font-mono text-sm text-white/55">{f.cve_id}</TableCell>
                  <TableCell className="font-medium text-white">
                    {f.vulnerability_name}
                  </TableCell>
                  <TableCell>
                    <StatusLabel value={f.severity} />
                  </TableCell>
                  <TableCell className="font-mono text-sm text-white/55">
                    {f.affected_asset}
                  </TableCell>
                  <TableCell>
                    <StatusLabel value={f.patch_status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Row detail modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-y-auto p-0 ring-white/10">
          {selected ? (
            <FindingDetail
              finding={selected}
              status={statuses[selected.cve_id]}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}

function FindingDetail({
  finding,
  status,
}: {
  finding: VulnFinding;
  status?: { status: RemediationStatusMap[string]["status"]; detail: string | null };
}) {
  return (
    <div className="flex flex-col gap-8 p-6">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-sm text-white/55">{finding.cve_id}</span>
        <DialogTitle className="font-heading text-2xl font-semibold text-white">
          {finding.vulnerability_name}
        </DialogTitle>
        <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2">
          <StatusLabel value={finding.severity} />
          <StatusLabel value={finding.patch_status} />
          <span className="font-mono text-sm text-white/55">{finding.affected_asset}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-white/55">How to fix it</span>
        {/*
          Rendered verbatim from mock_vuln_scan.json. UNVERIFIED per CLAUDE.md
          §5.3 ("Termux gateway", invented proper nouns) — not audited or
          actionable guidance; must not be presented as production-ready.
        */}
        <p className="text-sm leading-relaxed text-white/75">
          {finding.remediation_guidance}
        </p>
        <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/40">
          <Info className="size-3.5" strokeWidth={1.75} aria-hidden />
          Unverified sample guidance, not audited.
        </span>
      </div>

      <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-6">
        <span className="text-sm text-white/55">Verify fix</span>
        <RemediationControl
          vulnerabilityId={finding.cve_id}
          targetAsset={finding.affected_asset}
          initialStatus={status?.status ?? "open"}
          initialDetail={status?.detail ?? null}
        />
      </div>
    </div>
  );
}
