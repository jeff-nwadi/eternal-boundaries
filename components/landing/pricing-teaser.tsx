"use client";

import * as React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { PRICING } from "@/lib/content";

function priceLabel(value: number | null, cycle: "monthly" | "annual") {
  if (value === null) return "Custom";
  if (value === 0) return "Free";
  const n = cycle === "annual" ? Math.round(value / 12) : value;
  return `$${n.toLocaleString()}`;
}

export function PricingTeaser() {
  const [cycle, setCycle] = React.useState<"monthly" | "annual">("monthly");

  return (
    <section id="pricing" className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 py-20">
      <Reveal className="flex flex-col items-center gap-3 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Pricing
        </span>
        <h2 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">
          Simple plans for every team.
        </h2>
        {/* Honesty flag, visible to visitors. */}
        <p className="text-sm text-muted-foreground">
          {PRICING.note}
        </p>
      </Reveal>

      {/* Monthly / annual toggle */}
      <Reveal delay={60} className="mt-8 flex items-center justify-center">
        <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-card p-1">
          {(["monthly", "annual"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCycle(c)}
              aria-pressed={cycle === c}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors duration-150",
                cycle === c
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {c}
              {c === "annual" && (
                <span
                  className={cn(
                    "ml-1.5 text-xs",
                    cycle === c ? "text-primary-foreground/80" : "text-primary"
                  )}
                >
                  2 months free
                </span>
              )}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {PRICING.tiers.map((tier, i) => {
          const price = priceLabel(
            cycle === "annual" ? tier.annual : tier.monthly,
            cycle
          );
          const showPerMonth = price !== "Free" && price !== "Custom";
          return (
            <Reveal
              key={tier.name}
              delay={80 + i * 60}
              className={cn(
                "flex flex-col rounded-2xl p-6",
                tier.highlighted
                  ? "bg-card ring-1 ring-primary/40"
                  : "bg-card ring-1 ring-white/8"
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {tier.name}
                </h3>
                {tier.highlighted && (
                  <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-muted-foreground">{tier.blurb}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-heading text-4xl font-semibold tabular-nums text-foreground">
                  {price}
                </span>
                {showPerMonth && (
                  <span className="text-sm text-muted-foreground">/ mo</span>
                )}
              </div>
              {cycle === "annual" && showPerMonth && (
                <p className="mt-1 text-xs text-muted-foreground">billed annually</p>
              )}

              <ul className="mt-6 flex flex-1 flex-col gap-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      strokeWidth={2}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={tier.highlighted ? "default" : "outline"}
                className="mt-7 w-full"
              >
                <Link href="/login">{tier.cta}</Link>
              </Button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
