import Link from "next/link";

import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/landing/brand-mark";

const NAV = [
  { label: "Features", href: "#platform" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Standards", href: "#standards" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="rounded-md transition-opacity duration-150 ease-out hover:opacity-80"
          aria-label="Eternal Boundaries home"
        >
          <BrandMark />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/login">Get started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
