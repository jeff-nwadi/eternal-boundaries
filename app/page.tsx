import Link from "next/link";
import { Activity, ArrowRight, ScrollText, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { BoundaryShowcase } from "@/components/landing/boundary-showcase";
import HowItWorks from "@/components/ui/how-it-works";
import { FeatureCard, type Feature } from "@/components/landing/feature-card";

const FEATURES: Feature[] = [
  {
    icon: Activity,
    title: "Threat Intelligence",
    body: "Read a live STIX 2.1 indicator feed and walk any indicator's full relationship chain — actor to malware to attack pattern to the asset it targets.",
  },
  {
    icon: ShieldAlert,
    title: "Vulnerabilities",
    body: "Every finding lands in a filterable table with severity, CVSS, and status — each one carrying human-readable remediation guidance, not just a raw scan dump.",
  },
  {
    icon: ScrollText,
    title: "Compliance Mapping",
    body: "Roll findings up against NIST SP 800-53 and SOC 2 control families to see open-versus-covered coverage per control, ready to export for review.",
  },
];

const STANDARDS = [
  { name: "NIST SP 800-53", detail: "SC · SI control families" },
  { name: "SOC 2 Type II", detail: "CC6 · CC7 criteria" },
  { name: "STIX 2.1", detail: "Structured threat intel" },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
            <div className="flex flex-col items-start gap-6">
              <Reveal
                as="span"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
                Cyber threat intelligence &amp; compliance
              </Reveal>

              <Reveal
                as="h1"
                delay={60}
                className="text-4xl font-semibold text-foreground sm:text-5xl lg:text-[3.4rem]"
              >
                See the boundary between{" "}
                <span className="text-primary">threat</span> and asset.
              </Reveal>

              <Reveal as="p" delay={120} className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Eternal Boundaries turns STIX threat feeds, vulnerability scans,
                and control coverage into one clear picture — built for the SOC
                analysts, CISOs, and auditors accountable for what crosses the
                line.
              </Reveal>

              <Reveal delay={180} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg">
                  <Link href="/login">
                    Get started
                    <ArrowRight strokeWidth={1.75} />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/login">Sign in</Link>
                </Button>
              </Reveal>
            </div>

            <Reveal delay={140}>
              <BoundaryShowcase />
            </Reveal>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="boundary-line" />
        </div>

        {/* Platform / features */}
        <section id="platform" className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20">
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              Features
            </span>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Three views. One accountable picture.
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              No sprawling SIEM console — the dashboard stays deliberately narrow
              so the signal your teams act on stays legible.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {FEATURES.map((feature, i) => (
              <Reveal key={feature.title} delay={i * 90} className="h-full">
                <FeatureCard feature={feature} className="h-full" />
              </Reveal>
            ))}
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="boundary-line" />
        </div>

        {/* How it works */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              How it works
            </span>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Get started in three simple steps.
            </h2>
          </Reveal>

          <HowItWorks className="mt-10" />
        </section>

        {/* Standards strip */}
        <section id="standards" className="scroll-mt-20 border-y border-border bg-card/40">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-14 lg:flex-row lg:items-center lg:justify-between">
            <Reveal className="max-w-md">
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                Grounded in the frameworks your auditors already use.
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Findings map to named control families, not invented scores — so
                the coverage you show is the coverage you can trace.
              </p>
            </Reveal>

            <Reveal delay={100} className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3 lg:w-auto">
              {STANDARDS.map((s) => (
                <div
                  key={s.name}
                  className="rounded-lg border border-border bg-background px-4 py-3"
                >
                  <div className="text-sm font-semibold text-foreground">
                    {s.name}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {s.detail}
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-24">
          <Reveal className="flex flex-col items-center gap-6 text-center">
            <h2 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
              Bring your threat and compliance signal inside the boundary.
            </h2>
            <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
              Sign in to the dashboard, or start a new workspace for your team.
            </p>
            <Button asChild size="lg">
              <Link href="/login">
                Get started
                <ArrowRight strokeWidth={1.75} />
              </Link>
            </Button>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
