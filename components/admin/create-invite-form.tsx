"use client";

import { useState } from "react";

import { createInvite } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary/30";

export function CreateInviteForm() {
  const [email, setEmail] = useState("");
  // Note: no `auditor` option — invites can only grant analyst or admin.
  const [role, setRole] = useState<"analyst" | "admin">("analyst");
  const [result, setResult] = useState<
    { inviteUrl: string } | { error: string } | null
  >(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    const res = await createInvite({ email, role });
    setLoading(false);
    setResult(res);
    if ("inviteUrl" in res) setEmail("");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div className="space-y-1.5">
          <label htmlFor="invite-email" className="text-xs font-medium text-muted-foreground">
            Invitee email
          </label>
          <input
            id="invite-email"
            type="email"
            required
            placeholder="analyst@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="invite-role" className="text-xs font-medium text-muted-foreground">
            Role
          </label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => setRole(e.target.value as "analyst" | "admin")}
            className={inputClass}
          >
            <option value="analyst">Analyst</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create invite"}
        </Button>
      </div>

      {result && "inviteUrl" in result && (
        <div className="rounded-lg border border-primary/25 bg-primary/[0.06] p-3">
          <p className="mb-1 text-xs font-medium text-primary">
            Invite created — copy this link now (shown once):
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
