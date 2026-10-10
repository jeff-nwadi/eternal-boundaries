"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { BrandMark } from "@/components/landing/brand-mark";

const NAV = [
  { label: "Product", href: "#platform" },
  { label: "Compliance", href: "#compliance" },
  { label: "Security", href: "#security" },
  { label: "Docs", href: "#" }, // placeholder: no docs page yet
  { label: "Pricing", href: "/pricing" }, // "coming soon" page
];

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    // Compact pill attached to the top edge, only bottom corners rounded.
    // Scrolls with the page (not sticky), per the brief.
    <header className="relative z-40 flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-b-3xl border-x border-b border-white/10 bg-background/90 pl-5 pr-2 backdrop-blur-md">
          {/* Placeholder logo: wordmark + lime boundary-line glyph (BrandMark). */}
          <Link
            href="/"
            aria-label="Eternal Boundaries home"
            className="shrink-0 rounded-md transition-opacity duration-150 ease-out hover:opacity-80"
          >
            <BrandMark />
          </Link>

          {/* Desktop links (>= lg); collapse to a menu at 375 / 768 */}
          <nav className="absolute inset-y-0 left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="rounded-full px-3 py-2 text-sm text-white/70 transition-colors duration-150 ease-out hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href="/login"
              className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary/90"
            >
              Sign in
            </Link>

            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="inline-flex size-9 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/8 hover:text-white lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile open panel */}
        <div
          className={cn(
            "overflow-hidden rounded-b-3xl border-x border-b border-white/10 bg-background/95 backdrop-blur-md transition-[max-height,opacity] duration-200 ease-out lg:hidden",
            open ? "max-h-80 opacity-100" : "max-h-0 border-transparent opacity-0"
          )}
        >
          <nav className="flex flex-col gap-0.5 p-3">
            {NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/8 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
