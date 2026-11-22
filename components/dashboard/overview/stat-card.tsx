import * as React from "react";

import { cn } from "@/lib/utils";
import { AnimatedNumber } from "@/components/dashboard/ui/animated-number";

/**
 * One stat: label (L3) / value (L1) / optional caption (L3).
 * `valueClassName` can tint the number (e.g. a severity color); defaults white.
 */
export function StatCard({
  label,
  value,
  caption,
  valueClassName,
  indicator,
}: {
  label: string;
  value: React.ReactNode;
  caption?: string;
  valueClassName?: string;
  /** Optional small badge/legend shown top-right (trend, severity, etc.). */
  indicator?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-black/[0.04] p-6">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm text-black/55">{label}</span>
        {indicator ? <div className="shrink-0">{indicator}</div> : null}
      </div>
      <span
        className={cn(
          "mt-4 text-5xl font-semibold tabular-nums leading-none text-black",
          valueClassName
        )}
      >
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </span>
      {caption ? (
        <span className="mt-3 text-sm text-black/55">{caption}</span>
      ) : null}
    </div>
  );
}
