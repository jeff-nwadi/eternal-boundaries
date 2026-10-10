"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import type { StixObject, StixEdge } from "@/lib/mock-data";
import { useIsMobile } from "@/hooks/use-mobile";
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
import { EmptyState } from "@/components/dashboard/ui/empty-state";
import {
  buildChain,
  typeMeta,
  IndicatorDetail,
} from "@/components/dashboard/threat/indicator-detail";

function fmt(date?: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(date));
}

export function ThreatIndicators({
  objects,
  edges,
}: {
  objects: StixObject[];
  edges: StixEdge[];
}) {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [selected, setSelected] = React.useState<StixObject | null>(null);
  const [query, setQuery] = React.useState("");
  const chain = React.useMemo(() => buildChain(objects, edges), [objects, edges]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return objects;
    return objects.filter((o) =>
      [o.name ?? o.id, typeMeta(o.type).label].some((s) => s.toLowerCase().includes(q))
    );
  }, [objects, query]);

  // Desktop opens a modal; mobile routes to a full detail page.
  function open(obj: StixObject) {
    if (isMobile) {
      router.push(`/dashboard/threat/${encodeURIComponent(obj.id)}`);
    } else {
      setSelected(obj);
    }
  }

  const search = (
    <div className="relative w-full sm:w-64">
      <Search
        className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-white/40"
        aria-hidden
      />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search indicators…"
        className="h-9 pl-8"
        aria-label="Search indicators"
      />
    </div>
  );

  return (
    <Panel title="Indicators" action={search}>
      {objects.length === 0 ? (
        <EmptyState message="No indicators in the sample feed yet." />
      ) : (
        <div className="-mx-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm font-normal text-white/55">Indicator</TableHead>
                <TableHead className="text-sm font-normal text-white/55">Type</TableHead>
                <TableHead className="text-sm font-normal text-white/55">Status</TableHead>
                <TableHead className="text-right text-sm font-normal text-white/55">
                  Updated
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={4} className="h-20 text-center text-white/55">
                    No indicators match “{query}”.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((obj) => {
                  const meta = typeMeta(obj.type);
                  return (
                    <TableRow
                      key={obj.id}
                      onClick={() => open(obj)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View ${obj.name ?? obj.id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          open(obj);
                        }
                      }}
                      className="cursor-pointer focus-visible:bg-white/[0.04] focus-visible:outline-none"
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
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Desktop: rectangular, two-column modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[85vh] max-w-2xl gap-0 overflow-y-auto p-0 ring-white/10 sm:max-w-2xl">
          {selected ? (
            <>
              <DialogTitle className="sr-only">
                {selected.name ?? selected.id}
              </DialogTitle>
              <IndicatorDetail selected={selected} chain={chain} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </Panel>
  );
}
