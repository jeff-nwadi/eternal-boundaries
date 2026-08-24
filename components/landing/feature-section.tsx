"use client";

import {
  ClipboardCheck,
  FileDown,
  ListChecks,
  Radar,
  ShieldAlert,
  Waypoints,
} from "lucide-react";

import { Reveal } from "@/components/reveal";
import { FeatureCard } from "@/components/ui/grid-feature-cards";

const FEATURES = [
  {
    title: "Live threat feed",
    icon: Radar,
    description: "See incoming threats as they arrive, all in one live feed.",
  },
  {
    title: "See how an attack connects",
    icon: Waypoints,
    description:
      "Click any threat to see how the attacker, their tools, and the target link up.",
  },
  {
    title: "Vulnerability list",
    icon: ShieldAlert,
    description: "Every weak spot in one list, sorted by how serious it is.",
  },
  {
    title: "Clear fix-it steps",
    icon: ListChecks,
    description: "Each issue comes with simple, plain-language steps to fix it.",
  },
  {
    title: "Audit readiness",
    icon: ClipboardCheck,
    description:
      "See how you measure up against the checklists auditors use, like NIST and SOC 2.",
  },
  {
    title: "Shareable reports",
    icon: FileDown,
    description: "Export a clean report to share with your team or auditors.",
  },
];

export function FeatureSection() {
  return (
    <section
      id="platform"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
    >
      <Reveal className="flex max-w-2xl flex-col gap-3">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Features
        </span>
        <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
          Everything your team needs, in one place.
        </h2>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          See threats, fix weak spots, and track compliance — without juggling
          separate tools.
        </p>
      </Reveal>

      <Reveal
        delay={80}
        className="mt-10 overflow-hidden rounded-xl border border-dashed border-border"
      >
        <div className="grid grid-cols-1 divide-x divide-y divide-dashed divide-border sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
