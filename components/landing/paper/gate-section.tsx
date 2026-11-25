"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type Outcome = { verdict: string; path: [string, string, string] };
type Scenario = {
  tab: string;
  name: string;
  desc: string;
  off: Outcome;
  on: Outcome;
};

const SCENARIOS: Scenario[] = [
  {
    tab: "Modbus write",
    name: "Suspicious Modbus write",
    desc: "A control command approaches a protected system.",
    off: { verdict: "Request passes", path: ["External source", "Write command", "Controller"] },
    on: { verdict: "Policy blocks", path: ["External source", "Write command", "Stopped at gate"] },
  },
  {
    tab: "Exploit path",
    name: "Exploit chain at the edge",
    desc: "An exploit chains toward an exposed service.",
    off: { verdict: "Reaches target", path: ["Untrusted input", "Exploit chain", "Vulnerable service"] },
    on: { verdict: "Chain broken", path: ["Untrusted input", "Exploit chain", "Isolated at boundary"] },
  },
  {
    tab: "Policy match",
    name: "Known-bad signature",
    desc: "Traffic matches a known-bad signature at the edge.",
    off: { verdict: "Delivered", path: ["Inbound traffic", "Matched rule", "Internal host"] },
    on: { verdict: "Dropped by policy", path: ["Inbound traffic", "Matched rule", "Logged + blocked"] },
  },
];

const DURATION = 6000;

function PathLine({ steps }: { steps: [string, string, string] }) {
  return (
    <span className="text-[12px] leading-[1.5] text-[#77717a] sm:leading-normal">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          {i > 0 && <b className="font-normal text-[#aaa3ac]"> → </b>}
          {step}
        </React.Fragment>
      ))}
    </span>
  );
}

export function GateSection() {
  const [active, setActive] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const reduced = useReducedMotion();
  const count = SCENARIOS.length;
  const s = SCENARIOS[active];

  // Auto-advance; pauses on hover/focus and for reduced-motion users.
  React.useEffect(() => {
    if (paused || reduced) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % count), DURATION);
    return () => window.clearTimeout(t);
  }, [active, paused, reduced, count]);

  return (
    <section
      id="how-it-works"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      className="relative grid grid-cols-1 items-center gap-[27px] overflow-hidden px-5 py-[35px] [background:linear-gradient(105deg,#fff0d3_0%,#f9e8e5_48%,#f5e3ed_100%)] sm:px-8 sm:py-[54px] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.94fr)] lg:gap-[52px] lg:px-[max(32px,calc((100%-1248px)/2))]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50 [background:repeating-radial-gradient(ellipse_at_12%_42%,transparent_0_29px,rgba(107,69,91,0.2)_30px_31px,transparent_32px_53px)] [background-size:140%_140%] [-webkit-mask-image:linear-gradient(90deg,#000,transparent_42%,transparent_60%,#000)] [mask-image:linear-gradient(90deg,#000,transparent_42%,transparent_60%,#000)] [animation:contour-drift_24s_ease-in-out_infinite_alternate] motion-reduce:[animation:none]"
        aria-hidden="true"
      />

      {/* Scenario card (carousel body) */}
      <div
        className="relative z-[1] min-h-[224px] rounded-[10px] border border-[rgba(117,86,118,0.12)] bg-white/90 p-[15px] shadow-[0_8px_28px_rgba(83,60,73,0.06)] sm:min-h-[248px] sm:p-[22px]"
        data-motion-kind="gate"
        aria-live="polite"
      >
        <div className="mb-3 flex w-fit items-center gap-[10px] rounded-full border border-[#ece5e8] px-2 py-[5px] text-[12px] text-[#68616a]">
          <span>
            Scenario {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
          </span>
          <span className="relative h-[5px] w-[28px] overflow-hidden rounded-[99px] bg-[#e3dfe1]">
            <motion.span
              key={`${active}-${paused}`}
              className="absolute inset-y-0 left-0 rounded-[inherit] bg-[var(--paper-purple)]"
              initial={{ width: reduced ? "100%" : "8%" }}
              animate={{ width: "100%" }}
              transition={{ duration: paused || reduced ? 0 : DURATION / 1000, ease: "linear" }}
            />
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <h3 className="mt-2 text-[19px]">{s.name}</h3>
            <p className="mt-[5px] text-[12px] text-[var(--paper-muted)]">{s.desc}</p>
            <div className="mt-[18px] grid grid-cols-2 gap-[7px] sm:gap-3">
              <div className="grid gap-2 rounded-[6px] border border-[#e7e2e2] bg-white p-[9px] sm:p-[14px]">
                <small className="text-[12px] uppercase text-[#8a858b]">Gate off</small>
                <strong className="text-[12px]">{s.off.verdict}</strong>
                <PathLine steps={s.off.path} />
              </div>
              <div className="grid gap-2 rounded-[6px] border border-[#e6d6f3] bg-[#f8f4fc] p-[9px] sm:p-[14px]">
                <small className="text-[12px] uppercase text-[#8a858b]">Gate on</small>
                <strong className="text-[12px] text-[var(--paper-purple)]">{s.on.verdict}</strong>
                <PathLine steps={s.on.path} />
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Copy + scenario switcher */}
      <div className="relative z-[1] max-w-[700px] lg:max-w-[515px]">
        <h2 className="mb-4 text-[32px] font-[620] sm:text-[clamp(30px,3.25vw,42px)]">
          Three scenarios.
          <br />
          Two clear outcomes.
        </h2>
        <p className="max-w-[470px] text-[16px] leading-[1.6] text-[var(--paper-muted)] [text-wrap:pretty]">
          See how a boundary decision changes the path. The same request reaches
          the system with the gate off, and is stopped when policy is enforced.
        </p>
        <div className="mt-[18px] flex flex-wrap gap-2" role="tablist" aria-label="Gate scenarios">
          {SCENARIOS.map((sc, i) => {
            const isActive = i === active;
            return (
              <button
                key={sc.tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(i)}
                className={
                  isActive
                    ? "rounded-full border border-[var(--paper-purple)] bg-[var(--paper-purple)] px-[10px] py-[6px] text-[12px] !text-white"
                    : "rounded-full border border-[rgba(80,68,85,0.14)] px-[10px] py-[6px] text-[12px] text-[#6e6771] transition-colors duration-150 hover:border-[var(--paper-purple)] hover:text-[var(--paper-purple)]"
                }
              >
                {String(i + 1).padStart(2, "0")} {sc.tab}
              </button>
            );
          })}
        </div>
        <a
          className="mt-[17px] inline-flex w-fit items-center text-[12px] text-[var(--paper-purple)] transition-opacity hover:opacity-80"
          href="#security"
        >
          Explore the boundary model ↗
        </a>
      </div>
    </section>
  );
}
