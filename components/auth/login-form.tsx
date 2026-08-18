"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { authInputClass } from "@/components/auth/auth-shell";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "Could not sign in. Check your details.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Sign in
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Sign in to your dashboard.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-3 text-left">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-medium text-muted-foreground">
            Work email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="name@work-email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="password" className="text-xs font-medium text-muted-foreground">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            required
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
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-xs text-muted-foreground/70">
        Access is invite-only. Ask an admin for an invite link if you don&apos;t
        have an account yet.
      </p>
    </div>
  );
}
