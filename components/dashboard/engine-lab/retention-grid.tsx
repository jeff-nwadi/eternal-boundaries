"use client";

import * as React from "react";
import { Search, Info } from "lucide-react";

import type { ConsumptionRow } from "@/lib/engine-lab/consumption";
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
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { EmptyState } from "@/components/dashboard/ui/empty-state";

const COMMITTED = "var(--severity-low)"; // teal — committed/validated span
const SUFFIX = "var(--severity-medium)"; // amber — isolated/retained suffix
const OUTSIDE = "var(--severity-critical)"; // red — outside-window / untrusted

type Segments = { committed: number; suffix: number; outside: number };

function segmentsOf(r: ConsumptionRow): Segments {
  const committed = Math.max(0, r.committedBytes);
  const suffix = Math.max(0, r.suffixBytes);
  const outside = Math.max(0, r.N - committed - suffix);
  return { committed, suffix, outside };
}

function ByteBar({ row, className }: { row: ConsumptionRow; className?: string }) {
  const s = segmentsOf(row);
  const total = Math.max(1, s.committed + s.suffix + s.outside);
  const seg = (v: number, c: string) =>
    v > 0 ? <span className="h-full" style={{ flexGrow: v, backgroundColor: c }} /> : null;
  return (
    <span className={`flex h-2.5 w-full gap-px overflow-hidden rounded-full bg-white/[0.06] ${className ?? ""}`} aria-hidden>
      {total > 0 ? (
        <>
          {seg(s.committed, COMMITTED)}
          {seg(s.suffix, SUFFIX)}
          {seg(s.outside, OUTSIDE)}
        </>
      ) : null}
    </span>
  );
}

export function RetentionGrid({ rows }: { rows: ConsumptionRow[] }) {
  const [query, setQuery] = React.useState("");
  const [selected, setSelected] = React.useState<ConsumptionRow | null>(null);

  const held = rows.filter((r) => r.suffixBytes > 0).length;
  const outcomes = new Set(rows.map((r) => r.outcome)).size;

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.specimenId, r.policyId, r.outcome, r.key].some((s) => s.toLowerCase().includes(q))
    );
  }, [rows, query]);

  if (rows.length === 0) {
    return (
      <EmptyState message="No consumption fixtures found (etbv-dashboard-data/consumption-boundaries/consumption_results.csv)." />
    );
  }

  const search = (
    <div className="relative w-full sm:w-64">
      <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-white/40" aria-hidden />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search specimens…"
        className="h-9 pl-8"
        aria-label="Search specimens"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Specimens" value={rows.length} />
        <StatCard label="Policies × specimens" value={rows.length} caption="fixtures evaluated" />
        <StatCard label="Outcome types" value={outcomes} />
        <StatCard label="Held a suffix" value={held} caption="consumption halted early" />
      </div>

      <Panel title="Boundary retention" action={search}>
        {/* Legend */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/55">
          <Legend color={COMMITTED} label="Committed" />
          <Legend color={SUFFIX} label="Isolated suffix" />
          <Legend color={OUTSIDE} label="Outside window" />
        </div>

        <div className="-mx-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm font-normal text-white/55">Specimen</TableHead>
                <TableHead className="text-sm font-normal text-white/55">Policy</TableHead>
                <TableHead className="text-sm font-normal text-white/55">Outcome</TableHead>
                <TableHead className="min-w-[220px] text-sm font-normal text-white/55">
                  Byte retention
                </TableHead>
                <TableHead className="text-right text-sm font-normal text-white/55">Bytes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={5} className="h-20 text-center text-white/55">
                    No specimens match “{query}”.
                  </TableCell>
                </TableRow>
              ) : (
                visible.map((r) => (
                  <TableRow
                    key={r.key}
                    onClick={() => setSelected(r)}
                    tabIndex={0}
                    role="button"
                    aria-label={`View ${r.specimenId}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(r);
                      }
                    }}
                    className="cursor-pointer focus-visible:bg-white/[0.04] focus-visible:outline-none"
                  >
                    <TableCell className="font-mono text-sm text-white">{r.specimenId}</TableCell>
                    <TableCell className="font-mono text-sm text-white/55">{r.policyId}</TableCell>
                    <TableCell className="text-sm text-white/75">{r.outcome}</TableCell>
                    <TableCell className="min-w-[220px]">
                      <ByteBar row={r} />
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-white/55">
                      {r.committedBytes}/{r.N}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="inline-flex items-center gap-1.5 text-xs text-white/40">
          <Info className="size-3.5" strokeWidth={1.75} aria-hidden />
          Offline fixtures — analyst-defined contracts, not live parser or vendor behavior.
        </p>
      </Panel>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[88vh] w-[calc(100%-1.5rem)] gap-0 overflow-y-auto p-0 ring-white/10 sm:max-w-3xl">
          {selected ? <SpecimenDetail row={selected} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {label}
    </span>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-white/55">{label}</span>
      <span className={`text-sm text-white/80 ${mono ? "font-mono break-all" : ""}`}>
        {value || "—"}
      </span>
    </div>
  );
}

function SpecimenDetail({ row }: { row: ConsumptionRow }) {
  const s = segmentsOf(row);
  return (
    <div className="flex flex-col gap-8 p-6 sm:p-8">
      <div className="flex flex-col gap-2">
        <span className="font-mono text-sm text-white/55">{row.policyId}</span>
        <DialogTitle className="font-heading text-2xl font-semibold text-white sm:text-3xl">
          {row.specimenId}
        </DialogTitle>
        <span className="text-sm text-white/75">{row.outcome}</span>
      </div>

      {/* Byte retention — full width */}
      <div className="flex flex-col gap-3">
        <span className="text-sm text-white/55">Byte retention · {row.N} bytes</span>
        <ByteBar row={row} className="h-4" />
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm font-medium">
          <span style={{ color: COMMITTED }}>Committed · {s.committed}</span>
          <span style={{ color: SUFFIX }}>Isolated suffix · {s.suffix}</span>
          <span style={{ color: OUTSIDE }}>Outside window · {s.outside}</span>
        </div>
      </div>

      {/* Parameters — wide grid, reads as a panel not a sidebar */}
      <div className="grid grid-cols-2 gap-x-10 gap-y-6 border-t border-white/[0.06] pt-6 sm:grid-cols-3">
        <Field label="Window" value={row.window} mono />
        <Field label="Committed range" value={row.committedRange} mono />
        <Field label="Span kind" value={row.spanKind} />
        <Field label="Frames" value={String(row.frameCount)} />
        <Field label="Suffix bytes" value={String(row.suffixBytes)} />
        <Field label="Approval coverage" value={row.approvalCoverage} />
      </div>

      <div className="flex flex-col gap-5 border-t border-white/[0.06] pt-6">
        <Field label="Specimen SHA-256" value={row.sha256} mono />
        {row.provenance ? (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-white/55">Provenance</span>
            <p className="text-sm leading-relaxed text-white/70">{row.provenance}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
