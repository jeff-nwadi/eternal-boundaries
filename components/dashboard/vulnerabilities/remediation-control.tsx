"use client";

import * as React from "react";
import { Loader2, ShieldCheck } from "lucide-react";

import { requestRemediation } from "@/app/actions/remediation";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/dashboard/status-pill";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { RemediationStatusValue } from "@/app/api/remediate/status/route";

const POLL_INTERVAL_MS = 900;
const POLL_TIMEOUT_MS = 15000; // client-side ceiling on "verifying"

export function RemediationControl({
  vulnerabilityId,
  targetAsset,
  initialStatus,
  initialDetail,
}: {
  vulnerabilityId: string;
  targetAsset: string;
  initialStatus: RemediationStatusValue;
  initialDetail?: string | null;
}) {
  const [status, setStatus] = React.useState<RemediationStatusValue>(initialStatus);
  const [detail, setDetail] = React.useState<string | null>(initialDetail ?? null);
  const stopRef = React.useRef<() => void>(() => {});

  // Clean up any in-flight poll on unmount.
  React.useEffect(() => () => stopRef.current(), []);

  function pollUntilResolved() {
    const started = Date.now();
    const id = setInterval(async () => {
      if (Date.now() - started > POLL_TIMEOUT_MS) {
        stopRef.current();
        setStatus("verification_error");
        setDetail("Verification timed out.");
        return;
      }
      try {
        const res = await fetch("/api/remediate/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          statuses: Record<string, { status: RemediationStatusValue; detail: string | null }>;
        };
        const next = data.statuses[vulnerabilityId];
        if (next && next.status !== "verifying") {
          stopRef.current();
          setStatus(next.status);
          setDetail(next.detail);
        }
      } catch {
        /* transient — keep polling until the timeout ceiling */
      }
    }, POLL_INTERVAL_MS);
    stopRef.current = () => clearInterval(id);
  }

  async function onMark() {
    setStatus("verifying");
    setDetail(null);
    const outcome = await requestRemediation({ vulnerabilityId, targetAsset });
    if (outcome.status === "verification_error") {
      setStatus("verification_error");
      setDetail(outcome.detail);
      return;
    }
    // Accepted — the engine will call back the signed result; poll for it.
    pollUntilResolved();
  }

  if (status === "verifying") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="size-3.5 animate-spin text-primary" aria-hidden />
            Verifying Matrix Isolation…
          </span>
        </TooltipTrigger>
        <TooltipContent>
          Re-testing that the fix actually blocks the attack (about 1–2 seconds).
        </TooltipContent>
      </Tooltip>
    );
  }

  if (status === "covered") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex cursor-help">
            <StatusPill tone="positive" label="Covered" className="gap-1" />
          </span>
        </TooltipTrigger>
        <TooltipContent>Confirmed fixed — we re-checked and the attack is blocked.</TooltipContent>
      </Tooltip>
    );
  }

  if (status === "verification_error") {
    return (
      <div className="flex flex-col items-start gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex cursor-help">
              <StatusPill tone="critical" label="Verification Error: Engine Unreachable" />
            </span>
          </TooltipTrigger>
          <TooltipContent>
            We couldn&apos;t reach your security engine to confirm the fix, so it
            stays open. Try again.
          </TooltipContent>
        </Tooltip>
        {detail && <span className="text-[0.6875rem] text-muted-foreground">{detail}</span>}
        <button
          type="button"
          onClick={onMark}
          className="text-[0.6875rem] font-medium text-primary transition-opacity hover:opacity-80"
        >
          Retry
        </button>
      </div>
    );
  }

  // status === "open"
  return (
    <Button variant="outline" size="sm" onClick={onMark}>
      <ShieldCheck strokeWidth={1.75} />
      Mark as remediated
    </Button>
  );
}
