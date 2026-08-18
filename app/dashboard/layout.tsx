import type { CSSProperties } from "react";

import { requireAuth } from "@/lib/auth-guards";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

// All authenticated roles (analyst / auditor / admin) see the same three views
// for now — CLAUDE.md §3 does not scope views by role in this phase.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const { name, email } = session.user;
  const role = session.user.role ?? "analyst";

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 68)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <AppSidebar variant="inset" user={{ name, email, role }} />
      {/* min-w-0 lets the inset shrink so wide content (tables, the chain)
          scrolls inside its own container instead of overflowing the page. */}
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
