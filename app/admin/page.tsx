import type { Metadata } from "next";
import { desc } from "drizzle-orm";

import { requireAdmin } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { invite, user, type Invite, type User } from "@/lib/db/schema";
import { CreateInviteForm } from "@/components/admin/create-invite-form";
import { PromoteButton } from "@/components/admin/promote-button";

export const metadata: Metadata = { title: "Admin" };

export const dynamic = "force-dynamic";

function fmt(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function inviteStatus(row: Invite): { label: string; className: string } {
  if (row.redeemedAt)
    return { label: "Redeemed", className: "text-primary" };
  if (row.expiresAt.getTime() < Date.now())
    return { label: "Expired", className: "text-muted-foreground" };
  return { label: "Pending", className: "text-high" };
}

export default async function AdminPage() {
  await requireAdmin();

  let invites: Invite[] = [];
  let users: User[] = [];
  try {
    invites = await db.select().from(invite).orderBy(desc(invite.createdAt)).limit(50);
    users = await db.select().from(user).orderBy(desc(user.createdAt)).limit(50);
  } catch {
    // No database configured yet — render the console with empty tables.
  }

  return (
    <div className="space-y-10">
      <p className="max-w-2xl text-sm text-muted-foreground">
        Issue invites and manage roles. Accounts can only be created from an
        invite; auditor is granted here, never through an invite.
      </p>

        {/* Create invite */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
            Create invite
          </h2>
          <div className="rounded-xl border border-border bg-card p-6">
            <CreateInviteForm />
          </div>
        </section>

        {/* Invites */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
            Invites
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-border bg-card/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Issued by (admin id)</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Expires</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {invites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                      No invites yet.
                    </td>
                  </tr>
                ) : (
                  invites.map((row) => {
                    const status = inviteStatus(row);
                    return (
                      <tr key={row.id}>
                        <td className="px-4 py-3 text-foreground">{row.email}</td>
                        <td className="px-4 py-3 text-muted-foreground">{row.role}</td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                          {row.invitedByAdminId}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">
                          {fmt(row.createdAt)}
                        </td>
                        <td className="px-4 py-3 tabular-nums text-muted-foreground">
                          {fmt(row.expiresAt)}
                        </td>
                        <td className={`px-4 py-3 font-medium ${status.className}`}>
                          {status.label}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Users */}
        <section className="space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-[0.15em] text-muted-foreground/70">
            Users
          </h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-border bg-card/50 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                      No users yet.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id}>
                      <td className="px-4 py-3 text-foreground">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-primary">{u.role}</span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <PromoteButton userId={u.id} disabled={u.role !== "analyst"} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
    </div>
  );
}
