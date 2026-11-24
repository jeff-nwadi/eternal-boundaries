"use client";

import { useStixBundle, type StixBundleObject } from "@/lib/queries/use-stix-bundle";
import { Panel } from "@/components/dashboard/ui/panel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function typeLabel(type: string): string {
  const map: Record<string, string> = {
    vulnerability: "Vulnerability",
    indicator: "Indicator",
    "observed-data": "Observed data",
    "threat-actor": "Threat actor",
    malware: "Malware",
  };
  return map[type] ?? type;
}

function displayName(obj: StixBundleObject): string {
  if (obj.name) return obj.name;
  const action = obj.x_etbv_gate_proof?.action;
  if (action) return `Layer-Zero gate · ${action.replaceAll("_", " ").toLowerCase()}`;
  return obj.id;
}

/** Badge for the engine-reported gate action (dropped = alert, passed = ok). */
function ActionBadge({ action }: { action?: string }) {
  if (!action) return <span className="text-black/40">—</span>;
  const dropped = action.toUpperCase().includes("DROP") || action.toUpperCase().includes("BLOCK");
  const color = dropped ? "var(--severity-critical)" : "var(--severity-low)";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-medium text-black/70"
      title={action}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: color }} aria-hidden />
      {action.replaceAll("_", " ").toLowerCase()}
    </span>
  );
}

function fmt(date?: string) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(date)
  );
}

export function LiveThreatFeed() {
  const { data, isLoading, isError, error, refetch, isFetching } = useStixBundle();
  const objects = data?.objects ?? [];

  const statusChip = (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-black/[0.05] px-2.5 py-0.5 text-xs font-medium text-black/60">
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: isError ? "var(--severity-high)" : "var(--severity-low)" }}
        aria-hidden
      />
      {isError ? "Engine unreachable" : isFetching ? "Syncing…" : "Live"}
    </span>
  );

  return (
    <Panel
      title="Live Layer-Zero gate feed"
      description="Streamed from the engine · reported by engine, not independently verified"
      action={statusChip}
    >
      {isLoading ? (
        <div className="flex flex-col gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-black/[0.05]" />
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-black/55">
            Live engine unreachable. {error instanceof Error ? error.message : ""} The sample
            explorer below still works.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="rounded-lg bg-black/[0.06] px-3 py-1.5 text-sm font-medium text-black/80 hover:bg-black/[0.1] hover:text-black"
          >
            Retry
          </button>
        </div>
      ) : objects.length === 0 ? (
        <p className="text-sm text-black/55">No objects from the live gate yet.</p>
      ) : (
        <div className="-mx-3 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm font-normal text-black/55">Object</TableHead>
                <TableHead className="text-sm font-normal text-black/55">Type</TableHead>
                <TableHead className="text-sm font-normal text-black/55">Gate action</TableHead>
                <TableHead className="text-sm font-normal text-black/55">Protocol</TableHead>
                <TableHead className="text-right text-sm font-normal text-black/55">Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objects.map((obj) => (
                <TableRow key={obj.id} className="hover:bg-transparent">
                  <TableCell className="max-w-[320px] truncate font-medium text-black" title={displayName(obj)}>
                    {displayName(obj)}
                  </TableCell>
                  <TableCell className="text-black/55">{typeLabel(obj.type)}</TableCell>
                  <TableCell>
                    <ActionBadge action={obj.x_etbv_gate_proof?.action} />
                  </TableCell>
                  <TableCell className="text-black/55">
                    {obj.x_etbv_gate_proof?.protocol ?? "—"}
                  </TableCell>
                  <TableCell className="text-right text-black/55">{fmt(obj.modified)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Panel>
  );
}
