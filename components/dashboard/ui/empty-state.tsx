import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Shared empty / loading / error message. `dashed` adds the signature dashed-bar
 * row (used for activity-style empties). Never fabricates content.
 */
export function EmptyState({
  message,
  dashed = false,
  bars = 32,
  className,
}: {
  message: string;
  dashed?: boolean;
  bars?: number;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {dashed ? (
        <div className="flex items-center gap-1.5" aria-hidden>
          {Array.from({ length: bars }).map((_, i) => (
            <span key={i} className="h-1.5 flex-1 rounded-full bg-white/[0.08]" />
          ))}
        </div>
      ) : null}
      <p className="text-sm text-white/55">{message}</p>
    </div>
  );
}
