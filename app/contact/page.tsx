import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = { title: "Request a demo — Eternal Boundaries" };

// PLACEHOLDER page. No real contact form or lead capture is wired up yet.
export default function ContactPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-5 px-6 py-24 text-center">
        <h1 className="font-heading text-4xl font-semibold text-foreground">
          Request a demo
        </h1>
        <p className="max-w-md text-pretty text-lg leading-relaxed text-white/70">
          A contact form is coming soon. In the meantime we will set up a walkthrough
          of the threat, vulnerability, and compliance views for your team.
        </p>
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          Back to home
        </Link>
      </main>
    </div>
  );
}
