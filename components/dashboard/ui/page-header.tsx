import * as React from "react";

/**
 * Page heading (L1) + optional plain-language subtitle (L3) + optional single
 * primary action (the only lime button on the screen). Shared across every page.
 */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold text-white sm:text-4xl">{title}</h1>
        {subtitle ? <p className="text-sm text-white/55">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}
