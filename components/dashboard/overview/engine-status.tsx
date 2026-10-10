"use client";

import { cn } from "@/lib/utils";
import { useComplianceMappings } from "@/lib/queries/use-compliance-mappings";

/**
 * A single quiet line, not a card. Shows engine connectivity only — never the
 * URL or any token. Docs link is a placeholder (no docs page yet).
 */
export function EngineStatus() {
  const { isLoading, isError } = useComplianceMappings();

  const label = isLoading
    ? "Engine: checking"
    : isError
      ? "Engine: unreachable"
      : "Engine: connected";

  return (
    <div className="flex items-center gap-2 text-sm text-white/55">
      <span
        className={cn("size-1.5 rounded-full", isError ? "bg-white/40" : "bg-primary")}
        aria-hidden
      />
      <span>{label}</span>
      {/* Placeholder: no docs page exists yet. */}
      <a href="#" className="ml-2 text-white/70 transition-colors hover:text-white">
        Docs
      </a>
    </div>
  );
}
