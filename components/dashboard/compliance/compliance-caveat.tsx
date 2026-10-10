"use client";

import { Info } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Subtle, credible presentation of the §5.4 data caveat — an info icon with a
 * tooltip rather than a loud banner. Premium ≠ hiding the caveat.
 */
export function ComplianceCaveat() {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="About this data"
            className="inline-flex size-5 items-center justify-center rounded-full text-white/55 transition-colors duration-150 ease-out hover:text-white"
          >
            <Info className="size-4" strokeWidth={1.75} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="font-medium">Unverified sample data</p>
          <p className="mt-1 text-xs text-background/70">
            These numbers come from the sample records. They aren&apos;t yet
            connected to the actual weak spots, and only some checks are shown.
            Not audited.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
