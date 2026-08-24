"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { OPEN_COMMAND_MENU } from "@/components/dashboard/command-menu";

function titleFor(pathname: string): string {
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/dashboard/threat")) return "Threat Intelligence";
  if (pathname.startsWith("/dashboard/vulnerabilities")) return "Vulnerabilities";
  if (pathname.startsWith("/dashboard/compliance")) return "Compliance Mapping";
  return "Overview";
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium text-foreground">
          {titleFor(pathname)}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event(OPEN_COMMAND_MENU))}
            className="group hidden items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground transition-colors duration-150 ease-out hover:text-foreground sm:inline-flex"
            aria-label="Open command menu"
          >
            <Search className="size-3.5 transition-transform duration-200 ease-out group-hover:scale-110" strokeWidth={1.75} />
            Search
            <kbd className="ml-1 rounded border border-border bg-background px-1 font-mono text-[0.625rem] text-muted-foreground">
              ⌘K
            </kbd>
          </button>
          {/* Persistent reminder: local sample data, not verified/live feeds
              (CLAUDE.md §5). */}
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground">
            <span className="size-1.5 rounded-full bg-medium" aria-hidden="true" />
            Sample data
          </span>
        </div>
      </div>
    </header>
  );
}
