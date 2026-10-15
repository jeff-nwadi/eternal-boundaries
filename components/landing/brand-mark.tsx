import { cn } from "@/lib/utils";

/**
 * Eternal Boundaries logo: a contained badge holding the signature motif —
 * an external node, the lime boundary seam, and a protected node (CLAUDE.md
 * §3.1). Micro-interaction (CSS-only, so this stays a zero-JS server
 * component): on hover a lime light sweeps across the badge and the seam
 * pulses. Transform/opacity only (composited); idle = no animation.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "group flex items-center gap-2.5 font-heading text-[0.9375rem] font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="relative grid size-6 place-items-center overflow-hidden rounded-[7px] bg-white/[0.06] ring-1 ring-white/10 transition-colors duration-200 group-hover:ring-primary/40">
        {/* external node · boundary seam · protected node */}
        <span className="flex items-center gap-[3px]">
          <span className="size-[3px] rounded-full bg-muted-foreground transition-opacity duration-300 group-hover:opacity-60" />
          <span className="h-3 w-[2px] rounded-full bg-primary transition-transform duration-300 ease-out group-hover:scale-y-125" />
          <span className="size-[3px] rounded-full bg-foreground" />
        </span>

        {/* lime shine that sweeps across on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-[-70%] w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[340%]"
        />
      </span>
      Eternal Boundaries
    </span>
  );
}
