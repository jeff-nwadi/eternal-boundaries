"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, ShieldAlert, ClipboardCheck, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const NAV: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Threat Intelligence", href: "/dashboard", icon: Radar },
  { label: "Vulnerabilities", href: "/dashboard/vulnerabilities", icon: ShieldAlert },
  { label: "Compliance", href: "/dashboard/compliance", icon: ClipboardCheck },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-border px-4 sm:px-6">
      {NAV.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              // `group` scopes the hover so only the icon animates, not the tab.
              "group -mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors duration-150 ease-out",
              active
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              strokeWidth={1.75}
              className={cn(
                "size-4 transition-transform duration-200 ease-out group-hover:scale-110",
                active ? "text-primary" : ""
              )}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
