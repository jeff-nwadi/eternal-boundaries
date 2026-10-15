import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { CloudFieldBackground } from "@/components/landing/cloud-field-background";
import { Hero } from "@/components/landing/hero";
import { PlatformBento } from "@/components/landing/platform-bento";
import { ComplianceShowcase } from "@/components/landing/compliance-showcase";
import { BoundaryDiagram } from "@/components/landing/boundary-diagram";
import { FeatureSection } from "@/components/landing/feature-section";
import { PricingTeaser } from "@/components/landing/pricing-teaser";
import HowItWorks from "@/components/ui/how-it-works";
import { AsciiContourBackground } from "@/components/landing/ascii-contour-background";
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { SECURITY_POINTS, FAQS } from "@/lib/content";

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
    <SmoothScroll>
    <div className="relative flex min-h-dvh flex-col bg-background">
      {/* Hero background. An instant CSS gradient paints immediately (static
          HTML, zero JS) so the hero is never empty; the heavier WebGL cloud
          field then fades in on top on capable desktops. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[720px] overflow-hidden sm:h-[840px]">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 50% 12%, color-mix(in oklab, var(--primary) 14%, transparent) 0%, transparent 68%), radial-gradient(55% 45% at 72% 8%, rgba(129,100,214,0.16) 0%, transparent 70%), radial-gradient(45% 45% at 28% 14%, rgba(56,122,180,0.12) 0%, transparent 70%)",
          }}
        />
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

        {/* ---------- Interactive platform bento ---------- */}
        <section
          id="product"
          className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20"
        >
          <Reveal className="flex max-w-2xl flex-col gap-3">
            <Eyebrow>The platform</Eyebrow>
            <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
              Everything in one clear picture.
            </h2>
            <p className="text-pretty text-base leading-relaxed text-muted-foreground">
              Threats, weak spots, and compliance. Hover any panel to see it move.
            </p>
          </Reveal>

          <Reveal delay={80} className="mt-10">
            <PlatformBento />
          </Reveal>
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
          className="relative scroll-mt-20 overflow-hidden border-y border-white/8"
        >
          {/* Subtle imagery backdrop (Unsplash) under a heavy dark wash */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80&auto=format&fit=crop"
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.12]"
          />
          <div aria-hidden className="absolute inset-0 bg-background/85" />
          <div className="relative z-10 mx-auto w-full max-w-4xl px-6 py-20">
            <Reveal className="flex max-w-2xl flex-col gap-3">
              <Eyebrow>Compliance mapping</Eyebrow>
              <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
                Mapped to the standards auditors trust.
              </h2>
              <p className="text-pretty text-base leading-relaxed text-muted-foreground">
                Every finding ties to real control families, in plain language.
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-10">
              <ComplianceShowcase />
            </Reveal>
            <p className="mt-5 text-xs text-muted-foreground">
              Illustrative coverage. Mapped to control families, not an audit result.
            </p>
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

          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-stretch">
            {/* Atmospheric image (Unsplash) with a dark gradient so it reads as
                texture on the dark canvas, not a literal stock photo. */}
            <Reveal className="relative min-h-[320px] overflow-hidden rounded-3xl ring-1 ring-white/8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop"
                alt="Rows of servers in a dark data center"
                loading="lazy"
              decoding="async"
                className="absolute inset-0 h-full w-full object-cover opacity-80"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20"
              />
              <div
                aria-hidden
                className="absolute inset-y-0 left-0 w-px bg-primary/60"
              />
              <span className="absolute bottom-6 left-6 right-6 font-heading text-lg font-semibold text-white">
                External out. Protected in. One boundary.
              </span>
            </Reveal>

            <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
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
          </div>
        </section>


        {/* ---------- Pricing ---------- */}
        <PricingTeaser />

        {/* ---------- Testimonials (structurally ready, intentionally empty) ---------- */}
        {/* <section className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20">
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
        </section> */}

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
    </SmoothScroll>
  );
}
