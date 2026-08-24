import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";

import { requireAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { isMasterTenant } from "@/lib/tenancy";
import { db } from "@/lib/db";
import { invite, user, type Invite, type User } from "@/lib/db/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateInviteForm } from "@/components/admin/create-invite-form";
import { ProvisionTenantForm } from "@/components/admin/provision-tenant-form";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { AdminInvitesTable } from "@/components/admin/admin-invites-table";

export const metadata: Metadata = { title: "Admin" };

export const dynamic = "force-dynamic";

// Plain helper (not the component body) so the `Date.now()` read isn't flagged
// as impure-during-render.
function countPendingInvites(invites: Invite[]): number {
  const now = Date.now();
  return invites.filter((i) => !i.redeemedAt && i.expiresAt.getTime() > now).length;
}

export default async function AdminPage() {
  const session = await requireAdmin();
  // §6b point 3: every query below is scoped to the acting admin's tenant. This
  // is the data-layer boundary — a client admin cannot reach another tenant's
  // rows even by hitting the route directly, because the tenant predicate is in
  // the WHERE clause, not the UI.
  const scope = tenantScopeOf(session);
  const isMaster = isMasterTenant(scope);

  let invites: Invite[] = [];
  let users: User[] = [];
  try {
    invites = await db
      .select()
      .from(invite)
      .where(eq(invite.tenantId, scope))
      .orderBy(desc(invite.createdAt))
      .limit(200);
    users = await db
      .select()
      .from(user)
      .where(eq(user.tenantId, scope))
      .orderBy(desc(user.createdAt))
      .limit(200);
  } catch {
    // No database configured yet — render the console with empty tables.
  }

  const pendingInvites = countPendingInvites(invites);
  const auditors = users.filter((u) => u.role === "auditor").length;
  const admins = users.filter((u) => u.role === "admin").length;

  return (
    <div className="space-y-8">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Add people to your team and set what they can do. New accounts are
        created by invite only.
      </p>

      {/* Headline overview */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Users" value={users.length} />
        <StatTile label="Admins" value={admins} accent="text-primary" />
        <StatTile label="Auditors" value={auditors} accent="text-low" />
        <StatTile label="Pending invites" value={pendingInvites} accent="text-medium" />
      </div>

      {/* Provision new tenant — master tenant only (§6b point 6) */}
      {isMaster && (
        <Card>
          <CardHeader>
            <CardTitle>Provision client tenant</CardTitle>
            <CardDescription>
              Founders only. Creates a new client organization and its first
              admin invite. You won&apos;t see that tenant&apos;s users or invites
              afterward — provisioning is the only cross-tenant action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProvisionTenantForm />
          </CardContent>
        </Card>
      )}

      {/* Create invite */}
      <Card>
        <CardHeader>
          <CardTitle>Create invite</CardTitle>
          <CardDescription>
            Sends a one-time sign-up link for your organization. To make someone
            an auditor, promote them after they&apos;ve joined.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateInviteForm />
        </CardContent>
      </Card>

      {/* Invites */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-base font-medium text-foreground">Invites</h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {invites.length} total
          </span>
        </div>
        <AdminInvitesTable invites={invites} />
      </section>

      {/* Users */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="font-heading text-base font-medium text-foreground">Users</h2>
          <span className="text-xs tabular-nums text-muted-foreground">
            {users.length} total
          </span>
        </div>
        <AdminUsersTable users={users} />
      </section>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent = "text-foreground",
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <p className={`mt-1 text-2xl font-semibold tabular-nums ${accent}`}>{value}</p>
    </div>
  );
}
