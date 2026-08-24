"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Radar,
  ShieldAlert,
  ClipboardCheck,
  Shield,
  FileText,
  Database,
  Settings,
  LifeBuoy,
  Search,
  type LucideIcon,
} from "lucide-react";

import { BrandMark } from "@/components/landing/brand-mark";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type NavItem = { title: string; url: string; icon: LucideIcon };

// Primary nav → Overview + the three detail views (CLAUDE.md §3).
const NAV: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Threat Intelligence", url: "/dashboard/threat", icon: Radar },
  { title: "Vulnerabilities", url: "/dashboard/vulnerabilities", icon: ShieldAlert },
  { title: "Compliance", url: "/dashboard/compliance", icon: ClipboardCheck },
];

// Lower groups (dashboard-01's "Documents" + secondary sections), adapted.
// These are placeholder destinations for now — no such pages exist yet.
const RESOURCES: NavItem[] = [
  { title: "Reports", url: "#", icon: FileText },
  { title: "Data sources", url: "#", icon: Database },
];

const SECONDARY: NavItem[] = [
  { title: "Settings", url: "#", icon: Settings },
  { title: "Get Help", url: "#", icon: LifeBuoy },
  { title: "Search", url: "#", icon: Search },
];

// Icon-only-on-hover motion (150–250ms), consistent across the app.
const iconHover =
  "[&>svg]:transition-transform [&>svg]:duration-200 [&>svg]:ease-out hover:[&>svg]:scale-110";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();

  const isActive = (url: string) =>
    url === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(url);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center px-2 py-1.5 transition-opacity duration-150 ease-out hover:opacity-80"
        >
          <BrandMark />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Primary — the three views */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                      className={iconHover}
                    >
                      <Link href={item.url}>
                        <Icon strokeWidth={1.75} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              {user.role === "admin" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith("/admin")}
                    tooltip="Admin"
                    className={iconHover}
                  >
                    <Link href="/admin">
                      <Shield strokeWidth={1.75} />
                      <span>Admin</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Resources */}
        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {RESOURCES.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title} className={iconHover}>
                      <a href={item.url}>
                        <Icon strokeWidth={1.75} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary — anchored to the bottom */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="sm" tooltip={item.title} className={iconHover}>
                      <a href={item.url}>
                        <Icon strokeWidth={1.75} />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
