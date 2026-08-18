"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { redeemInvite } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";
import { authInputClass } from "@/components/auth/auth-shell";

export function RedeemForm({ token, email }: { token: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await redeemInvite({ token, name, password });
    setLoading(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Set up your account
        </h1>
        <p className="text-sm text-muted-foreground">
          You&apos;ve been invited to Eternal Boundaries.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Email
          </label>
          {/* Bound to the invite — the redeemer cannot change it. */}
          <input id="email" type="email" value={email} readOnly disabled className={authInputClass} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-medium text-muted-foreground">
            Full name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Ada Lovelace"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={authInputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Choose a password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="mt-1 w-full" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
