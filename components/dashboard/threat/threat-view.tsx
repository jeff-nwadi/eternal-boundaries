"use client";

import * as React from "react";
import {
  Bug,
  ChevronRight,
  Server,
  ShieldOff,
  Users,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { StixEdge, StixObject } from "@/lib/mock-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TYPE_META: Record<string, { icon: LucideIcon; label: string }> = {
  "threat-actor": { icon: Users, label: "Threat actor" },
  malware: { icon: Bug, label: "Malware" },
  vulnerability: { icon: ShieldOff, label: "Vulnerability" },
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
  // Order the chain by following edges from the root (a node that is only ever
  // a source, never a target). With this sample that yields
  // threat-actor → malware → vulnerability.
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
          No indicators in the STIX sample.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Indicator feed and relationship chain from the STIX sample, split across
        the trust boundary.
      </p>

      <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* Relationship chain across the boundary */}
        <Card className="min-w-0">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Relationship chain</CardTitle>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-critical" aria-hidden />
                External
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" aria-hidden />
                Protected
              </span>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <div className="flex flex-col items-stretch gap-4 lg:w-max lg:flex-row lg:items-center">
              {/* External / untrusted: the resolved chain */}
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                {chain.map((step, i) => (
                  <React.Fragment key={step.node.id}>
                    {i > 0 && <Connector label={step.edgeType} />}
                    <ThreatNode
                      object={step.node}
                      zone="external"
                      selected={selectedId === step.node.id}
                      onSelect={() => setSelectedId(step.node.id)}
                    />
                  </React.Fragment>
                ))}
              </div>

              {/* The signature boundary line */}
              <Boundary />

              {/* Internal / protected: placeholder asset (no asset object in
                  the sample — clearly marked). */}
              <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
                <Connector label="targets" dashed />
                <PlaceholderAssetNode
                  selected={selectedId === PLACEHOLDER_ASSET_ID}
                  onSelect={() => setSelectedId(PLACEHOLDER_ASSET_ID)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detail panel */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedId === PLACEHOLDER_ASSET_ID ? (
              <PlaceholderAssetDetail />
            ) : selected ? (
              <ObjectDetail object={selected} />
            ) : (
              <p className="text-sm text-muted-foreground">
                Select an indicator to see its details.
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
  zone,
  selected,
  onSelect,
}: {
  object: StixObject;
  zone: "external" | "protected";
  selected: boolean;
  onSelect: () => void;
}) {
  const meta = typeMeta(object.type);
  const Icon = meta.icon;
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group w-full shrink-0 lg:w-44 rounded-lg border bg-popover p-3 text-left transition-colors duration-150 ease-out",
        selected ? "border-primary ring-1 ring-primary/40" : "border-border hover:border-border-strong"
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-md border",
            zone === "external"
              ? "border-critical/25 bg-critical/10 text-critical"
              : "border-primary/25 bg-primary/10 text-primary"
          )}
        >
          <Icon strokeWidth={1.75} className="size-4 transition-transform duration-200 ease-out group-hover:scale-110" />
        </span>
        <span className="text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">
          {meta.label}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-sm font-medium text-foreground">
        {object.name ?? object.id}
      </p>
    </button>
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
        "group w-full shrink-0 lg:w-44 rounded-lg border border-dashed bg-popover p-3 text-left transition-colors duration-150 ease-out",
        selected ? "border-primary ring-1 ring-primary/40" : "border-border-strong hover:border-primary/40"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex size-7 items-center justify-center rounded-md border border-primary/25 bg-primary/10 text-primary">
          <Server strokeWidth={1.75} className="size-4 transition-transform duration-200 ease-out group-hover:scale-110" />
        </span>
        <span className="text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">
          Protected asset
        </span>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">Internal asset</p>
      <Badge variant="outline" className="mt-2">
        Placeholder
      </Badge>
    </button>
  );
}

function Connector({ label, dashed }: { label?: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-1 lg:flex-col lg:gap-1">
      <div className="flex items-center text-muted-foreground/60">
        <span
          className={cn(
            "h-px w-6 lg:w-8",
            dashed
              ? "border-t border-dashed border-border-strong"
              : "bg-border-strong"
          )}
        />
        <ChevronRight className="size-3.5" strokeWidth={2} />
      </div>
      {label && (
        <span className="text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  );
}

function Boundary() {
  return (
    <div className="flex items-center justify-center lg:h-40 lg:flex-col">
      <div
        className="boundary-vertical hidden lg:block"
        aria-hidden="true"
        style={{ height: "100%" }}
      />
      <div className="boundary-line lg:hidden" aria-hidden="true" />
      <span className="px-2 text-[0.625rem] font-medium uppercase tracking-[0.2em] text-primary lg:[writing-mode:vertical-rl] lg:rotate-180">
        Boundary
      </span>
    </div>
  );
}

function ObjectDetail({ object }: { object: StixObject }) {
  const meta = typeMeta(object.type);
  return (
    <dl className="space-y-3 text-sm">
      <Field label="Type" value={meta.label} />
      <Field label="Name" value={object.name} />
      {object.description && (
        <div className="space-y-1">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Description
          </dt>
          <dd className="text-pretty leading-relaxed text-foreground">
            {object.description}
          </dd>
        </div>
      )}
      {object.threat_actor_types && (
        <Field label="Actor types" value={object.threat_actor_types.join(", ")} />
      )}
      {object.malware_types && (
        <Field label="Malware types" value={object.malware_types.join(", ")} />
      )}
      <Field label="Created" value={object.created?.slice(0, 10)} />
      <Field label="Modified" value={object.modified?.slice(0, 10)} />
      <div className="space-y-1">
        <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          STIX id
        </dt>
        <dd className="break-all font-mono text-xs text-muted-foreground">
          {object.id}
        </dd>
      </div>
    </dl>
  );
}

function PlaceholderAssetDetail() {
  return (
    <div className="space-y-3 text-sm">
      <Badge variant="outline">Placeholder</Badge>
      <p className="text-pretty leading-relaxed text-muted-foreground">
        The STIX sample contains no infrastructure or asset objects and no
        <span className="font-mono"> targets</span> edge (CLAUDE.md §5.1). This
        node is a placeholder shown only to illustrate the internal/external
        boundary layout — it is not derived from the data.
      </p>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-right text-foreground">{value}</dd>
    </div>
  );
}
