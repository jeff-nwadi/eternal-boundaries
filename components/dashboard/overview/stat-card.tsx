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
}: {
  label: string;
  value: React.ReactNode;
  caption?: string;
  valueClassName?: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white/[0.04] p-6">
      <span className="text-sm text-white/55">{label}</span>
      <span
        className={cn(
          "mt-4 text-5xl font-semibold tabular-nums leading-none text-white",
          valueClassName
        )}
      >
        {typeof value === "number" ? <AnimatedNumber value={value} /> : value}
      </span>
      {caption ? (
        <span className="mt-3 text-sm text-white/55">{caption}</span>
      ) : null}
    </div>
  );
}
