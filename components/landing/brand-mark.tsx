import { cn } from "@/lib/utils";

/**
 * The Eternal Boundaries mark: two stacked node clusters split by a lime
 * boundary line — a miniature of the product's signature external/internal
 * divider motif (CLAUDE.md §3.1).
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="size-[22px]"
        fill="none"
      >
        {/* external / untrusted nodes */}
        <circle cx="5" cy="6" r="2" className="fill-muted-foreground" />
        <circle cx="5" cy="18" r="2" className="fill-muted-foreground" />
        {/* the boundary line */}
        <rect x="11" y="2" width="2" height="20" rx="1" className="fill-primary" />
        {/* internal / protected nodes */}
        <circle cx="19" cy="6" r="2" className="fill-foreground" />
        <circle cx="19" cy="18" r="2" className="fill-foreground" />
      </svg>
      Eternal Boundaries
    </span>
  );
}
