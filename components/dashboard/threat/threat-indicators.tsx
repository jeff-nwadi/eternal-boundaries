"use client";

import * as React from "react";
import { Users, Bug, ShieldOff, ChevronRight, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StixObject, StixEdge } from "@/lib/mock-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { StatusLabel } from "@/components/dashboard/ui/status-label";
import { EmptyState } from "@/components/dashboard/ui/empty-state";

const TYPE_META: Record<string, { icon: LucideIcon; label: string }> = {
  "threat-actor": { icon: Users, label: "Attacker" },
  malware: { icon: Bug, label: "Malware" },
  vulnerability: { icon: ShieldOff, label: "Weak spot" },
};
function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: ShieldOff, label: type };
}

function fmt(date?: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

/** Order the chain by walking edges from the root (only-source) node. */
function buildChain(objects: StixObject[], edges: StixEdge[]) {
  const targets = new Set(edges.map((e) => e.targetRef));
  const root = objects.find((o) => !targets.has(o.id)) ?? objects[0];
  const steps: { node: StixObject; edgeType?: string }[] = [];
  const seen = new Set<string>();
  let id: string | undefined = root?.id;
  let edgeType: string | undefined;
  while (id && !seen.has(id)) {
    seen.add(id);
    const node = objects.find((o) => o.id === id);
    if (!node) break;
    steps.push({ node, edgeType });
    const next = edges.find((e) => e.sourceRef === id);
    id = next?.targetRef;
    edgeType = next?.type;
  }
  return steps;
}

export function ThreatIndicators({
  objects,
  edges,
}: {
  objects: StixObject[];
  edges: StixEdge[];
}) {
  const [selected, setSelected] = React.useState<StixObject | null>(null);
  const chain = React.useMemo(() => buildChain(objects, edges), [objects, edges]);

  if (objects.length === 0) {
    return <EmptyState message="No indicators in the sample feed yet." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white/[0.04]">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="text-sm font-normal text-white/55">Indicator</TableHead>
            <TableHead className="text-sm font-normal text-white/55">Type</TableHead>
            <TableHead className="text-sm font-normal text-white/55">Status</TableHead>
            <TableHead className="text-right text-sm font-normal text-white/55">Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {objects.map((obj) => {
            const meta = typeMeta(obj.type);
            return (
              <TableRow
                key={obj.id}
                onClick={() => setSelected(obj)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium text-white">
                  {obj.name ?? obj.id}
                </TableCell>
                <TableCell className="text-white/55">{meta.label}</TableCell>
                <TableCell>
                  {/* Unverified sample data — status is a claim, not a verified fact. */}
                  <StatusLabel value="CLAIMED" />
                </TableCell>
                <TableCell className="text-right text-white/55">
                  {fmt(obj.modified)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Relationship-chain side panel */}
      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent side="right" className="w-full border-0 bg-background p-0 sm:max-w-md">
          <SheetTitle className="sr-only">Indicator detail</SheetTitle>
          {selected ? (
            <IndicatorDetail selected={selected} chain={chain} />
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function IndicatorDetail({
  selected,
  chain,
}: {
  selected: StixObject;
  chain: { node: StixObject; edgeType?: string }[];
}) {
  return (
    <div className="flex h-full flex-col gap-8 overflow-y-auto p-6">
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white/55">{typeMeta(selected.type).label}</span>
        <h2 className="font-heading text-2xl font-semibold text-white">
          {selected.name ?? selected.id}
        </h2>
      </div>

      {selected.description ? (
        <p className="text-sm leading-relaxed text-white/75">{selected.description}</p>
      ) : null}

      {/* Relationship chain across the boundary — the one signature element,
          drawn with thin lime lines on the dark canvas. */}
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white/55">How it connects</span>
        <div className="mt-2 flex flex-col">
          {chain.map((step, i) => {
            const meta = typeMeta(step.node.type);
            const Icon = meta.icon;
            const isSelected = step.node.id === selected.id;
            return (
              <React.Fragment key={step.node.id}>
                {i > 0 ? (
                  <span className="ml-[0.6875rem] flex items-center gap-2 py-1 text-xs text-white/40">
                    <span className="h-5 w-px bg-primary/60" aria-hidden />
                    {step.edgeType}
                  </span>
                ) : null}
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5",
                    isSelected ? "bg-white/[0.06]" : "bg-white/[0.02]"
                  )}
                >
                  <Icon className="size-4 shrink-0 text-white/70" strokeWidth={1.75} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-white">
                      {step.node.name ?? step.node.id}
                    </span>
                    <span className="text-xs text-white/40">{meta.label}</span>
                  </span>
                </div>
              </React.Fragment>
            );
          })}

          {/* The boundary line, then the protected side (no asset in the sample) */}
          <span className="ml-[0.6875rem] flex items-center gap-2 py-1 text-xs text-white/40">
            <span className="h-5 w-px bg-primary/60" aria-hidden />
            targets
          </span>
          <div className="relative flex items-center gap-3 rounded-xl border-l-2 border-primary bg-white/[0.02] px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-primary">
              Boundary
            </span>
            <span className="text-sm text-white/55">
              Your systems (not in sample)
            </span>
          </div>
        </div>
      </div>

      <p className="font-mono text-xs break-all text-white/35">{selected.id}</p>
    </div>
  );
}
