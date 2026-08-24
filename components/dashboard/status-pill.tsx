import { cn } from "@/lib/utils";

/**
 * Standalone status/severity pill — deliberately NOT the shadcn Badge, so a
 * future `shadcn add` can't revert the fixed severity tokens (CLAUDE.md §4).
 */
export type Tone = "critical" | "high" | "medium" | "low" | "neutral" | "positive";

const toneClass: Record<Tone, string> = {
  critical: "border-critical/30 bg-critical/10 text-critical",
  high: "border-high/30 bg-high/10 text-high",
  medium: "border-medium/30 bg-medium/10 text-medium",
  low: "border-low/30 bg-low/10 text-low",
  positive: "border-foreground/20 bg-muted text-foreground font-medium",
  neutral: "border-border bg-secondary text-muted-foreground",
};

export function StatusPill({
  label,
  tone,
  className,
}: {
  label: string;
  tone: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        toneClass[tone],
        className
      )}
    >
      {label}
    </span>
  );
}

/** Severity string (any case) → fixed tone. Unknown severities read neutral. */
export function severityTone(severity: string): Tone {
  switch (severity.toLowerCase()) {
    case "critical":
      return "critical";
    case "high":
      return "high";
    case "medium":
      return "medium";
    case "low":
      return "low";
    default:
      return "neutral";
  }
}

/** Ledger control status → tone (compliant reads positive, action reads high). */
export function complianceTone(status: string): Tone {
  const s = status.toLowerCase();
  if (s === "compliant") return "positive";
  if (s.includes("action")) return "high";
  if (s.includes("review")) return "medium";
  return "neutral";
}

/** Patch status → tone (patched reads low/teal, otherwise neutral). */
export function patchTone(status: string): Tone {
  return status.toLowerCase() === "patched" ? "low" : "neutral";
}
