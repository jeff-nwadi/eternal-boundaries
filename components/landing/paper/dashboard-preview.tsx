"use client";

import * as React from "react";
import { animate, stagger } from "animejs";

/**
 * Interactive, illustrative dashboard preview for the hero. Clicking a workspace
 * item switches the view; anime.js cross-fades the content and counts up the
 * stats. Sample data only — never real telemetry. Respects reduced-motion.
 */
const NAV = [
  { label: "Overview", icon: "◈" },
  { label: "Threat intelligence", icon: "⌁" },
  { label: "Vulnerabilities", icon: "◇" },
  { label: "Compliance map", icon: "▦" },
  { label: "Gate proof", icon: "⛨" },
] as const;

type Stat = { label: string; value: number; pad?: number; suffix?: string; caption: string };
type Finding = { severity: "Critical" | "High"; text: string; asset: string };

const card = "min-w-0 rounded-[7px] border border-[var(--paper-line)]";
const critical = "text-[#af5866]";
const high = "text-[#a97964]";

export function DashboardPreview() {
  const [active, setActive] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    el.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
      const target = Number(node.dataset.count);
      const pad = Number(node.dataset.pad ?? 0);
      const suffix = node.dataset.suffix ?? "";
      const render = (n: number) =>
        (pad ? String(n).padStart(pad, "0") : String(n)) + suffix;
      if (reduced) {
        node.textContent = render(target);
        return;
      }
      const obj = { n: 0 };
      animate(obj, {
        n: target,
        duration: 760,
        ease: "out(3)",
        onUpdate: () => {
          node.textContent = render(Math.round(obj.n));
        },
      });
    });

    if (reduced) return;
    const blocks = el.querySelectorAll<HTMLElement>("[data-rise]");
    animate(blocks, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 420,
      delay: stagger(55),
      ease: "out(3)",
    });
  }, [active]);

  return (
    <div
      className="relative z-[2] mx-auto mt-7 w-full max-w-[1080px] rounded-[11px] border border-[#e4ddda] bg-white/[0.96] p-[11px] shadow-[0_22px_54px_rgba(84,64,75,0.12)] sm:mt-9 sm:rounded-2xl sm:p-[14px] lg:mt-[44px] lg:px-5 lg:pb-5 lg:pt-[18px]"
      data-motion-kind="preview"
      aria-label="Illustrative, interactive security dashboard preview"
    >
      <div className="flex min-h-[44px] flex-col items-start justify-between gap-[18px] border-b border-[var(--paper-line)] pb-[9px] sm:flex-row sm:pb-0">
        <div className="flex flex-wrap items-center gap-[9px] text-[12px] text-[var(--paper-muted)] sm:flex-nowrap">
          <i className="h-[6px] w-[6px] rounded-full bg-[var(--paper-purple)] [animation:status-breathe_2.6s_ease-in-out_infinite] motion-reduce:[animation:none]" />{" "}
          <strong className="text-[13px] text-[#403b43]">Security overview</strong>
          <span>· illustrative sample</span>
          <span>/ {NAV[active].label}</span>
        </div>
        <div className="flex items-center gap-2 self-end text-[12px] text-[var(--paper-muted)] sm:self-auto">
          <span className="whitespace-nowrap rounded-[6px] border border-[var(--paper-line)] px-[9px] py-[6px]">
            Last 24 hours
          </span>
          <span className="whitespace-nowrap rounded-[6px] border border-[#e4dbf2] bg-[var(--paper-purple-soft)] px-[9px] py-[6px] text-[var(--paper-purple)]">
            ● Gate active
          </span>
        </div>
      </div>
      <div className="block pt-4 sm:grid sm:grid-cols-[142px_minmax(0,1fr)] sm:gap-[10px] lg:grid-cols-[190px_minmax(0,1fr)] lg:gap-4">
        <aside className="hidden min-w-0 flex-col gap-[5px] pr-px text-[12px] text-[#57515a] sm:flex">
          <small className="mt-[2px] mb-[7px] text-center text-[12px] uppercase text-[#99949a]">Workspace</small>
          {NAV.map((item, i) => (
            <span
              key={item.label}
              role="button"
              tabIndex={0}
              aria-current={i === active ? "page" : undefined}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(i);
                }
              }}
              className={`flex min-h-[35px] cursor-pointer items-center gap-2 whitespace-nowrap rounded-[5px] px-[11px] ${i === active ? "bg-[#f1efeb] text-[var(--paper-purple)]" : ""}`}
            >
              <b className="w-[13px] text-center text-[#78727c]">{item.icon}</b>
              {item.label}
            </span>
          ))}
          <hr className="my-[7px] mb-[3px] w-full border-0 border-t border-[var(--paper-line)]" />
          <small className="mt-[2px] mb-[7px] text-center text-[12px] uppercase text-[#99949a]">Connected scope</small>
          <span className="flex min-h-[35px] items-center gap-2 whitespace-nowrap rounded-[5px] px-[11px]">
            <b className="w-[13px] text-center text-[#78727c]">◉</b>Enterprise network
          </span>
          <span className="flex min-h-[35px] items-center gap-2 whitespace-nowrap rounded-[5px] px-[11px]">
            <b className="w-[13px] text-center text-[#78727c]">◉</b>OT · Modbus
          </span>
        </aside>
        <div className="grid min-w-0 gap-2 sm:gap-3" ref={contentRef} key={active}>
          <ViewContent active={active} />
        </div>
      </div>
    </div>
  );
}

