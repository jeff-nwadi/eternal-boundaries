import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type Feature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export function FeatureCard({
  feature,
  className,
}: {
  feature: Feature;
  className?: string;
}) {
  const { icon: Icon, title, body } = feature;
  return (
    <div
      className={cn(
        "group flex h-full flex-col gap-4 rounded-xl border border-border bg-card p-6",
        "transition-[border-color,transform,box-shadow] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-border-strong",
        className
      )}
    >
      <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-popover text-primary transition-colors duration-200 ease-out group-hover:border-primary/30">
        <Icon strokeWidth={1.75} className="size-5" />
      </span>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
      </div>
    </div>
  );
}
