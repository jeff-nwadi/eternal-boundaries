import type { Metadata } from "next";
import Link from "next/link";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { invite } from "@/lib/db/schema";
import { hashInviteToken } from "@/lib/invite-token";
import { AuthShell } from "@/components/auth/auth-shell";
import { RedeemForm } from "@/components/auth/redeem-form";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Accept your invite",
  description: "Set up your Eternal Boundaries account from an invite.",
};

// Reads the invite by token on every request; never prerendered.
export const dynamic = "force-dynamic";

type InviteState =
  | { valid: true; email: string }
  | { valid: false; reason: "used" | "invalid" };

async function loadInviteState(token: string): Promise<InviteState> {
  try {
    const [row] = await db
      .select({ email: invite.email, redeemedAt: invite.redeemedAt, expiresAt: invite.expiresAt })
      .from(invite)
      .where(eq(invite.tokenHash, hashInviteToken(token)))
      .limit(1);

    if (!row) return { valid: false, reason: "invalid" };
    if (row.redeemedAt) return { valid: false, reason: "used" };
    if (row.expiresAt.getTime() <= Date.now()) return { valid: false, reason: "invalid" };
    return { valid: true, email: row.email };
  } catch {
    return { valid: false, reason: "invalid" };
  }
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const state = await loadInviteState(token);

  return (
    <AuthShell>
      {state.valid ? (
        <RedeemForm token={token} email={state.email} />
      ) : (
        <div className="space-y-5 text-center">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              This invite isn&apos;t valid
            </h1>
            <p className="text-sm text-muted-foreground">
              {state.reason === "used"
                ? "This invite has already been used."
                : "The link may be expired or incorrect. Ask an admin for a new invite."}
            </p>
          </div>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">Go to sign in</Link>
          </Button>
        </div>
      )}
    </AuthShell>
  );
}
