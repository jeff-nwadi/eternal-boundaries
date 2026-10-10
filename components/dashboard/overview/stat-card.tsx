import * as React from "react";

/**
 * One stat: label (L3) / value (L1) / optional caption (L3).
 * No icons, no color inside — the value carries the focus.
 */
export function StatCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: React.ReactNode;
  caption?: string;
}) {
  return (
    <div className="flex flex-col rounded-2xl bg-white/[0.04] p-6">
      <span className="text-sm text-white/55">{label}</span>
      <span className="mt-4 text-5xl font-semibold tabular-nums leading-none text-white">
        {value}
      </span>
      {caption ? (
        <span className="mt-3 text-sm text-white/55">{caption}</span>
      ) : null}
    </div>
  );
}
