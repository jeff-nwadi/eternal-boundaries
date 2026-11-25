"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";

import { SectionHeading } from "./section-heading";

// ---------------------------------------------------------------------------
// Content — six questions a security team actually asks, each with its own
// illustration. Sample/illustrative only (no customer or performance claims).
// ---------------------------------------------------------------------------

type Item = {
  question: string;
  description: string;
  link?: string;
  /** Distinct soft gradient behind the illustration card. */
  grad: string;
  Illustration: React.FC;
};

// Shared contour pattern layered over each gradient (subtle light rings).
const PATTERN =
  "repeating-radial-gradient(ellipse at 8% 0%, transparent 0 25px, rgba(255,255,255,0.4) 26px 27px, transparent 28px 50px)";

function GradientFrame({ grad, children }: { grad: string; children: React.ReactNode }) {
  return (
    <div
      className="overflow-hidden rounded-[24px] border border-white/60 p-[10px] sm:p-[14px]"
      style={{
        backgroundImage: `${PATTERN}, ${grad}`,
        backgroundSize: "150% 150%, 100% 100%",
      }}
    >
      {children}
    </div>
  );
}

const ITEMS: Item[] = [
  {
    question: "What is this threat connected to?",
    description:
      "Trace a signal through an exposed weakness to the system it may affect — the whole chain in one view.",
    link: "Follow the attack chain",
    grad: "linear-gradient(120deg, #e4d6fb 0%, #efe4ff 52%, #d9e5fb 100%)",
    Illustration: ThreatChainIllustration,
  },
  {
    question: "Which vulnerabilities matter most?",
    description:
      "Review exposed weaknesses ranked by severity and affected system, not a flat list.",
    grad: "linear-gradient(120deg, #fbdce2 0%, #fde8df 55%, #f8dcc8 100%)",
    Illustration: SeverityIllustration,
  },
  {
    question: "What crossed the boundary?",
    description:
      "See which request reached the gate and what decision the policy made about it.",
    grad: "linear-gradient(120deg, #d7e6fb 0%, #e8eeff 55%, #ddd9fb 100%)",
    Illustration: BoundaryIllustration,
  },
  {
    question: "What should we fix first?",
    description:
      "Start with the highest-priority findings and their suggested next steps.",
    grad: "linear-gradient(120deg, #fdedc6 0%, #fbf0d4 55%, #f6e1b5 100%)",
    Illustration: PriorityIllustration,
  },
  {
    question: "Which controls have evidence?",
    description:
      "Review mapped control coverage, linked evidence, and the gaps still open.",
    grad: "linear-gradient(120deg, #d2efe7 0%, #e5f5ed 55%, #d6eedb 100%)",
    Illustration: ControlsIllustration,
  },
  {
    question: "How did the gate respond?",
    description:
      "Follow the request and the policy decision side by side — gate off vs. gate on.",
    grad: "linear-gradient(120deg, #f6d9ec 0%, #fbe6f1 55%, #ead7f6 100%)",
    Illustration: GateIllustration,
  },
];

// ---------------------------------------------------------------------------
// Section — sticky question list (desktop) with scrolling illustrations.
// Stacks to question → illustration on mobile.
// ---------------------------------------------------------------------------

