"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { provisionTenant } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30";

/**
 * Master-tenant-only (§6b point 6). Provisions a new client tenant and returns
 * the one-time invite link for that tenant's first admin. The founders get no
 * standing visibility into that tenant afterward — only this provisioning step.
 */
export function ProvisionTenantForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [result, setResult] = useState<
    { inviteUrl: string; tenantId: string } | { error: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await provisionTenant({ name, adminEmail });
    setLoading(false);
    setResult(res);
    if ("inviteUrl" in res) {
      toast.success(`Tenant "${name}" provisioned.`);
      setName("");
      setAdminEmail("");
      router.refresh();
    } else {
      toast.error(res.error);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="tenant-name" className="text-xs font-medium text-muted-foreground">
            Organization name
          </label>
          <input
            id="tenant-name"
            type="text"
            required
            placeholder="Acme Water Utility"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="tenant-admin-email" className="text-xs font-medium text-muted-foreground">
            First admin email
          </label>
          <input
            id="tenant-admin-email"
            type="email"
            required
            placeholder="soc.lead@acme.com"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Provisioning…" : "Provision tenant"}
        </Button>
      </div>

      {result && "inviteUrl" in result && (
        <div className="rounded-lg border border-primary/25 bg-primary/[0.06] p-3">
          <p className="mb-1 text-xs font-medium text-primary">
            Tenant created ({result.tenantId}) — copy this admin invite link now
            (shown once):
          </p>
          <code className="block break-all font-mono text-xs text-foreground">
            {result.inviteUrl}
          </code>
        </div>
      )}
      {result && "error" in result && (
        <p className="text-sm text-destructive" role="alert">
          {result.error}
        </p>
      )}
    </form>
  );
}
