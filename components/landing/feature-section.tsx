import {
  Activity,
  Waypoints,
  ListOrdered,
  Wrench,
  ClipboardCheck,
  Lock,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/reveal";

// Accurate to the product: no "export a report" (that export is still a stub),
// and the last cell reflects the real invite-only, role-based access model.
const FEATURES: { title: string; description: string; icon: LucideIcon }[] = [
  {
    icon: Activity,
    title: "Live threat feed",
    description: "Incoming threats as they arrive, in one feed.",
  },
  {
    icon: Waypoints,
    title: "See how an attack connects",
    description: "Click any threat to see attacker, tools, and target linked up.",
  },
  {
    icon: ListOrdered,
    title: "Ranked vulnerabilities",
    description: "Every weak spot in one list, sorted by severity.",
  },
  {
    icon: Wrench,
    title: "Clear fix-it steps",
    description: "Each issue comes with plain steps to fix it.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit readiness",
    description: "See how you measure up against NIST and SOC 2.",
  },
  {
    icon: Lock,
    title: "Role-based access",
    description: "Invite-only, with least-privilege analyst, auditor, and admin roles.",
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
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Everything in one place.
        </h2>
        <p className="text-pretty text-base leading-relaxed text-muted-foreground">
          Threats, weak spots, and compliance, no juggling tools.
        </p>
      </Reveal>

      <Reveal
        delay={80}
        className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl bg-white/8 sm:grid-cols-2 md:grid-cols-3"
      >
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="group relative overflow-hidden bg-background p-6 transition-colors duration-200 hover:bg-white/[0.02]"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-white/[0.04] text-white/50 transition-all duration-200 group-hover:bg-primary/10 group-hover:text-primary">
                <Icon
                  className="size-4 transition-transform duration-200 ease-out group-hover:scale-110"
                  strokeWidth={1.75}
                />
              </span>
              <h3 className="mt-4 text-base font-medium text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
              {/* Lime underline that draws in on hover */}
              <span
                aria-hidden
                className="absolute bottom-0 left-6 h-px w-12 origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </div>
          );
        })}
      </Reveal>
    </section>
  );
}
