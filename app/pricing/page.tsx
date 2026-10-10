import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = { title: "Pricing — Eternal Boundaries" };

// PLACEHOLDER page. Pricing is not finalized; this is a "coming soon" stub.
export default function PricingPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
          Pricing
        </span>
        <h1 className="font-heading text-4xl font-semibold text-foreground">
          Coming soon.
        </h1>
        <p className="max-w-md text-pretty text-lg leading-relaxed text-white/70">
          Plans and pricing are not finalized yet. Request a demo and we will walk
          you through what a deployment looks like for your team.
        </p>
        <Link href="/contact" className="text-sm font-medium text-primary hover:underline">
          Request a demo
        </Link>
      </main>
    </div>
  );
}
