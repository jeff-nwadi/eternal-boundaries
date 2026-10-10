"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { PageHeader } from "@/components/dashboard/ui/page-header";
import { Panel } from "@/components/dashboard/ui/panel";
import { Input } from "@/components/ui/input";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm text-white/55">{label}</span>
      {children}
    </div>
  );
}

function ReadOnly({ value }: { value: string }) {
  return (
    <div className="rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-white/70">
      {value}
    </div>
  );
}

export function SettingsView({
  name,
  email,
  role,
  orgName,
}: {
  name: string;
  email: string;
  role: string;
  orgName: string;
}) {
  const router = useRouter();
  const [draftName, setDraftName] = React.useState(name);
  const [saving, setSaving] = React.useState(false);
  const [signingOut, setSigningOut] = React.useState(false);

  const trimmed = draftName.trim();
  const dirty = trimmed.length > 0 && trimmed !== name;

  async function save() {
    if (!dirty) return;
    setSaving(true);
    try {
      const { error } = await authClient.updateUser({ name: trimmed });
      if (error) throw new Error(error.message ?? "Could not save changes.");
      toast.success("Profile updated.");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    setSigningOut(true);
    await authClient.signOut();
    router.push("/login");
  }

  return (
    <div className="flex flex-col gap-10">
      <PageHeader title="Settings" subtitle="Your profile, organization and account." />

      {/* Profile — the only editable section, with the one save action */}
      <Panel title="Profile">
        <div className="flex flex-col gap-5">
          <Field label="Name">
            <Input
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder="Your name"
              className="h-10"
              aria-label="Name"
            />
          </Field>
          <Field label="Email">
            <ReadOnly value={email || "—"} />
          </Field>
          <div>
            <button
              type="button"
              onClick={save}
              disabled={!dirty || saving}
              className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-background transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </Panel>

      {/* Organization — read-only (tenant scoping is server-enforced, §6b) */}
      <Panel title="Organization">
        <div className="flex flex-col gap-5">
          <Field label="Organization">
            <ReadOnly value={orgName} />
          </Field>
          <Field label="Your role">
            <ReadOnly value={role.charAt(0).toUpperCase() + role.slice(1)} />
          </Field>
        </div>
      </Panel>

      {/* Account */}
      <Panel title="Account">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="text-sm text-white/55">
            Signed in as <span className="text-white/80">{email || "—"}</span>
          </span>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/[0.1] hover:text-white disabled:opacity-60"
          >
            <LogOut className="size-4" strokeWidth={1.75} />
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </Panel>
    </div>
  );
}
