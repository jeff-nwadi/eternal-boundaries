import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { CloudFieldBackground } from "@/components/landing/cloud-field-background";
import { Hero } from "@/components/landing/hero";
import { BoundaryDiagram } from "@/components/landing/boundary-diagram";
import { FeatureSection } from "@/components/landing/feature-section";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import HowItWorks from "@/components/ui/how-it-works";
import { AsciiContourBackground } from "@/components/landing/ascii-contour-background";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import {
  STATS,
  PRODUCT_VIEWS,
  COMPLIANCE_FRAMEWORKS,
  SECURITY_POINTS,
  TESTIMONIALS,
  FAQS,
} from "@/lib/content";

function Divider() {
  return (
    <div className="mx-auto w-full max-w-6xl px-6">
      <div className="boundary-line" />
    </div>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-medium uppercase tracking-[0.2em]">
      {children}
    </span>
  );
}

export default function Home() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-background">
      {/* Cloud-field WebGL background behind the nav + hero (ThreeUI cloud-field) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[720px] overflow-hidden sm:h-[840px]">
        <CloudFieldBackground className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/5 to-background"
        />
      </div>

      <SiteHeader />

      <main className="relative z-10 flex-1">
        {/* ---------- Hero ---------- */}
        <Hero />

        {/* ---------- Three-view product strip ---------- */}
        <section
          id="product"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>The platform</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Three views, one clear picture.
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Threats, weak spots, and compliance in one place.
            </p>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
            {PRODUCT_VIEWS.map((view, i) => {
              const Icon = view.icon;
              return (
                <Reveal
                  key={view.name}
                  delay={60 + i * 70}
                  className="group flex flex-col rounded-2xl bg-card p-6 ring-1 ring-white/8 transition-colors duration-200 hover:ring-primary/30"
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
                    {view.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {view.summary}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Learn more
                    <ArrowUpRight
                      className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={2}
                    />
                  </span>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ---------- Boundary diagram (anime.js) ---------- */}
        <section className="mx-auto w-full max-w-5xl scroll-mt-20 px-6 py-20">
          <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center">
            <Eyebrow>The boundary</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              External out. Protected in.
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Every threat is resolved at the line between untrusted and protected.
            </p>
          </Reveal>
          <Reveal delay={80} className="mt-10">
            <BoundaryDiagram />
          </Reveal>
        </section>

        {/* ---------- Features ---------- */}
        <FeatureSection />

        {/* ---------- How it works ---------- */}
        <section
          id="how-it-works"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>How it works</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Get started in three simple steps.
            </h2>
          </Reveal>
          <HowItWorks className="mt-10" />
        </section>

        {/* ---------- Compliance frameworks ---------- */}
        <section
          id="compliance"
          className="scroll-mt-20 border-y border-white/8 bg-card/40"
        >
          <div className="mx-auto w-full max-w-4xl px-6 py-20">
            <Reveal className="flex max-w-2xl flex-col gap-3">
              <Eyebrow>Compliance mapping</Eyebrow>
              <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                Mapped to the standards auditors trust.
              </h2>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                Every finding ties to real control families, in plain language.
              </p>
            </Reveal>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              {COMPLIANCE_FRAMEWORKS.map((fw, i) => (
                <Reveal
                  key={fw.name}
                  delay={60 + i * 80}
                  className="rounded-2xl bg-background p-6 ring-1 ring-white/8"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-heading text-lg font-semibold text-foreground">
                      {fw.name}
                    </h3>
                    <span className="text-xs font-medium text-primary">
                      {fw.scope}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {fw.plain}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Security overview ---------- */}
        <section
          id="security"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>Security and architecture</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Built for teams that answer to auditors.
            </h2>
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {SECURITY_POINTS.map((point, i) => (
              <Reveal
                key={point.title}
                delay={40 + i * 50}
                className="border-t border-white/10 pt-4"
              >
                <h3 className="font-heading text-base font-semibold text-foreground">
                  {point.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {point.description}
                </p>
              </Reveal>
            ))}
          </div>
        </section>


        {/* ---------- Pricing ---------- */}
        <PricingTeaser />

        {/* ---------- Testimonials (structurally ready, intentionally empty) ---------- */}
        <section className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20">
          <Reveal className="flex flex-col items-center gap-3 text-center">
            <Eyebrow>Customer stories</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Coming soon.
            </h2>
            <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground">
              {TESTIMONIALS.length === 0
                ? "Onboarding our first design partners. Real stories land here, never placeholders."
                : ""}
            </p>
          </Reveal>
        </section>

        {/* ---------- FAQ ---------- */}
        <section
          id="faq"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>FAQ</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Questions, answered.
            </h2>
          </Reveal>
          <Reveal delay={80} className="mt-8">
            <FaqAccordion
              data={FAQS}
              timestamp=""
              className="max-w-2xl p-0"
              answerClassName="bg-card border border-white/8 text-foreground"
            />
          </Reveal>
        </section>

        {/* ---------- Closing CTA ---------- */}
        <section className="mx-auto w-full max-w-6xl px-6 py-20">
          <Reveal className="relative overflow-hidden rounded-3xl bg-card px-6 py-16 ring-1 ring-white/8 sm:px-10 sm:py-20">
            <AsciiContourBackground />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(62% 62% at 50% 50%, color-mix(in oklab, var(--card) 80%, transparent) 0%, transparent 100%)",
              }}
            />
            <div className="relative z-10 flex flex-col items-center gap-6 text-center">
              <h2 className="max-w-2xl font-heading text-3xl font-semibold text-foreground sm:text-4xl">
                See your security clearly.
              </h2>
              <p className="max-w-lg text-pretty text-base leading-relaxed text-muted-foreground">
                Sign in, or start a workspace for your team.
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
