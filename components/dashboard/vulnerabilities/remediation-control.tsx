"use client";

import * as React from "react";
import { Loader2, ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";

import { requestRemediation } from "@/app/actions/remediation";
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
    pollUntilResolved();
  }

  if (status === "verifying") {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-white/55">
        <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
        Verifying isolation…
      </span>
    );
  }

  if (status === "covered") {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-low">
        <CheckCircle2 className="size-4" strokeWidth={2} aria-hidden />
        Covered
      </span>
    );
  }

  if (status === "verification_error") {
    return (
      <div className="flex flex-col items-start gap-1.5">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-critical">
          <AlertTriangle className="size-4" strokeWidth={2} aria-hidden />
          Engine unreachable
        </span>
        <span className="text-xs text-white/40">
          Stays open until a fix is confirmed. {detail ?? ""}
        </span>
        <button
          type="button"
          onClick={onMark}
          className="text-xs font-medium text-primary transition-opacity hover:opacity-80"
        >
          Retry
        </button>
      </div>
    );
  }

  // status === "open"
  return (
    <div className="flex flex-col items-start gap-1.5">
      <button
        type="button"
        onClick={onMark}
        className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-3 py-2 text-sm font-medium text-white/85 transition-colors hover:bg-white/[0.1] hover:text-white"
      >
        <ShieldCheck className="size-4" strokeWidth={1.75} aria-hidden />
        Mark as remediated
      </button>
      <span className="text-xs text-white/40">Simulated, no live action taken</span>
    </div>
  );
}
