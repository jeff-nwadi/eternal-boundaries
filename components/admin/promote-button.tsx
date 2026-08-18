"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { promoteToAuditor } from "@/app/actions/invites";
import { Button } from "@/components/ui/button";

/**
 * The only UI path to the auditor role — a deliberate, explicit admin action,
 * separate from the invite flow (CLAUDE.md §6a, Rule 1).
 */
export function PromoteButton({
  userId,
  disabled,
}: {
  userId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <Button
      variant="secondary"
      size="sm"
      disabled={disabled || loading}
      onClick={async () => {
        setLoading(true);
        await promoteToAuditor(userId);
        setLoading(false);
        router.refresh();
      }}
    >
      {loading ? "Promoting…" : "Make auditor"}
    </Button>
  );
}
