import Link from "next/link";

import { BrandMark } from "@/components/landing/brand-mark";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <BrandMark />
          <p className="max-w-sm text-pretty text-sm text-muted-foreground">
            Threat intelligence, vulnerability, and compliance signal — read in
            one place, by the teams accountable for it.
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 text-sm text-muted-foreground sm:items-end">
          <Link
            href="/login"
            className="rounded-md transition-colors duration-150 ease-out hover:text-foreground"
          >
            Sign in
          </Link>
          <span className="tabular-nums">
            © {new Date().getFullYear()} Eternal Boundaries LLC
          </span>
        </div>
      </div>
    </footer>
  );
}