function ViewContent({ active }: { active: number }) {
  switch (active) {
    case 1:
      return (
        <>
          <ChainCard />
          <ListCard
            title="Live indicator feed"
            rows={[
              { severity: "Critical", text: "APT write attempt at edge", asset: "Edge 01" },
              { severity: "High", text: "Malware beacon observed", asset: "Host 03" },
              { severity: "High", text: "Port scan on gateway", asset: "Gateway" },
            ]}
          />
        </>
      );
    case 2:
      return (
        <>
          <StatRow
            stats={[
              { label: "Critical", value: 3, pad: 2, caption: "need review", suffix: "" },
              { label: "High", value: 7, pad: 2, caption: "ranked", suffix: "" },
              { label: "Open total", value: 18, caption: "across 6 assets", suffix: "" },
            ]}
          />
          <ListCard
            title="Priority vulnerabilities"
            rows={[
              { severity: "Critical", text: "Remote access service exposed", asset: "Asset 04" },
              { severity: "High", text: "Unpatched gateway firmware", asset: "Asset 02" },
              { severity: "High", text: "Weak TLS on management port", asset: "Asset 06" },
            ]}
          />
        </>
      );
    case 3:
      return (
        <>
          <div className={`${card} px-[15px] py-[13px]`} data-rise>
            <div className="flex items-baseline justify-between gap-[6px]">
              <strong className="mb-2 block text-[12px]">Control coverage</strong>
              <small className="text-[12px] uppercase text-[var(--paper-faint)]">Illustrative view</small>
            </div>
            <CoverageRow name="NIST SP 800-53" value={72} />
            <CoverageRow name="SOC 2 Type II" value={68} />
          </div>
          <ListCard
            title="Controls needing evidence"
            rows={[
              { severity: "High", text: "AC-4 Information flow enforcement", asset: "Map →" },
              { severity: "High", text: "CC6.6 Boundary protection", asset: "Review" },
            ]}
          />
        </>
      );
    case 4:
      return (
        <div className={`${card} p-[10px] sm:px-4 sm:pb-[11px] sm:pt-[15px]`} data-rise>
          <div className="flex justify-between gap-[10px] text-[12px]">
            <strong>Gate proof · suspicious Modbus write</strong>
            <small className="hidden text-[12px] text-[#8b858d] sm:block">off vs on</small>
          </div>
          <ChainGraphic
            left={{ label: "Gate off", span1: "Write command", span2: "Controller", em: "Reached", emCritical: true }}
            right={{ label: "Gate on", span1: "Write command", span2: "Boundary gate", em: "Blocked" }}
          />
          <p className="border-t border-[var(--paper-line)] pt-[10px] text-center text-[12px] text-[#7c767e]">
            Plain-language explanation · The same command reaches the controller
            with the gate off and is stopped when policy is enforced.
          </p>
        </div>
      );
    default:
      return (
        <>
          <StatRow
            stats={[
              { label: "Open findings", value: 18, caption: "across 6 assets", suffix: "" },
              { label: "Critical exposure", value: 3, pad: 2, caption: "need review", suffix: "" },
              { label: "Control coverage", value: 72, suffix: "%", caption: "mapped" },
            ]}
          />
          <ChainCard />
          <div className="grid grid-cols-1 gap-[10px] lg:grid-cols-[minmax(0,2fr)_minmax(230px,0.78fr)]">
            <ListCard
              title="Priority vulnerabilities"
              rows={[
                { severity: "Critical", text: "Remote access service exposed", asset: "Asset 04" },
                { severity: "High", text: "Unpatched gateway firmware", asset: "Asset 02" },
              ]}
            />
            <div className={`${card} px-[15px] py-[13px]`} data-rise>
              <div className="flex items-baseline justify-between gap-[6px]">
                <strong className="mb-2 block text-[12px]">Compliance mapping</strong>
                <small className="text-[12px] uppercase text-[var(--paper-faint)]">Illustrative view</small>
              </div>
              <p className="text-[12px] text-[#8b858b]">NIST SP 800-53 · SOC 2</p>
              <div className="my-[11px] mb-[6px] h-[5px] rounded-[9px] bg-[#e5e1df]">
                <i className="block h-full w-[72%] rounded-[inherit] bg-[var(--paper-purple)]" />
              </div>
              <small className="flex justify-between text-[12px] text-[#938e94]">
                Mapped control coverage <span className="text-[var(--paper-purple)]">Review details →</span>
              </small>
            </div>
          </div>
        </>
      );
  }
}

