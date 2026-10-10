import * as React from "react";
import { Users, Bug, ShieldOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import type { StixObject, StixEdge } from "@/lib/mock-data";

const TYPE_META: Record<string, { icon: LucideIcon; label: string }> = {
  "threat-actor": { icon: Users, label: "Attacker" },
  malware: { icon: Bug, label: "Malware" },
  vulnerability: { icon: ShieldOff, label: "Weak spot" },
};

export function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: ShieldOff, label: type };
}

/** Order the chain by walking edges from the root (only-source) node. */
export function buildChain(objects: StixObject[], edges: StixEdge[]) {
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

/**
 * Indicator detail laid out as two columns on wider viewports (rectangular
 * modal) and stacked on narrow ones (the mobile detail page). The visible name
 * is a plain heading; the modal adds its own sr-only DialogTitle for a11y.
 */
export function IndicatorDetail({
  selected,
  chain,
}: {
  selected: StixObject;
  chain: { node: StixObject; edgeType?: string }[];
}) {
  const meta = typeMeta(selected.type);
  return (
    <div className="grid gap-8 p-6 sm:grid-cols-2 sm:gap-10">
      {/* Left: identity */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-white/55">{meta.label}</span>
          <h2 className="font-heading text-2xl font-semibold text-white">
            {selected.name ?? selected.id}
          </h2>
        </div>
        {selected.description ? (
          <p className="text-sm leading-relaxed text-white/75">{selected.description}</p>
        ) : null}
        <p className="mt-auto font-mono text-xs break-all text-white/35">{selected.id}</p>
      </div>

      {/* Right: the relationship chain across the boundary (signature motif) */}
      <div className="flex flex-col gap-1">
        <span className="text-sm text-white/55">How it connects</span>
        <div className="mt-2 flex flex-col">
          {chain.map((step, i) => {
            const stepMeta = typeMeta(step.node.type);
            const Icon = stepMeta.icon;
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
                    <span className="text-xs text-white/40">{stepMeta.label}</span>
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
            <span className="text-sm text-white/55">Your systems (not in sample)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
