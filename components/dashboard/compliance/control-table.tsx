"use client";

import type { ColumnDef } from "@tanstack/react-table";

import type { ControlFamily } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { controlInfo } from "@/lib/control-reference";
import { DataTable } from "@/components/ui/data-table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Monochrome status — no color beyond black/white here (color is reserved for
 * buttons and links). "Compliant" recedes (muted, hollow dot); anything needing
 * attention reads prominent (foreground, filled dot).
 */
function ComplianceStatus({ status }: { status: string }) {
  const needsAttention = status.toLowerCase() !== "compliant";
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm">
      <span
        aria-hidden
        className={cn(
          "size-1.5 shrink-0 rounded-full",
          needsAttention ? "bg-white" : "bg-white/30"
        )}
      />
      <span className={needsAttention ? "font-medium text-white" : "text-white/55"}>
        {status}
      </span>
    </span>
  );
}

const columns: ColumnDef<ControlFamily>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const info = controlInfo(row.original.id, row.original.name);
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="cursor-help rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs text-white underline-offset-2 decoration-dotted decoration-white/30 hover:underline">
              {row.original.id}
            </span>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-medium">{info.name}</p>
            <p className="mt-1 text-xs text-background/70">
              Formal name of this control ({row.original.id}).
            </p>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    id: "what",
    header: "What it checks",
    enableSorting: false,
    meta: { className: "min-w-[240px] whitespace-normal" },
    cell: ({ row }) => (
      <span className="text-pretty text-sm leading-relaxed text-white/75">
        {controlInfo(row.original.id, row.original.name).plain}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ComplianceStatus status={row.original.status} />,
  },
  {
    accessorKey: "details",
    header: "Notes",
    enableSorting: false,
    meta: { className: "min-w-[220px] whitespace-normal" },
    cell: ({ row }) => (
      <span className="text-pretty text-sm leading-relaxed text-white/55">
        {row.original.details}
      </span>
    ),
  },
];

import type { ComplianceMapping } from "@/lib/queries/use-compliance-mappings";

const liveColumns: ColumnDef<ComplianceMapping>[] = [
  {
    accessorKey: "control_id",
    header: "Control ID",
    cell: ({ row }) => (
      <span className="rounded-md bg-white/[0.06] px-2 py-0.5 font-mono text-xs font-medium text-white">
        {row.original.control_id}
      </span>
    ),
  },
  {
    accessorKey: "framework_component",
    header: "Framework Component",
    meta: { className: "min-w-[220px] whitespace-normal" },
    cell: ({ row }) => (
      <span className="text-sm font-medium leading-relaxed text-white/75">
        {row.original.framework_component}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <ComplianceStatus status={row.original.status} />,
  },
  {
    accessorKey: "last_assessed",
    header: "Last Assessed",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-white/55">
        {row.original.last_assessed}
      </span>
    ),
  },
];

export function LiveControlTable({ mappings }: { mappings: ComplianceMapping[] }) {
  return (
    <TooltipProvider delayDuration={150}>
      <DataTable
        columns={liveColumns}
        data={mappings}
        emptyMessage="No compliance mappings reported by the backend engine."
      />
    </TooltipProvider>
  );
}

export function ControlTable({ families }: { families: ControlFamily[] }) {
  return (
    <TooltipProvider delayDuration={150}>
      <DataTable
        columns={columns}
        data={families}
        emptyMessage="No control families detailed in the sample."
      />
    </TooltipProvider>
  );
}
