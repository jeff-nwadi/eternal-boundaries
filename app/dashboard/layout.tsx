import Link from "next/link";

import { requireAuth } from "@/lib/auth-guards";
import { BrandMark } from "@/components/landing/brand-mark";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

// All authenticated roles (analyst / auditor / admin) see the same three views
// for now — CLAUDE.md §3 does not scope views by role in this phase.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();
  const { role } = session.user;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="border-b border-border">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark />
            {/* Persistent reminder that these views run on local sample data,
                not verified/live feeds (CLAUDE.md §5). */}
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground sm:inline-flex">
              <span className="size-1.5 rounded-full bg-medium" aria-hidden="true" />
              Sample data
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden="true" />
              {role}
            </span>
            {role === "admin" && (
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin">Admin</Link>
              </Button>
            )}
            <SignOutButton />
          </div>
        </div>
        <DashboardNav />
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
    </div>
  );
}
