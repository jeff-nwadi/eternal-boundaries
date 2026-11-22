import { ArrowRight } from "lucide-react";

export function ClosingCta() {
  return (
    <section
      id="contact"
      className="mx-auto mb-[38px] mt-[52px] w-[min(1248px,calc(100%-64px))] max-[900px]:w-[min(100%-40px,700px)] max-[640px]:mt-8 max-[640px]:w-[calc(100%-40px)]"
    >
      <div
        className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center gap-[56px] rounded-[28px] border border-[rgba(91,43,210,0.08)] px-[56px] py-[52px] [background:linear-gradient(120deg,#f3eefb_0%,#f7f3f0_55%,#f3ecf6_100%)] max-[900px]:grid-cols-1 max-[900px]:gap-9 max-[640px]:rounded-[20px] max-[640px]:px-6 max-[640px]:py-8"
        data-motion-kind="cta"
      >
        {/* Left — copy + email capture */}
        <div>
          <h2 className="text-[clamp(28px,3vw,40px)] font-[620] leading-[1.08]">
            See what Eternal Boundaries
            <br />
            finds on your network.
          </h2>
          <p className="mt-4 max-w-[440px] text-[16px] leading-[1.6] text-[var(--paper-muted)] [text-wrap:pretty]">
            In every security review we run, SOC and compliance teams find
            something worth acting on. We think you will too.
          </p>
          <form className="mt-7 max-w-[460px]" action="#contact">
            <label
              htmlFor="cta-email"
              className="mb-2 block text-[12px] font-semibold text-[var(--paper-ink)]"
            >
              Work email <span className="text-[var(--paper-purple)]">*</span>
            </label>
            <div className="flex gap-3 max-[420px]:flex-col">
              <input
                id="cta-email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
                className="h-[52px] flex-1 rounded-[12px] border border-[var(--paper-line)] bg-white px-4 text-[15px] text-[var(--paper-ink)] outline-none transition-colors placeholder:text-[var(--paper-faint)] focus-visible:border-[var(--paper-purple)] focus-visible:ring-2 focus-visible:ring-[rgba(91,43,210,0.25)]"
              />
              <button
                type="submit"
                data-motion-cue
                className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[var(--paper-purple)] px-7 text-[14px] font-[650] !text-white transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-[#4820b3]"
              >
                Continue <ArrowRight size={16} />
              </button>
            </div>
            <small className="mt-3 block text-[12px] text-[var(--paper-faint)]">
              No pressure. Just a fit check.
            </small>
          </form>
        </div>

        {/* Right — on-brand product glimpse (drop a real image here later) */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_48px_rgba(74,48,120,0.12)] backdrop-blur-sm max-[900px]:order-first">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[var(--paper-faint)]">
              Boundary decision
            </span>
            <span className="rounded-full border border-[#e4dbf2] bg-[var(--paper-purple-soft)] px-2.5 py-1 text-[12px] font-medium text-[var(--paper-purple)]">
              Blocked
            </span>
          </div>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)] items-center gap-4">
            <div className="grid gap-2">
              <small className="text-center text-[11px] uppercase tracking-wide text-[#8b858e]">
                External
              </small>
              <span className="rounded-[8px] border border-[#e5e0e4] bg-white px-3 py-2.5 text-center text-[12px]">
                Write command
              </span>
            </div>
            <div className="h-[72px] w-[2px] justify-self-center bg-[var(--paper-purple)]" />
            <div className="grid gap-2">
              <small className="text-center text-[11px] uppercase tracking-wide text-[#8b858e]">
                Protected
              </small>
              <span className="rounded-[8px] border border-[#e4dbf2] bg-[var(--paper-purple-soft)] px-3 py-2.5 text-center text-[12px] text-[var(--paper-purple)]">
                Controller · safe
              </span>
            </div>
          </div>
          <p className="mt-5 border-t border-[var(--paper-line)] pt-4 text-center text-[12px] leading-[1.5] text-[#7c767e]">
            The same command is stopped at the boundary before it reaches your
            protected system.
          </p>
        </div>
      </div>
    </section>
  );
}
