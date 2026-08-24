"use client";

import * as React from "react";
import {
  Bug,
  ChevronRight,
  Info,
  Server,
  ShieldAlert,
  ShieldOff,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { StixEdge, StixObject } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const TYPE_META: Record<string, { icon: LucideIcon; label: string }> = {
  "threat-actor": { icon: Users, label: "Attacker" },
  malware: { icon: Bug, label: "Malware" },
  vulnerability: { icon: ShieldOff, label: "Weak Spot" },
};

const PLACEHOLDER_ASSET_ID = "asset--placeholder";

function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: ShieldOff, label: type };
}

export function ThreatView({
  objects,
  edges,
}: {
  objects: StixObject[];
  edges: StixEdge[];
}) {
  const chain = React.useMemo(() => buildChain(objects, edges), [objects, edges]);

  const [selectedId, setSelectedId] = React.useState<string>(
    chain[0]?.node.id ?? objects[0]?.id ?? ""
  );
  const selected =
    objects.find((o) => o.id === selectedId) ??
    (selectedId === PLACEHOLDER_ASSET_ID ? null : objects[0]);

  if (objects.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-sm text-muted-foreground">
          No threats recorded in the stream.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Overview subtitle & legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>Attack propagation pathway from threat vector to internal system.</span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-destructive/80" aria-hidden />
            External Threat Vector
          </span>
          <span className="inline-flex items-center gap-1.5 font-medium">
            <span className="size-2 rounded-full bg-foreground/60" aria-hidden />
            Protected System
          </span>
        </div>
      </div>

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Attack chain graph card */}
        <Card className="min-w-0 border-border/60 bg-card/80 shadow-xs">
          <CardHeader className="flex-row items-center justify-between pb-3 pt-4 px-4">
            <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-2">
              <ShieldAlert className="size-4 text-muted-foreground" />
              Attack Chain Pathway
            </CardTitle>
            <span className="text-xs text-muted-foreground/70">
              Interactive · Click step for details
            </span>
          </CardHeader>
          <CardContent className="px-4 pb-4 overflow-x-auto no-scrollbar">
            <div className="flex flex-col items-stretch gap-3 lg:w-max lg:flex-row lg:items-center py-2">
              {/* Chain steps */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                {chain.map((step, i) => (
                  <React.Fragment key={step.node.id}>
                    {i > 0 && <Connector label={step.edgeType} />}
                    <ThreatNode
                      object={step.node}
                      selected={selectedId === step.node.id}
                      onSelect={() => setSelectedId(step.node.id)}
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* Perimeter boundary */}
              <Boundary />

              {/* Internal protected asset */}
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                <Connector label="targets" dashed />
                <PlaceholderAssetNode
                  selected={selectedId === PLACEHOLDER_ASSET_ID}
                  onSelect={() => setSelectedId(PLACEHOLDER_ASSET_ID)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Threat Inspector panel */}
        <Card className="h-fit border-border/60 bg-card/80 shadow-xs">
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold tracking-tight text-foreground flex items-center gap-1.5">
                <Info className="size-4 text-muted-foreground" />
                Threat Inspector
              </CardTitle>
              {selected && (
                <Badge variant="outline" className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {selected.type}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            {selectedId === PLACEHOLDER_ASSET_ID ? (
              <PlaceholderAssetDetail />
            ) : selected ? (
              <ObjectDetail object={selected} />
            ) : (
              <p className="py-6 text-center text-xs text-muted-foreground">
                Select a step in the attack chain to view telemetry.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function buildChain(objects: StixObject[], edges: StixEdge[]) {
  const targets = new Set(edges.map((e) => e.targetRef));
  const root = objects.find((o) => !targets.has(o.id)) ?? objects[0];
  const steps: { node: StixObject; edgeType?: string }[] = [];
  if (!root) return steps;

  const seen = new Set<string>();
  let currentId: string | undefined = root.id;
  let edgeType: string | undefined;
  while (currentId && !seen.has(currentId)) {
    seen.add(currentId);
    const node = objects.find((o) => o.id === currentId);
    if (!node) break;
    steps.push({ node, edgeType });
    const next = edges.find((e) => e.sourceRef === currentId);
    currentId = next?.targetRef;
    edgeType = next?.type;
  }
  return steps;
}

function ThreatNode({
  object,
  selected,
  onSelect,
}: {
  object: StixObject;
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = typeMeta(object.type);
  const Icon = meta.icon;
  const types = object.threat_actor_types ?? object.malware_types;

  return (
    <HoverCard openDelay={150} closeDelay={80}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className={cn(
            "group relative w-full shrink-0 lg:w-52 rounded-lg border bg-card p-3 text-left transition-all duration-150 ease-out",
            selected
              ? "border-foreground/40 bg-accent/30 ring-1 ring-foreground/20 shadow-xs"
              : "border-border/70 hover:border-border hover:bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-foreground border border-border/50">
                <Icon strokeWidth={1.75} className="size-3.5" />
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                {meta.label}
              </span>
            </div>
            {selected && (
              <span className="size-1.5 rounded-full bg-foreground" aria-hidden />
            )}
          </div>
          <p className="mt-2 line-clamp-1 text-sm font-semibold text-foreground tracking-tight">
            {object.name ?? object.id}
          </p>
          <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground/80">
            {object.id}
          </p>
        </button>
      </HoverCardTrigger>
      <HoverCardContent side="top" className="w-72 p-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-foreground border border-border/50">
              <Icon strokeWidth={1.75} className="size-3.5" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {meta.label}
              </p>
              <p className="truncate text-xs font-semibold text-foreground">
                {object.name ?? object.id}
              </p>
            </div>
          </div>
          {object.description && (
            <p className="text-pretty text-xs leading-relaxed text-muted-foreground">
              {object.description}
            </p>
          )}
          {types && types.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {types.map((t) => (
                <Badge key={t} variant="secondary" className="text-[10px] py-0 px-1.5">
                  {t}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

function PlaceholderAssetNode({
  selected,
  onSelect,
}: {
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group relative w-full shrink-0 lg:w-52 rounded-lg border border-dashed bg-card p-3 text-left transition-all duration-150 ease-out",
        selected
          ? "border-foreground/40 bg-accent/30 ring-1 ring-foreground/20 shadow-xs"
          : "border-border hover:border-foreground/30 hover:bg-muted/30"
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-6 shrink-0 items-center justify-center rounded bg-secondary text-foreground border border-border/50">
            <Server strokeWidth={1.75} className="size-3.5" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            Target System
          </span>
        </div>
        {selected && (
          <span className="size-1.5 rounded-full bg-foreground" aria-hidden />
        )}
      </div>
      <p className="mt-2 text-sm font-semibold text-foreground tracking-tight">
        Example Internal Server
      </p>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">
          asset--placeholder
        </span>
        <Badge variant="outline" className="text-[9px] py-0 px-1">
          Sample
        </Badge>
      </div>
    </button>
  );
}

function Connector({ label, dashed }: { label?: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 py-1 lg:flex-col lg:gap-1 lg:py-0">
      <div className="flex items-center text-muted-foreground/50">
        <span
          className={cn(
            "h-px w-5 lg:w-7",
            dashed
              ? "border-t border-dashed border-border"
              : "bg-border-strong"
          )}
        />
        <ChevronRight className="size-3.5 shrink-0 -ml-1 text-muted-foreground/70" strokeWidth={2} />
      </div>
      {label && (
        <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-wider text-muted-foreground uppercase border border-border/40">
          {label}
        </span>
      )}
    </div>
  );
}

function Boundary() {
  return (
    <div className="flex items-center justify-center py-2 lg:h-28 lg:flex-col lg:py-0">
      <div
        className="hidden lg:block w-px bg-border/80 border-r border-dashed border-border"
        aria-hidden="true"
        style={{ height: "100%" }}
      />
      <span className="my-auto rounded border border-border bg-muted/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground lg:[writing-mode:vertical-rl] lg:rotate-180">
        Perimeter
      </span>
    </div>
  );
}

function ObjectDetail({ object }: { object: StixObject }) {
  const meta = typeMeta(object.type);
  const Icon = meta.icon;
  const types = object.threat_actor_types ?? object.malware_types;

  return (
    <div className="space-y-4 text-xs">
      {/* Header Info */}
      <div className="flex items-start gap-3 border-b border-border/50 pb-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-foreground">
          <Icon strokeWidth={1.75} className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-foreground leading-snug truncate">
            {object.name ?? object.id}
          </h3>
          <p className="text-muted-foreground font-medium">{meta.label}</p>
        </div>
      </div>

      {/* Description */}
      {object.description && (
        <div className="space-y-1">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Overview
          </span>
          <p className="rounded-md border border-border/40 bg-muted/30 p-2.5 leading-relaxed text-muted-foreground text-pretty">
            {object.description}
          </p>
        </div>
      )}

      {/* Categories / Types */}
      {types && types.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            Classifications
          </span>
          <div className="flex flex-wrap gap-1">
            {types.map((t) => (
              <Badge key={t} variant="secondary" className="text-[10px]">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Fields */}
      <div className="space-y-2 border-t border-border/50 pt-3">
        <DetailRow label="Type" value={object.type} />
        {object.created && (
          <DetailRow label="Created" value={object.created.slice(0, 10)} />
        )}
        {object.modified && (
          <DetailRow label="Modified" value={object.modified.slice(0, 10)} />
        )}
      </div>

      {/* Reference Identifier */}
      <div className="space-y-1 border-t border-border/50 pt-3">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          STIX Reference ID
        </span>
        <div className="break-all rounded border border-border/40 bg-muted/40 p-2 font-mono text-[10px] text-muted-foreground">
          {object.id}
        </div>
      </div>
    </div>
  );
}

function PlaceholderAssetDetail() {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded border border-border bg-secondary text-foreground">
            <Server strokeWidth={1.75} className="size-4" />
          </span>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Example Internal Server</h3>
            <p className="text-muted-foreground">Target System</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[10px]">Sample</Badge>
      </div>
      <p className="rounded-md border border-border/40 bg-muted/30 p-2.5 leading-relaxed text-muted-foreground">
        This placeholder represents your internal infrastructure target. In live deployments, this connects live agent telemetry and endpoint boundaries.
      </p>
      <div className="space-y-1">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
          Asset ID
        </span>
        <div className="font-mono text-[10px] text-muted-foreground">
          asset--placeholder
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
