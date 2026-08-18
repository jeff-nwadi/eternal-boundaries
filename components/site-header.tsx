"use client";

import { usePathname } from "next/navigation";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

function titleFor(pathname: string): string {
  if (pathname.startsWith("/admin")) return "Admin";
  if (pathname.startsWith("/dashboard/vulnerabilities")) return "Vulnerabilities";
  if (pathname.startsWith("/dashboard/compliance")) return "Compliance Mapping";
  return "Threat Intelligence";
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
