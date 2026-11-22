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
      className="relative z-[2] mx-auto mt-[44px] w-full max-w-[1080px] rounded-2xl border border-[#e4ddda] bg-white/[0.96] px-5 pb-5 pt-[18px] shadow-[0_22px_54px_rgba(84,64,75,0.12)] max-[900px]:mt-9 max-[900px]:p-[14px] max-[640px]:mt-7 max-[640px]:rounded-[11px] max-[640px]:p-[11px]"
      data-motion-kind="preview"
      aria-label="Illustrative, interactive security dashboard preview"
    >
      <div className="flex min-h-[44px] items-start justify-between gap-[18px] border-b border-[var(--paper-line)] max-[640px]:flex-col max-[640px]:pb-[9px]">
        <div className="flex items-center gap-[9px] text-[12px] text-[var(--paper-muted)] max-[640px]:flex-wrap">
          <i className="h-[6px] w-[6px] rounded-full bg-[var(--paper-purple)] [animation:status-breathe_2.6s_ease-in-out_infinite] motion-reduce:[animation:none]" />{" "}
          <strong className="text-[13px] text-[#403b43]">Security overview</strong>
          <span>· illustrative sample</span>
          <span>/ {NAV[active].label}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[var(--paper-muted)] max-[640px]:self-end">
          <span className="whitespace-nowrap rounded-[6px] border border-[var(--paper-line)] px-[9px] py-[6px]">
            Last 24 hours
          </span>
          <span className="whitespace-nowrap rounded-[6px] border border-[#e4dbf2] bg-[var(--paper-purple-soft)] px-[9px] py-[6px] text-[var(--paper-purple)]">
            ● Gate active
          </span>
        </div>
      </div>
      <div className="grid grid-cols-[190px_minmax(0,1fr)] gap-4 pt-4 max-[900px]:grid-cols-[142px_minmax(0,1fr)] max-[900px]:gap-[10px] max-[640px]:block">
        <aside className="flex min-w-0 flex-col gap-[5px] pr-px text-[12px] text-[#57515a] max-[640px]:hidden">
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
        <div className="grid min-w-0 gap-3 max-[640px]:gap-2" ref={contentRef} key={active}>
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
        <div className={`${card} px-4 pb-[11px] pt-[15px] max-[640px]:p-[10px]`} data-rise>
          <div className="flex justify-between gap-[10px] text-[12px]">
            <strong>Gate proof · suspicious Modbus write</strong>
            <small className="text-[12px] text-[#8b858d] max-[640px]:hidden">off vs on</small>
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
          <div className="grid grid-cols-[minmax(0,2fr)_minmax(230px,0.78fr)] gap-[10px] max-[900px]:grid-cols-1">
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
    <div className="grid w-[min(100%,660px)] grid-cols-3 justify-self-center gap-[10px] max-[640px]:gap-[5px]">
      {stats.map((s) => (
        <div
          className="flex min-h-[76px] flex-wrap items-center justify-center gap-[7px] rounded-[6px] border border-[var(--paper-line)] bg-white p-[10px] text-center max-[640px]:gap-[3px] max-[640px]:px-1 max-[640px]:py-[7px]"
          data-rise
          key={s.label}
        >
          <small className="w-full text-[12px] text-[#88828a]">{s.label}</small>
          <strong
            className="text-[24px] font-[620] leading-none [font-family:var(--font-bricolage)] max-[640px]:text-[18px]"
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
    "flex items-center justify-center gap-[7px] max-[640px]:flex-col max-[640px]:items-stretch max-[640px]:gap-1";
  const chip =
    "overflow-hidden text-ellipsis whitespace-nowrap rounded-[5px] border border-[#ded6e9] bg-[#f7f4fb] px-[9px] py-2 text-[12px] max-[640px]:px-[5px] max-[640px]:py-[6px] max-[640px]:text-center";
  const arrow = "text-[12px] text-[#969099] max-[640px]:hidden";
  const em = "whitespace-nowrap text-[12px] not-italic max-[640px]:text-center";
  return (
    <div className="relative grid min-h-[118px] grid-cols-[minmax(0,1fr)_2px_minmax(0,1fr)] items-center gap-5 px-[10px] py-2 after:absolute after:left-[13%] after:top-[calc(50%-3px)] after:h-[6px] after:w-[6px] after:rounded-full after:bg-[var(--paper-purple)] after:shadow-[0_0_0_4px_rgba(91,43,210,0.1),0_0_13px_rgba(91,43,210,0.35)] after:content-[''] after:[animation:signal-stop_3.8s_ease-in-out_1.1s_infinite] motion-reduce:after:[animation:none] max-[640px]:min-h-[145px] max-[640px]:gap-2 max-[640px]:px-0 max-[640px]:py-[7px]">
      <div className={side}>
        <small className={sideHead}>{left.label}</small>
        <div className={sideRow}>
          <span className={chip}>{left.span1}</span>
          <b className={arrow}>→</b>
          <span className={chip}>{left.span2}</span>
          <em className={`${em} ${left.emCritical ? critical : "text-[var(--paper-purple)]"}`}>{left.em}</em>
        </div>
      </div>
      <div className="h-[72px] w-[2px] bg-[var(--paper-purple)] max-[640px]:h-[95px]" aria-label="Boundary line" />
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
    <div className={`${card} px-4 pb-[11px] pt-[15px] max-[640px]:p-[10px]`} data-rise>
      <div className="flex justify-between gap-[10px] text-[12px]">
        <strong>Attack path · suspicious Modbus write</strong>
        <small className="text-[12px] text-[#8b858d] max-[640px]:hidden">Trace ID EB-2048</small>
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
        <div className="flex min-w-0 items-center gap-2 py-[5px] text-[12px] max-[640px]:flex-wrap" key={f.text}>
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