function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid w-[min(100%,660px)] grid-cols-3 justify-self-center gap-[5px] sm:gap-[10px]">
      {stats.map((s) => (
        <div
          className="flex min-h-[76px] flex-wrap items-center justify-center gap-[3px] rounded-[6px] border border-[var(--paper-line)] bg-white px-1 py-[7px] text-center sm:gap-[7px] sm:p-[10px]"
          data-rise
          key={s.label}
        >
          <small className="w-full text-[12px] text-[#88828a]">{s.label}</small>
          <strong
            className="text-[18px] font-[620] leading-none [font-family:var(--font-bricolage)] sm:text-[24px]"
            data-count={s.value}
            data-pad={s.pad ?? ""}
            data-suffix={s.suffix ?? ""}
          >
            {(s.pad ? String(s.value).padStart(s.pad, "0") : String(s.value)) +
              (s.suffix ?? "")}
          </strong>
          <span className="text-[12px] text-[var(--paper-muted)]">{s.caption}</span>
        </div>
      ))}
    </div>
  );
}

function ChainGraphic({
  left,
  right,
}: {
  left: { label: string; span1: string; span2: string; em: string; emCritical?: boolean };
  right: { label: string; span1: string; span2: string; em: string };
}) {
  const side = "min-w-0";
  const sideHead = "mb-[9px] block text-center text-[12px] uppercase text-[#827393]";
  const sideRow =
    "flex flex-col items-stretch justify-center gap-1 sm:flex-row sm:items-center sm:gap-[7px]";
  const chip =
    "overflow-hidden text-ellipsis whitespace-nowrap rounded-[5px] border border-[#ded6e9] bg-[#f7f4fb] px-[5px] py-[6px] text-center text-[12px] sm:px-[9px] sm:py-2 sm:text-left";
  const arrow = "hidden text-[12px] text-[#969099] sm:inline";
  const em = "whitespace-nowrap text-[12px] not-italic text-center sm:text-left";
  return (
    <div className="relative grid min-h-[145px] grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)] items-center gap-2 px-0 py-[7px] after:absolute after:left-[13%] after:top-[calc(50%-3px)] after:h-[6px] after:w-[6px] after:rounded-full after:bg-[var(--paper-purple)] after:shadow-[0_0_0_4px_rgba(91,43,210,0.1),0_0_13px_rgba(91,43,210,0.35)] after:content-[''] after:[animation:signal-stop_3.8s_ease-in-out_1.1s_infinite] motion-reduce:after:[animation:none] sm:min-h-[118px] sm:gap-5 sm:px-[10px] sm:py-2">
      <div className={side}>
        <small className={sideHead}>{left.label}</small>
        <div className={sideRow}>
          <span className={chip}>{left.span1}</span>
          <b className={arrow}>→</b>
          <span className={chip}>{left.span2}</span>
          <em className={`${em} ${left.emCritical ? critical : "text-[var(--paper-purple)]"}`}>{left.em}</em>
        </div>
      </div>
      <div className="h-[95px] w-[2px] bg-[var(--paper-purple)] sm:h-[72px]" aria-label="Boundary line" />
      <div className={side}>
        <small className={sideHead}>{right.label}</small>
        <div className={sideRow}>
          <span className={chip}>{right.span1}</span>
          <b className={arrow}>→</b>
          <span className={chip}>{right.span2}</span>
          <em className={`${em} text-[var(--paper-purple)]`}>{right.em}</em>
        </div>
      </div>
    </div>
  );
}

