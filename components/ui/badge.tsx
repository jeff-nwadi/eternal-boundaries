import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary/15 text-primary",
        secondary: "border-border bg-secondary text-secondary-foreground",
        outline: "border-border text-muted-foreground",
        // Severity tokens are fixed (CLAUDE.md §4) and mapped 1:1 here.
        critical: "border-critical/30 bg-critical/10 text-critical",
        high: "border-high/30 bg-high/10 text-high",
        medium: "border-medium/30 bg-medium/10 text-medium",
        low: "border-low/30 bg-low/10 text-low",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

/** Maps a severity string (any case) to the fixed severity badge variant. */
export function severityVariant(
  severity: string
): "critical" | "high" | "medium" | "low" | "outline" {
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
      return "outline";
  }
}

export { Badge, badgeVariants };
