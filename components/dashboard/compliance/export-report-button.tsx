"use client";

import * as React from "react";
import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Report export is a stub in this phase (CLAUDE.md §8 — no real generation
 * logic yet, and §6/§5.4 caution against presenting compliance numbers as
 * authoritative). The button is present for layout but does not produce a
 * report; it surfaces a neutral note instead of implying a finished feature.
 */
export function ExportReportButton() {
  const [noted, setNoted] = React.useState(false);

  return (
    <div className="flex flex-col items-end gap-1">
      <Button variant="default" size="sm" onClick={() => setNoted(true)}>
        <FileDown strokeWidth={1.75} />
        Export report
      </Button>
      {noted && (
        <span className="text-xs text-muted-foreground">
          Report export isn&apos;t wired up yet.
        </span>
      )}
    </div>
  );
}
