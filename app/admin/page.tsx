import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";

import { requireAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { isMasterTenant } from "@/lib/tenancy";
import { db } from "@/lib/db";
import { invite, user, type Invite, type User } from "@/lib/db/schema";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { CreateInviteForm } from "@/components/admin/create-invite-form";
import { ProvisionTenantForm } from "@/components/admin/provision-tenant-form";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { AdminInvitesTable } from "@/components/admin/admin-invites-table";

export const metadata: Metadata = { title: "Team" };

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
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-white sm:text-4xl">Team</h1>
        <p className="text-sm text-white/55">
          Manage your team and access. Accounts are invite-only.
        </p>
      </header>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={users.length} />
        <StatCard label="Admins" value={admins} />
        <StatCard label="Auditors" value={auditors} />
        <StatCard label="Pending invites" value={pendingInvites} />
      </div>

      {/* Provision new tenant — master tenant only (§6b point 6) */}
      {isMaster && (
        <section className="flex flex-col gap-5 rounded-2xl bg-white/[0.04] p-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-medium text-white">Provision client tenant</h2>
            <p className="text-sm text-white/55">
              Founders only. Creates a new client organization and its first admin
              invite. You will not see that tenant&apos;s users or invites afterward.
            </p>
          </div>
          <ProvisionTenantForm />
        </section>
      )}

      {/* Create invite */}
      <section className="flex flex-col gap-5 rounded-2xl bg-white/[0.04] p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-white">Create invite</h2>
          <p className="text-sm text-white/55">
            Sends a one-time sign-up link for your organization. To make someone an
            auditor, promote them after they join.
          </p>
        </div>
        <CreateInviteForm />
      </section>

      {/* Invites */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-white">Invites</h2>
          <span className="text-sm tabular-nums text-white/55">
            {invites.length} total
          </span>
        </div>
        <AdminInvitesTable invites={invites} />
      </section>

      {/* Users */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-white">Users</h2>
          <span className="text-sm tabular-nums text-white/55">
            {users.length} total
          </span>
        </div>
        <AdminUsersTable users={users} />
      </section>
    </div>
  );
}
