import {
  AlertTriangle,
  ShieldAlert,
  CircleDot,
  Minus,
  CheckCircle2,
  Circle,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Severity / status shown with text + an icon. Severities (critical/high/medium/
 * low) carry their fixed palette color (CLAUDE.md §4); everything else stays
 * monochrome, reading heavier or quieter by weight. The icon inherits the text
 * color via currentColor. The value renders as-is so CLAIMED stays CLAIMED.
 */
const META: Record<
  string,
  { icon: LucideIcon; strong?: boolean; quiet?: boolean; tone?: string }
> = {
  critical: { icon: AlertTriangle, strong: true, tone: "text-critical" },
  high: { icon: ShieldAlert, strong: true, tone: "text-high" },
  medium: { icon: CircleDot, strong: true, tone: "text-medium" },
  low: { icon: Minus, tone: "text-low" },
  open: { icon: CircleDot, strong: true },
  "open finding": { icon: CircleDot, strong: true },
  patched: { icon: CheckCircle2, quiet: true },
  covered: { icon: CheckCircle2, quiet: true },
  compliant: { icon: CheckCircle2, quiet: true },
  "non_compliant": { icon: AlertTriangle, strong: true, tone: "text-critical" },
  claimed: { icon: Circle },
};

export function StatusLabel({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const meta = META[value.toLowerCase()] ?? { icon: Circle };
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap text-sm",
        meta.tone
          ? cn("font-medium", meta.tone)
          : meta.strong
            ? "font-medium text-white"
            : meta.quiet
              ? "text-white/55"
              : "text-white/75",
        className
      )}
    >
      <Icon
        className="size-3.5 shrink-0"
        strokeWidth={meta.strong ? 2.25 : 1.75}
        aria-hidden
      />
      <span>{value}</span>
    </span>
  );
}
