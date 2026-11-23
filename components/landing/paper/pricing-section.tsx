import { ArrowUpRight } from "lucide-react";

const options = [
  [
    "Security team",
    "Threat context, vulnerability review, and control mapping for a focused security program.",
  ],
  [
    "Network boundary",
    "Console plus boundary planning for IT and industrial OT traffic.",
  ],
  [
    "Municipal utility",
    "Talk through operational needs and grant-aligned security goals for water and utility environments.",
  ],
];

export function PricingSection() {
  return (
    <section
      id="pricing"
      className="mx-auto w-[calc(100%-40px)] pb-[55px] pt-[39px] sm:w-[min(100%-40px,700px)] sm:pb-[76px] sm:pt-[52px] lg:w-[min(1248px,calc(100%-64px))]"
    >
      <div className="mb-[26px] flex flex-col items-start justify-between gap-[9px] sm:flex-row sm:items-end sm:gap-[30px]">
        <div>
          <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
            Pricing
          </span>
          <h2 className="text-[30px] font-[620] sm:text-[34px]">
            A plan shaped around your boundary.
          </h2>
        </div>
        <p className="text-[12px] text-[#8b858d]">Early product · pricing scoped to your environment</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {options.map(([name, text]) => (
          <article
            data-motion-kind="pricing"
            key={name}
            className="rounded-[8px] border border-[#e3dfdc] bg-[#f3f1ed] p-[18px] [&:nth-child(2)]:border-[#ded5e9] [&:nth-child(2)]:bg-[#f3eff8] sm:min-h-[158px]"
          >
            <h3 className="text-[13px] font-[650] tracking-[-0.01em] [font-family:var(--font-inter)]">{name}</h3>
            <p className="mt-2 text-[16px] leading-[1.5] text-[var(--paper-muted)] sm:min-h-[52px]">
              {text}
            </p>
            <a
              href="#contact"
              className="mt-3 inline-flex items-center gap-[6px] text-[12px] text-[var(--paper-purple)] [&_svg]:transition-transform hover:[&_svg]:-translate-y-[2px] hover:[&_svg]:translate-x-[2px]"
            >
              {name === "Security team"
                ? "Scope and quote"
                : name === "Network boundary"
                  ? "Discuss your deployment"
                  : "Plan a conversation"}{" "}
              <ArrowUpRight size={14} data-motion-cue />
            </a>
          </article>
        ))}
      </div>
      <small className="mt-[17px] block text-center text-[12px] text-[#8d878e]">
        No public list price yet. We’ll discuss scope and fit before proposing a
        plan.
      </small>
    </section>
  );
}