function ChainCard() {
  return (
    <div className={`${card} p-[10px] sm:px-4 sm:pb-[11px] sm:pt-[15px]`} data-rise>
      <div className="flex justify-between gap-[10px] text-[12px]">
        <strong>Attack path · suspicious Modbus write</strong>
        <small className="hidden text-[12px] text-[#8b858d] sm:block">Trace ID EB-2048</small>
      </div>
      <ChainGraphic
        left={{ label: "External · untrusted", span1: "Threat actor", span2: "Malware", em: "CVE-2024-3400", emCritical: true }}
        right={{ label: "Protected · internal", span1: "Boundary gate", span2: "Water control PLC", em: "Blocked" }}
      />
      <p className="border-t border-[var(--paper-line)] pt-[10px] text-center text-[12px] text-[#7c767e]">
        Plain-language explanation · A write command from an untrusted source was
        stopped before reaching the protected controller.
      </p>
    </div>
  );
}

function ListCard({ title, rows }: { title: string; rows: Finding[] }) {
  return (
    <div className={`${card} px-[15px] py-[13px]`} data-rise>
      <strong className="mb-2 block text-[12px]">{title}</strong>
      {rows.map((f) => (
        <div className="flex min-w-0 flex-wrap items-center gap-2 py-[5px] text-[12px] sm:flex-nowrap" key={f.text}>
          <b className={`text-[12px] uppercase ${f.severity === "Critical" ? critical : high}`}>
            {f.severity}
          </b>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{f.text}</span>
          <small className="whitespace-nowrap text-[var(--paper-muted)]">{f.asset} →</small>
        </div>
      ))}
    </div>
  );
}

function CoverageRow({ name, value }: { name: string; value: number }) {
  return (
    <div className="mt-[10px]">
      <p className="mb-[6px]">
        {name} · <span data-count={value} data-suffix="%">{value}%</span>
      </p>
      <div className="my-[11px] mb-[6px] h-[5px] rounded-[9px] bg-[#e5e1df]">
        <i className="block h-full rounded-[inherit] bg-[var(--paper-purple)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
