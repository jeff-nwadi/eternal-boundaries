import { Reveal } from "@/components/reveal";

// Text-led feature cells (icons removed to reduce visual noise).
const FEATURES = [
  { title: "Live threat feed", description: "Incoming threats as they arrive, in one feed." },
  {
    title: "See how an attack connects",
    description: "Click any threat to see attacker, tools, and target linked up.",
  },
  { title: "Ranked vulnerabilities", description: "Every weak spot in one list, sorted by severity." },
  { title: "Clear fix-it steps", description: "Each issue comes with plain steps to fix it." },
  {
    title: "Audit readiness",
    description: "See how you measure up against NIST and SOC 2.",
  },
  { title: "Shareable reports", description: "Export a clean report for your team or auditors." },
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
        {FEATURES.map((feature) => (
          <div key={feature.title} className="bg-background p-6">
            <h3 className="text-base font-medium text-foreground">
              {feature.title}
            </h3>
            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
