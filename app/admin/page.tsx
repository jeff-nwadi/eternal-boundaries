import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, ne } from "drizzle-orm";
import { ArrowUpRight } from "lucide-react";

import { requireAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { isMasterTenant } from "@/lib/tenancy";
import { db } from "@/lib/db";
import { invite, user, tenant, type Invite, type User, type Tenant } from "@/lib/db/schema";
import { StatCard } from "@/components/dashboard/overview/stat-card";
import { CreateInviteForm } from "@/components/admin/create-invite-form";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { AdminInvitesTable } from "@/components/admin/admin-invites-table";

export const metadata: Metadata = { title: "Overview" };

export const dynamic = "force-dynamic";

// Plain helper (not the component body) so the `Date.now()` read isn't flagged
// as impure-during-render.
function countPendingInvites(invites: Invite[]): number {
  const now = Date.now();
  return invites.filter((i) => !i.redeemedAt && i.expiresAt.getTime() > now).length;
}

export default async function AdminPage() {
  const session = await requireAdmin();
  // §6b: every query is scoped to the acting admin's own tenant (WHERE clause,
  // not the UI). The master tenant additionally lists client tenant *entities*.
  const scope = tenantScopeOf(session);
  const isMaster = isMasterTenant(scope);

  let invites: Invite[] = [];
  let users: User[] = [];
  let tenants: Tenant[] = [];
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
    if (isMaster) {
      tenants = await db
        .select()
        .from(tenant)
        .where(ne(tenant.isMaster, true))
        .orderBy(tenant.name)
        .limit(200);
    }
  } catch {
    // No database configured yet — render with empty values.
  }

  const pendingInvites = countPendingInvites(invites);
  const auditors = users.filter((u) => u.role === "auditor").length;
  const admins = users.filter((u) => u.role === "admin").length;

  // ---- Founders' control-panel overview (master tenant) ----
  if (isMaster) {
    const recent = tenants.slice(0, 6);
    return (
      <div className="flex flex-col gap-10">
        <header className="flex flex-col gap-1">
          <h1 className="font-heading text-2xl font-semibold text-black sm:text-4xl">Overview</h1>
          <p className="text-sm text-black/55">
            Your founders&apos; control panel. Account-level analytics only.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Client tenants" value={tenants.length} caption="provisioned" />
          <StatCard
            label="Founders’ team"
            value={users.length}
            caption={`${admins} admin${admins === 1 ? "" : "s"}, ${auditors} auditor${auditors === 1 ? "" : "s"}`}
          />
          <StatCard label="Pending invites" value={pendingInvites} caption="founders’ team" />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Link
            href="/admin/accounts"
            className="group flex items-start justify-between gap-4 rounded-2xl bg-black/[0.04] p-6 transition-colors hover:bg-black/[0.07]"
          >
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-black">Provision a client tenant</span>
              <span className="text-sm text-black/55">
                Create a new client organization and its first admin invite.
              </span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-black/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
          </Link>
          <Link
            href="/admin/accounts"
            className="group flex items-start justify-between gap-4 rounded-2xl bg-black/[0.04] p-6 transition-colors hover:bg-black/[0.07]"
          >
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-black">Manage founders’ team</span>
              <span className="text-sm text-black/55">
                Invite or review your own master-tenant team.
              </span>
            </span>
            <ArrowUpRight className="size-5 shrink-0 text-black/40 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.75} />
          </Link>
        </div>

        {/* Recent client tenants */}
        <section className="flex flex-col gap-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-black">Client tenants</h2>
            <Link href="/admin/accounts" className="text-sm text-primary hover:underline">
              Manage accounts →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="rounded-2xl bg-black/[0.04] p-6 text-sm text-black/55">
              No client tenants provisioned yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-black/[0.04]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-black/55">
                    <th className="px-6 py-3 font-normal">Organization</th>
                    <th className="px-6 py-3 font-normal">Tenant ID</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-t border-black/[0.06]">
                      <td className="px-6 py-3 font-medium text-black">{t.name}</td>
                      <td className="px-6 py-3 font-mono text-black/55">{t.id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    );
  }

  // ---- Client admin: their own team ----
  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-black sm:text-4xl">Team</h1>
        <p className="text-sm text-black/55">
          Manage your team and access. Accounts are invite-only.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Users" value={users.length} />
        <StatCard label="Admins" value={admins} />
        <StatCard label="Auditors" value={auditors} />
        <StatCard label="Pending invites" value={pendingInvites} />
      </div>

      <section className="flex flex-col gap-5 rounded-2xl bg-black/[0.04] p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-black">Create invite</h2>
          <p className="text-sm text-black/55">
            Sends a one-time sign-up link for your organization. To make someone an
            auditor, promote them after they join.
          </p>
        </div>
        <CreateInviteForm />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Invites</h2>
          <span className="text-sm tabular-nums text-black/55">{invites.length} total</span>
        </div>
        <AdminInvitesTable invites={invites} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Users</h2>
          <span className="text-sm tabular-nums text-black/55">{users.length} total</span>
        </div>
        <AdminUsersTable users={users} />
      </section>
    </div>
  );
}
