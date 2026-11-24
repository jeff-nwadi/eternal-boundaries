import type { Metadata } from "next";
import { desc, eq, ne } from "drizzle-orm";

import { requireMasterAdmin, tenantScopeOf } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { invite, user, tenant, type Invite, type User, type Tenant } from "@/lib/db/schema";
import { CreateInviteForm } from "@/components/admin/create-invite-form";
import { ProvisionTenantForm } from "@/components/admin/provision-tenant-form";
import { AdminUsersTable } from "@/components/admin/admin-users-table";
import { AdminInvitesTable } from "@/components/admin/admin-invites-table";
import { ClientTenantsTable } from "@/components/admin/client-tenants-table";

export const metadata: Metadata = { title: "Accounts" };

export const dynamic = "force-dynamic";

/**
 * Founders-only (master tenant) account management: provision client tenants,
 * see the tenant list, and manage the founders' own team. Scoped to the master
 * tenant for users/invites — no cross-tenant visibility (§6b).
 */
export default async function AccountsPage() {
  const session = await requireMasterAdmin();
  const scope = tenantScopeOf(session);

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
    tenants = await db
      .select()
      .from(tenant)
      .where(ne(tenant.isMaster, true))
      .orderBy(tenant.name)
      .limit(200);
  } catch {
    // No DB configured — render with empty tables.
  }

  return (
    <div className="flex flex-col gap-10">
      <header className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-black sm:text-4xl">Accounts</h1>
        <p className="text-sm text-black/55">
          Provision and manage client tenants, and your founders&apos; team.
        </p>
      </header>

      {/* Provision a client tenant */}
      <section className="flex flex-col gap-5 rounded-2xl bg-black/[0.04] p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-black">Provision client tenant</h2>
          <p className="text-sm text-black/55">
            Creates a new client organization and its first admin invite. You will not
            see that tenant&apos;s users or invites afterward.
          </p>
        </div>
        <ProvisionTenantForm />
      </section>

      {/* Client tenants — entities only, not their users (§6b). Suspend or
          reactivate a tenant here; suspension locks out all its users. */}
      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Client tenants</h2>
          <span className="text-sm tabular-nums text-black/55">{tenants.length} total</span>
        </div>
        <ClientTenantsTable
          tenants={tenants.map((t) => ({ id: t.id, name: t.name, status: t.status }))}
        />
      </section>

      {/* Founders' own team */}
      <section className="flex flex-col gap-5 rounded-2xl bg-black/[0.04] p-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-medium text-black">Invite to founders&apos; team</h2>
          <p className="text-sm text-black/55">
            Sends a one-time sign-up link for your own (master) organization. To make
            someone an auditor, promote them after they join.
          </p>
        </div>
        <CreateInviteForm />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Founders&apos; invites</h2>
          <span className="text-sm tabular-nums text-black/55">{invites.length} total</span>
        </div>
        <AdminInvitesTable invites={invites} />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium text-black">Founders&apos; team</h2>
          <span className="text-sm tabular-nums text-black/55">{users.length} total</span>
        </div>
        <AdminUsersTable users={users} />
      </section>
    </div>
  );
}
