import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/landing/brand-mark";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to the Eternal Boundaries dashboard.",
};

/**
 * Placeholder auth route (Phase 2 will replace this with BetterAuth
 * login/signup). Kept as a stub so the landing-page CTAs resolve.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-8 text-center">
        <div className="flex justify-center">
          <BrandMark />
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-foreground">Sign in</h1>
          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
            Authentication is coming in the next phase. This is a placeholder for
            the login and signup experience.
          </p>
        </div>

        <div className="mt-6">
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <ArrowLeft strokeWidth={1.75} />
              Back to home
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
