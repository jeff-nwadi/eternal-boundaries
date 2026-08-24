import type { CSSProperties } from "react";

import { requireAdmin } from "@/lib/auth-guards";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { CommandMenu } from "@/components/dashboard/command-menu";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const dynamic = "force-dynamic";

// Admin lives inside the same dashboard shell so the sidebar persists when you
// navigate to it. requireAdmin guards the whole section (non-admins → /dashboard).
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const { name, email } = session.user;
  const role = session.user.role ?? "admin";

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
      <SidebarInset className="min-w-0">
        <SiteHeader />
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 md:p-6">
          {children}
        </div>
      </SidebarInset>
      <CommandMenu isAdmin={role === "admin"} />
    </SidebarProvider>
  );
}
