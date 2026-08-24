import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { HeroVisual } from "@/components/landing/hero-visual";
import { FeatureSection } from "@/components/landing/feature-section";
import HowItWorks from "@/components/ui/how-it-works";
import { AsciiContourBackground } from "@/components/landing/ascii-contour-background";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";

const FAQ = [
  {
    id: 1,
    question: "What is Eternal Boundaries?",
    answer:
      "One dashboard that brings your threat feed, vulnerabilities, and compliance status together so your team can act on them.",
  },
  {
    id: 2,
    question: "Do I need to replace my current tools?",
    answer:
      "No. It reads the data your existing tools produce and gives you one clear place to work from.",
  },
  {
    id: 3,
    question: "How do the fix-it steps work?",
    answer:
      "Each vulnerability comes with plain-language steps to fix it — not just a raw scan result.",
  },
  {
    id: 4,
    question: "Which compliance standards do you cover?",
    answer:
      "Your results line up with NIST 800-53 and SOC 2 — the checklists auditors use — so coverage is easy to trace.",
  },
  {
    id: 5,
    question: "Who is it built for?",
    answer:
      "Security teams, their leaders, and compliance auditors who need one clear view of what's happening.",
  },
];

const STANDARDS = [
  { name: "NIST 800-53", detail: "U.S. government security checklist" },
  { name: "SOC 2", detail: "Trust & security audit standard" },
  { name: "STIX", detail: "Standard format for sharing threat data" },
];

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-6 pb-16 pt-16 sm:pt-24">
          <div className="flex flex-col items-center text-center gap-12">
            <div className="flex max-w-3xl flex-col items-center gap-6">
              <Reveal
                as="h1"
                delay={60}
                className="text-4xl font-semibold text-foreground sm:text-5xl lg:text-[3.4rem]"
              >
                Know what&apos;s putting your business{" "}
                <span className="text-primary">at risk</span> — and fix it first.
              </Reveal>

              <Reveal as="p" delay={120} className="max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                Eternal Boundaries brings your security alerts, weak spots, and
                compliance status into one clear dashboard — so your team can see
                what&apos;s exposed, fix what matters, and prove it to auditors.
              </Reveal>

              <Reveal delay={180} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
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

            <Reveal delay={140} className="w-full max-w-2xl">
              <HeroVisual />
            </Reveal>
          </div>
        </section>

        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="boundary-line" />
        </div>

        {/* Features */}
        <FeatureSection />

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
                Built on the security standards auditors already trust.
              </h2>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                Your results line up with recognized standards like NIST and SOC 2
                — so the coverage you report is coverage you can back up.
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

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              FAQ
            </span>
            <h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Questions, answered.
            </h2>
          </Reveal>

          <Reveal delay={80} className="mt-8">
            <FaqAccordion
              data={FAQ}
              timestamp=""
              className="max-w-2xl p-0"
              answerClassName="bg-card border border-border text-foreground"
            />
          </Reveal>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <Reveal className="relative overflow-hidden rounded-3xl border border-border bg-card px-6 py-16 sm:px-10 sm:py-20">
            {/* Animated Canvas2D "contour" ASCII effect (silk field). */}
            <AsciiContourBackground />
            {/* Radial scrim keeps the heading + CTA crisp over the effect. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(62% 62% at 50% 50%, color-mix(in oklab, var(--card) 80%, transparent) 0%, transparent 100%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <h2 className="max-w-2xl text-3xl font-semibold text-foreground sm:text-4xl">
                Get a clear picture of your security — starting today.
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
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
