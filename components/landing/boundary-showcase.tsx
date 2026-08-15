import type { ReactNode } from "react";
import { Globe, ShieldCheck } from "lucide-react";

/**
 * Schematic of the signature boundary motif: untrusted/external infrastructure
 * on the left, protected/internal assets on the right, split by the lime
 * boundary line. Illustrative only — no live or fabricated threat data.
 */
export function BoundaryShowcase() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-4 sm:gap-6">
        {/* External / untrusted */}
        <Zone
          tone="muted"
          icon={<Globe strokeWidth={1.5} className="size-4" />}
          label="External"
          caption="Untrusted infrastructure"
          rows={["Threat actor", "Malware", "Attack pattern"]}
        />

        {/* The boundary line */}
        <div className="flex flex-col items-center">
          <div className="boundary-vertical" aria-hidden="true" />
          <span className="mt-3 rotate-180 select-none text-[0.625rem] font-medium uppercase tracking-[0.2em] text-primary [writing-mode:vertical-rl]">
            Boundary
          </span>
        </div>

        {/* Internal / protected */}
        <Zone
          tone="protected"
          icon={<ShieldCheck strokeWidth={1.5} className="size-4 text-primary" />}
          label="Protected"
          caption="Internal assets"
          rows={["Targeted asset", "Control coverage", "Remediation state"]}
        />
      </div>
    </div>
  );
}

function Zone({
  tone,
  icon,
  label,
  caption,
  rows,
}: {
  tone: "muted" | "protected";
  icon: ReactNode;
  label: string;
  caption: string;
  rows: string[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex flex-col">
          <span className="text-sm font-medium text-foreground">{label}</span>
          <span className="text-xs text-muted-foreground">{caption}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <div
            key={row}
            className={
              "rounded-md border px-3 py-2 text-xs " +
              (tone === "protected"
                ? "border-primary/25 bg-primary/[0.06] text-foreground"
                : "border-border bg-popover text-muted-foreground")
            }
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}
