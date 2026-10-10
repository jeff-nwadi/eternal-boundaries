import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * The one card primitive: low-opacity white fill, one radius, no border, no
 * shadow. Optional L2 title + L3 description + a quiet action.
 */
export function Panel({
  title,
  description,
  action,
  className,
  children,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className={cn("flex flex-col gap-5 rounded-2xl bg-white/[0.04] p-6", className)}>
      {title || description || action ? (
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            {title ? <h2 className="text-sm font-medium text-white">{title}</h2> : null}
            {description ? (
              <p className="text-sm text-white/55">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