export function ExplorerSection() {
  const [active, setActive] = React.useState(0);
  const reduced = useReducedMotion();
  const illRefs = React.useRef<Array<HTMLDivElement | null>>([]);

  // Active = whichever illustration currently spans the viewport's middle line.
  React.useEffect(() => {
    const nodes = illRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const idx = nodes.indexOf(e.target as HTMLElement);
            if (idx !== -1) setActive(idx);
          }
        }
      },
      { rootMargin: "-50% 0px -50% 0px", threshold: 0 }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  function goTo(i: number) {
    illRefs.current[i]?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
  }

  const activeItem = ITEMS[active];

  return (
    <section className="bg-[#fbf7f5] py-[53px] sm:pb-[70px] sm:pt-[72px]">
      <div className="mx-auto w-[calc(100%-40px)] text-left sm:w-[min(1248px,calc(100%-64px))]">
        {/* Heading */}
        <SectionHeading
          centered
          title="See the whole security picture, one question at a time."
          subtitle="Follow the evidence across threats, vulnerabilities, network boundaries, and the controls you need to review."
        />

        {/* ---- Desktop: sticky left list + scrolling right illustrations ---- */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(300px,0.82fr)_minmax(0,1.18fr)] lg:gap-[64px]">
          {/* Sticky question list */}
          <div className="lg:sticky lg:top-[96px] lg:h-fit lg:self-start">
            <ul className="flex flex-col">
              {ITEMS.map((item, i) => {
                const isActive = i === active;
                return (
                  <li key={item.question}>
                    <button
                      type="button"
                      onClick={() => goTo(i)}
                      aria-current={isActive ? "true" : undefined}
                      className="group relative flex w-full items-start gap-3 border-b border-[#e7e0df] py-[14px] text-left"
                    >
                      {isActive && (
                        <motion.span
                          layoutId="faq-active-bar"
                          className="absolute left-0 top-0 h-full w-[2px] bg-[var(--paper-purple)]"
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      <span
                        className={`mt-[2px] font-mono text-[12px] tabular-nums transition-colors ${
                          isActive ? "text-[var(--paper-purple)]" : "text-[#aba5ad]"
                        }`}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`text-[17px] font-[560] leading-snug transition-colors [font-family:var(--font-bricolage)] ${
                          isActive ? "text-[var(--paper-ink)]" : "text-[#8b858d]"
                        }`}
                      >
                        {item.question}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Active description */}
            <div className="relative mt-6 min-h-[92px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                >
                  <p className="max-w-[420px] text-[16px] leading-[1.55] text-[var(--paper-muted)]">
                    {activeItem.description}
                  </p>
                  {activeItem.link && (
                    <button
                      type="button"
                      onClick={() => goTo(active)}
                      className="mt-3 inline-flex text-[13px] font-medium text-[var(--paper-purple)]"
                    >
                      {activeItem.link} ↗
                    </button>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Scrolling illustrations */}
          <div className="flex flex-col">
            {ITEMS.map((item, i) => {
              const Illus = item.Illustration;
              return (
                <div
                  key={item.question}
                  ref={(el) => {
                    illRefs.current[i] = el;
                  }}
                  className="flex min-h-[78vh] items-center"
                >
                  <motion.div
                    className="w-full"
                    initial={reduced ? false : { opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ margin: "-25% 0px -25% 0px" }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <GradientFrame grad={item.grad}>
                      <Illus />
                    </GradientFrame>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- Mobile / tablet: each question is ONE gradient card holding the
             heading, description, illustration and link together. ---- */}
        <div className="flex flex-col gap-8 lg:hidden">
          {ITEMS.map((item, i) => {
            const Illus = item.Illustration;
            return (
              <motion.div
                key={item.question}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px -8% 0px" }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden rounded-[24px] border border-white/60 p-5 sm:p-7"
                style={{
                  backgroundImage: `${PATTERN}, ${item.grad}`,
                  backgroundSize: "150% 150%, 100% 100%",
                }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[12px] tabular-nums text-[var(--paper-purple)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[21px] font-[600] leading-snug [font-family:var(--font-bricolage)] text-[var(--paper-ink)]">
                    {item.question}
                  </h3>
                </div>
                <p className="mt-2 text-[16px] leading-[1.55] text-[var(--paper-muted)]">
                  {item.description}
                </p>
                <div className="mt-5">
                  <Illus />
                </div>
                {item.link && (
                  <a
                    href="#how-it-works"
                    className="mt-5 inline-flex text-[13px] font-medium text-[var(--paper-purple)]"
                  >
                    {item.link} ↗
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Illustrations — HTML/Tailwind cards (no shared SVG ids, so they can safely
// render twice: once in the desktop column, once in the mobile stack).
// ---------------------------------------------------------------------------

const frame =
  "w-full rounded-[16px] border border-white bg-white p-5 shadow-[0_6px_18px_rgba(84,64,75,0.08)] sm:p-6";
const cardHead = "flex items-start justify-between gap-3";
const cardTitle = "text-[13px] font-[640] [font-family:var(--font-bricolage)]";
const cardSub = "text-[12px] text-[#88828b]";
const badge =
  "shrink-0 rounded-full border border-[#ebe3ee] px-2 py-1 text-[11px] text-[var(--paper-purple)]";
const critical = "text-[#c0485a]";
const high = "text-[#b2713f]";
const medium = "text-[#9a7d1a]";

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="overflow-hidden text-ellipsis whitespace-nowrap rounded-[6px] border border-[#ded6e9] bg-[#f7f4fb] px-[9px] py-2 text-center text-[12px]">
      {children}
    </span>
  );
}

function ThreatChainIllustration() {
  return (
    <div className={frame}>
      <div className={cardHead}>
        <div className="grid gap-[3px]">
          <strong className={cardTitle}>Attack path · suspicious control command</strong>
          <small className={cardSub}>Signal → weakness → protected system</small>
        </div>
        <span className={badge}>Threat intel</span>
      </div>
      <div className="mt-4 grid grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)] items-center gap-3 sm:gap-5">
        <div className="grid gap-2">
          <small className="text-[11px] uppercase tracking-wide text-[#8a788f]">
            External · untrusted
          </small>
          <Chip>Threat actor</Chip>
          <Chip>Malware</Chip>
          <em className={`text-[12px] not-italic ${critical}`}>CVE-2024-3400</em>
        </div>
        <div
          className="h-[132px] w-[2px] bg-[var(--paper-purple)]"
          aria-label="Boundary line"
        />
        <div className="grid gap-2">
          <small className="text-[11px] uppercase tracking-wide text-[#8a788f]">
            Protected · internal
          </small>
          <Chip>Boundary gate</Chip>
          <Chip>Water control PLC</Chip>
          <em className="text-[12px] not-italic text-[var(--paper-purple)]">Blocked</em>
        </div>
      </div>
      <p className="mt-4 border-t border-[var(--paper-line)] pt-3 text-[12px] leading-[1.5] text-[#77717a]">
        A write command from an untrusted source was stopped before reaching the
        protected controller.
      </p>
    </div>
  );
}

function SeverityIllustration() {
  const rows: Array<{ sev: string; cls: string; text: string; asset: string; w: string }> = [
    { sev: "Critical", cls: critical, text: "Remote access service exposed", asset: "Asset 04", w: "92%" },
    { sev: "High", cls: high, text: "Unpatched gateway firmware", asset: "Asset 02", w: "68%" },
    { sev: "Medium", cls: medium, text: "Weak TLS on management port", asset: "Asset 06", w: "44%" },
  ];
  return (
    <div className={frame}>
      <div className={cardHead}>
        <div className="grid gap-[3px]">
          <strong className={cardTitle}>Vulnerabilities · ranked for review</strong>
          <small className={cardSub}>By severity and affected system</small>
        </div>
        <span className={badge}>Critical first</span>
      </div>
      <div className="mt-4 grid gap-3">
        {rows.map((r) => (
          <div key={r.text} className="grid gap-[6px]">
            <div className="flex items-center justify-between gap-2 text-[12px]">
              <span className="flex items-center gap-2">
                <b className={`uppercase ${r.cls}`}>{r.sev}</b>
                <span className="text-[#3f3a44]">{r.text}</span>
              </span>
              <small className="whitespace-nowrap text-[var(--paper-muted)]">{r.asset}</small>
            </div>
            <div className="h-[6px] overflow-hidden rounded-full bg-[#efeae7]">
              <span
                className="block h-full rounded-full bg-[currentColor] opacity-80"
                style={{ width: r.w }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoundaryIllustration() {
  return (
    <div className={frame}>
      <div className={cardHead}>
        <div className="grid gap-[3px]">
          <strong className={cardTitle}>Boundary decision · inbound request</strong>
          <small className={cardSub}>What reached the gate, and the verdict</small>
        </div>
        <span className={badge}>Gate active</span>
      </div>
      <div className="relative mt-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 sm:gap-4">
        <Chip>Inbound write request</Chip>
        <div className="flex flex-col items-center gap-1">
          <span className="h-[70px] w-[2px] bg-[var(--paper-purple)]" aria-hidden />
          <span className="text-[10px] uppercase tracking-wide text-[#8a788f]">Gate</span>
        </div>
        <span className="inline-flex items-center justify-center gap-2 rounded-[6px] border border-[#e7cfd3] bg-[#fbf1f2] px-[9px] py-2 text-center text-[12px] font-medium text-[#c0485a]">
          Blocked
        </span>
      </div>
      <p className="mt-4 border-t border-[var(--paper-line)] pt-3 text-[12px] leading-[1.5] text-[#77717a]">
        The request crossed from the untrusted side and was stopped by policy at
        the boundary — logged with the decision.
      </p>
    </div>
  );
}

function PriorityIllustration() {
  const rows: Array<{ n: number; text: string; sev: string; cls: string; action: string }> = [
    { n: 1, text: "Remote service exposed", sev: "Critical", cls: critical, action: "Restrict + patch" },
    { n: 2, text: "Gateway firmware behind", sev: "High", cls: high, action: "Schedule update" },
    { n: 3, text: "Weak TLS on mgmt port", sev: "Medium", cls: medium, action: "Rotate + enforce" },
  ];
  return (
    <div className={frame}>
      <div className={cardHead}>
        <div className="grid gap-[3px]">
          <strong className={cardTitle}>Priority &amp; next steps</strong>
          <small className={cardSub}>Ranked by severity and reach</small>
        </div>
        <span className={badge}>Fix first</span>
      </div>
      <div className="mt-4 grid gap-[2px]">
        {rows.map((r) => (
          <div
            key={r.text}
            className="grid grid-cols-[18px_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--paper-line)] py-[11px] text-[12px] last:border-b-0"
          >
            <span className="font-mono text-[12px] text-[#aba5ad]">{r.n}</span>
            <span className="min-w-0">
              <span className="block truncate text-[#3f3a44]">{r.text}</span>
              <span className={`text-[11px] uppercase ${r.cls}`}>{r.sev}</span>
            </span>
            <span className="whitespace-nowrap rounded-[6px] bg-[#f5f2ee] px-[9px] py-1 text-[11px] text-[#6b656d]">
              {r.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlsIllustration() {
  const bars: Array<{ name: string; value: number }> = [
    { name: "NIST SP 800-53", value: 72 },
    { name: "SOC 2 Type II", value: 68 },
  ];
  const rows: Array<{ name: string; state: string }> = [
    { name: "Access enforcement", state: "Evidence linked" },
    { name: "Boundary protection", state: "Review needed" },
    { name: "System monitoring", state: "Finding mapped" },
  ];
  return (
    <div className={frame}>
      <div className={cardHead}>
        <div className="grid gap-[3px]">
          <strong className={cardTitle}>Control evidence</strong>
          <small className={cardSub}>NIST SP 800-53 · SOC 2</small>
        </div>
        <span className={badge}>Control map</span>
      </div>
      <div className="mt-4 grid gap-[14px]">
        {bars.map((b) => (
          <div key={b.name} className="grid gap-[6px]">
            <div className="flex items-center justify-between text-[12px]">
              <span className="text-[#3f3a44]">{b.name}</span>
              <span className="tabular-nums text-[var(--paper-purple)]">{b.value}%</span>
            </div>
            <div className="h-[6px] overflow-hidden rounded-full bg-[#efeae7]">
              <span
                className="block h-full rounded-full bg-[var(--paper-purple)]"
                style={{ width: `${b.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-2 border-t border-[var(--paper-line)] pt-3">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center justify-between text-[12px] text-[#5d5760]">
            {r.name}
            <b className="font-medium text-[var(--paper-purple)]">{r.state}</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function GateIllustration() {
  return (
    <div className={frame}>
      <div className={cardHead}>
        <div className="grid gap-[3px]">
          <strong className={cardTitle}>Gate response · suspicious Modbus write</strong>
          <small className={cardSub}>Off vs. on</small>
        </div>
        <span className={badge}>Policy</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="grid gap-2 rounded-[10px] border border-[#e7e2e2] bg-[#faf8f8] p-[13px]">
          <small className="text-[11px] uppercase tracking-wide text-[#8a858b]">Gate off</small>
          <span className="text-[12px] text-[#77717a]">
            Write command → Controller
          </span>
          <em className={`text-[12px] not-italic ${critical}`}>Reached the system</em>
        </div>
        <div className="grid gap-2 rounded-[10px] border border-[#ded6e9] bg-[#f7f4fb] p-[13px]">
          <small className="text-[11px] uppercase tracking-wide text-[#827393]">Gate on</small>
          <span className="text-[12px] text-[#77717a]">
            Write command → Boundary gate
          </span>
          <em className="text-[12px] not-italic text-[var(--paper-purple)]">Blocked by policy</em>
        </div>
      </div>
      <p className="mt-4 border-t border-[var(--paper-line)] pt-3 text-[12px] leading-[1.5] text-[#77717a]">
        The same command reaches the controller with the gate off, and is stopped
        when policy is enforced.
      </p>
    </div>
  );
}
