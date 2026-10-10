/**
 * Control-coverage summary: a radial gauge with the compliant / gaps / total
 * breakdown beside it. Figures are derived upstream from real records only
 * (live engine ledger or the sample frameworks) — never hardcoded.
 */
export function CoverageCard({
  covered,
  total,
  sourceLabel,
  hasLive,
}: {
  covered: number;
  total: number;
  sourceLabel: string;
  hasLive: boolean;
}) {
  const coverage = total > 0 ? Math.round((covered / total) * 100) : 0;
  const gaps = Math.max(total - covered, 0);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dashoffset = circumference * (1 - coverage / 100);

  return (
    <section className="flex flex-col gap-8 rounded-2xl bg-white/[0.04] p-6 sm:flex-row sm:items-center sm:gap-10">
      {/* Radial gauge */}
      <div className="relative mx-auto grid size-[140px] shrink-0 place-items-center sm:mx-0">
        <svg width="140" height="140" viewBox="0 0 140 140" aria-hidden>
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="12"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--primary)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashoffset}
            transform="rotate(-90 70 70)"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-heading text-3xl font-semibold tabular-nums text-white">
            {coverage}%
          </span>
          <span className="text-xs text-white/40">coverage</span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="flex flex-1 flex-col gap-5">
        <div className="flex flex-wrap gap-x-10 gap-y-4">
          <Metric label={hasLive ? "Compliant" : "Covered"} value={covered} dot="bg-primary" />
          <Metric label="Gaps" value={gaps} dot="bg-white/30" />
          <Metric label="Controls" value={total} />
        </div>
        <p className="text-sm text-white/40">{sourceLabel}</p>
      </div>
    </section>
  );
}

function Metric({ label, value, dot }: { label: string; value: number; dot?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="flex items-center gap-2 text-sm text-white/55">
        {dot ? <span className={`size-1.5 rounded-full ${dot}`} aria-hidden /> : null}
        {label}
      </span>
      <span className="font-heading text-3xl font-semibold tabular-nums text-white">
        {value}
      </span>
    </div>
  );
}
