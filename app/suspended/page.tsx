import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { ShieldOff } from "lucide-react";

import { requireAuth } from "@/lib/auth-guards";
import { isMasterTenant } from "@/lib/tenancy";
import { db } from "@/lib/db";
import { tenant } from "@/lib/db/schema";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const metadata: Metadata = { title: "Account suspended" };

export const dynamic = "force-dynamic";

/**
 * Lockout page for users whose tenant has been suspended by a founder. Sits
 * OUTSIDE the /dashboard and /admin groups so the layout redirects can land here
 * without looping. Active users (and founders) are bounced back out.
 */
export default async function SuspendedPage() {
  const session = await requireAuth();
  const tenantId = (session.user as { tenantId?: string }).tenantId;

  // Founders can never be suspended.
  if (isMasterTenant(tenantId)) redirect("/admin");

  // Resolve status without swallowing redirect(): read inside the try, decide
  // outside it (redirect throws a control-flow signal that must propagate).
  let status: string | null = null;
  if (tenantId) {
    try {
      const [row] = await db
        .select({ status: tenant.status })
        .from(tenant)
        .where(eq(tenant.id, tenantId))
        .limit(1);
      status = row?.status ?? null;
    } catch {
      // No DB — show the notice rather than guessing the tenant is active.
    }
  }
  if (status && status !== "suspended") redirect("/dashboard");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="flex max-w-md flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <ShieldOff className="size-6" strokeWidth={1.75} />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            Your account is suspended
          </h1>
          <p className="text-sm text-muted-foreground">
            Access to the dashboard has been paused for your organization. If you
            think this is a mistake, contact your administrator — only they can
            restore access.
          </p>
        </div>
        <SignOutButton />
      </div>
    </main>
  );
}
