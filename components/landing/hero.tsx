import Link from "next/link";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { ProductPreview } from "@/components/landing/product-preview";

// Headline: Option 1 (chosen on your behalf; swap lines 1/2 to use another).
// Line 1 bold upright white, line 2 italic same size, tight leading, clamp-scaled.
// "SplitReveal" is approximated with the existing Reveal + an overflow mask
// (no GSAP/SplitText installed). No stagger: every element shares one delay.
export function Hero() {
  return (
    <section className="relative px-6 pt-14 pb-10 sm:pt-20">
      {/* Contrast overlay (palette-only: the #0A0D10 background color, faded) so
          white text stays legible over the brighter parts of the cloud field. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0"
        style={{
          background:
            "radial-gradient(72% 58% at 50% 34%, color-mix(in oklab, var(--background) 70%, transparent) 0%, transparent 78%)",
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">

        {/* 2. Headline */}
        <h1 className="font-heading text-[clamp(2.4rem,8.5vw,4.5rem)] font-semibold leading-[1.04] tracking-tight text-white">
          <span className="block overflow-hidden pb-[0.08em]">
              Threats, explained.
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="block font-normal italic">
              Compliance, mapped.
            </span>
          </span>
        </h1>

        {/* 3. Subhead */}
        <p
          className="max-w-2xl text-pretty text-lg leading-relaxed text-white/70"
        >
          Clear threat and compliance views your whole team can read.
        </p>

        {/* 4. CTA (the only lime element besides small accents) */}

          <Button
            asChild
            size="lg"
            className="rounded-full px-6 font-semibold"
          >
            <Link href="/login">Get Started</Link>
          </Button>

        {/* 5. Trust line (no "certified / compliant / verified") */}
        {/* <Reveal className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-white/50">
          <span>Invite-only access</span>
          <span aria-hidden className="size-1 rounded-full bg-white/30" />
          <span>Maps to NIST SP 800-53 and SOC 2</span>
          <span aria-hidden className="size-1 rounded-full bg-white/30" />
          <span>Role-based permissions</span>
        </Reveal> */}
      </div>

      {/* Product preview */}
      <Reveal className="relative z-10 mt-14">
        <ProductPreview />
      </Reveal>
    </section>
  );
}
