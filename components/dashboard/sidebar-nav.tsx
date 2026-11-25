"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Radar,
  ShieldAlert,
  ClipboardCheck,
  ShieldCheck,
  Shield,
  ScrollText,
  Inbox,
  Settings,
  LogOut,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { BrandMark } from "@/components/landing/brand-mark";
import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";

type NavItem = { label: string; href: string; icon: LucideIcon; adminOnly?: boolean };

const NAV: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Threat Intelligence", href: "/dashboard/threat", icon: Radar },
  { label: "Vulnerabilities", href: "/dashboard/vulnerabilities", icon: ShieldAlert },
  { label: "Compliance", href: "/dashboard/compliance", icon: ClipboardCheck },
  { label: "Gate Proof", href: "/dashboard/proof", icon: ShieldCheck },
  // Engine Lab (/dashboard/lab) is built but hidden from nav — it only shows
  // offline benchmark data, not a live/validated capability. Re-add when there
  // is a real proof to put behind it.
  { label: "Team", href: "/admin", icon: Shield, adminOnly: true },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

// Founders' master tenant gets an account-control experience only — no SOC
// pages (§6b: no standing access to client data). Account management lives in
// the control panel at /admin.
const MASTER_NAV: NavItem[] = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Accounts", href: "/admin/accounts", icon: Shield },
  { label: "Demo requests", href: "/admin/demo-requests", icon: Inbox },
  { label: "Audit log", href: "/admin/audit", icon: ScrollText },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

function initialOf(name: string) {
  return (name.trim()[0] ?? "U").toUpperCase();
}

/** Read-only chip showing whether the displayed data is sample or live. */
function DataModeChip() {
  const { isLoading, isError, data } = useComplianceMappings();
  // Honest default: the stat numbers come from the received sample files, so
  // the mode reads "Sample data" unless the live engine actually returns data.
  const live = !isLoading && !isError && !!data?.mappings?.length;
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-black/[0.04] px-3 py-2 text-sm text-black/55">
      <span
        className={cn("size-1.5 rounded-full", live ? "bg-primary" : "bg-black/40")}
        aria-hidden
      />
      {live ? "Live" : "Sample data"}
    </span>
  );
}

export function SidebarNav({
  user,
  orgName,
  isMaster = false,
  onNavigate,
}: {
  user: { name: string; email: string; role: string };
  orgName: string;
  isMaster?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = React.useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" || href === "/admin"
      ? pathname === href
      : pathname.startsWith(href);

  async function signOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/login");
  }

  const items = isMaster
    ? MASTER_NAV
    : NAV.filter((i) => !i.adminOnly || user.role === "admin");

  return (
    <div className="flex h-full flex-col gap-10 p-4">
      {/* Logo + placeholder wordmark */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        aria-label="Eternal Boundaries"
        className="px-2 pt-2 transition-opacity duration-150 hover:opacity-80"
      >
        <BrandMark />
      </Link>

      {/* Read-only chips: org (own tenant, not a switcher) + data mode */}
      <div className="flex flex-col gap-2">
        <span className="truncate rounded-lg bg-black/[0.04] px-3 py-2 text-sm text-black/70">
          {orgName}
        </span>
        {!isMaster && <DataModeChip />}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors duration-150",
                active
                  ? "bg-black/[0.08] text-black"
                  : "text-black/55 hover:bg-black/[0.04] hover:text-black"
              )}
            >
              <Icon
                className="size-4 shrink-0 transition-transform duration-200 ease-out group-hover:scale-110"
                strokeWidth={1.75}
              />
              <span className="flex-1">{item.label}</span>
              {active && (
                <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Account card */}
      <div className="flex flex-col gap-3 rounded-2xl bg-black/[0.04] p-3">
        <div className="flex items-center gap-3">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-black/[0.08] text-sm font-medium text-black">
            {initialOf(user.name)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-black">
              {user.name}
            </span>
            <span className="block truncate text-sm text-black/55">{user.email}</span>
          </span>
        </div>
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-black/[0.06] px-3 py-2 text-sm font-medium text-black/80 transition-colors duration-150 hover:bg-black/[0.1] hover:text-black disabled:opacity-60"
        >
          <LogOut className="size-4" strokeWidth={1.75} />
          {signingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}
