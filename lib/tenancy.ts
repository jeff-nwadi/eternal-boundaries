/**
 * Multi-tenancy constants (CLAUDE.md §6b).
 *
 * Single source of truth for the founders' master tenant id. The master tenant
 * may *provision* new client tenants (see `provisionTenant`), but has no standing
 * visibility into a client tenant's day-to-day users/invites — its own admin
 * panel is scoped by tenant_id exactly like any other tenant.
 */
export const MASTER_TENANT_ID = process.env.MASTER_TENANT_ID ?? "system-admin-01";

export const MASTER_TENANT_NAME =
  process.env.MASTER_TENANT_NAME ?? "Eternal Boundaries (Founders)";

/** True only for the founders' master tenant. */
export function isMasterTenant(tenantId: string | null | undefined): boolean {
  return !!tenantId && tenantId === MASTER_TENANT_ID;
}
