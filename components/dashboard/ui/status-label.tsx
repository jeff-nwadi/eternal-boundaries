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
 * Severity / status shown with TEXT + ICON WEIGHT only — no color (CLAUDE.md §4
 * restyle rule). Higher severity reads heavier (fuller white, thicker stroke);
 * lower reads quieter. The value is rendered as-is so CLAIMED stays CLAIMED.
 */
const META: Record<string, { icon: LucideIcon; strong?: boolean; quiet?: boolean }> = {
  critical: { icon: AlertTriangle, strong: true },
  high: { icon: ShieldAlert, strong: true },
  medium: { icon: CircleDot },
  low: { icon: Minus, quiet: true },
  open: { icon: CircleDot, strong: true },
  "open finding": { icon: CircleDot, strong: true },
  patched: { icon: CheckCircle2, quiet: true },
  covered: { icon: CheckCircle2, quiet: true },
  compliant: { icon: CheckCircle2, quiet: true },
  "non_compliant": { icon: AlertTriangle, strong: true },
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
        meta.strong ? "font-medium text-white" : meta.quiet ? "text-white/55" : "text-white/75",
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
