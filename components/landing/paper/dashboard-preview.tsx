"use client";

import * as React from "react";
import { animate, stagger } from "animejs";

import styles from "../paper-landing-page.module.css";

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

export function DashboardPreview() {
  const [active, setActive] = React.useState(0);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Count-ups (run even under reduced-motion we just snap to final).
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
      className={styles.previewFrame}
      data-motion-kind="preview"
      aria-label="Illustrative, interactive security dashboard preview"
    >
      <div className={styles.previewTopbar}>
        <div className={styles.previewTitle}>
          <i /> <strong>Security overview</strong>
          <span>· illustrative sample</span>
          <span>/ {NAV[active].label}</span>
        </div>
        <div className={styles.previewTopActions}>
          <span>Last 24 hours</span>
          <span className={styles.activePill}>● Gate active</span>
        </div>
      </div>
      <div className={styles.previewBody}>
        <aside className={styles.previewSidebar}>
          <small>Workspace</small>
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
              className={i === active ? styles.selectedNav : ""}
              style={{ cursor: "pointer" }}
            >
              <b>{item.icon}</b>
              {item.label}
            </span>
          ))}
          <hr />
          <small>Connected scope</small>
          <span>
            <b>◉</b>Enterprise network
          </span>
          <span>
            <b>◉</b>OT · Modbus
          </span>
        </aside>
        <div className={styles.previewContent} ref={contentRef} key={active}>
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
          <div className={styles.previewCompliance} data-rise>
            <div>
              <strong>Control coverage</strong>
              <small>Illustrative view</small>
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
        <>
          <div className={styles.chainCard} data-rise>
            <div className={styles.chainHeading}>
              <strong>Gate proof · suspicious Modbus write</strong>
              <small>off vs on</small>
            </div>
            <div className={styles.chainGraphic}>
              <div className={styles.chainSide}>
                <small>Gate off</small>
                <div>
                  <span>Write command</span>
                  <b>→</b>
                  <span>Controller</span>
                  <em className={styles.critical}>Reached</em>
                </div>
              </div>
              <div className={styles.boundaryMark} aria-label="Boundary line" />
              <div className={styles.chainSide}>
                <small>Gate on</small>
                <div>
                  <span>Write command</span>
                  <b>→</b>
                  <span>Boundary gate</span>
                  <em>Blocked</em>
                </div>
              </div>
            </div>
            <p>
              Plain-language explanation · The same command reaches the controller
              with the gate off and is stopped when policy is enforced.
            </p>
          </div>
        </>
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
          <div className={styles.previewBottom}>
            <ListCard
              title="Priority vulnerabilities"
              rows={[
                { severity: "Critical", text: "Remote access service exposed", asset: "Asset 04" },
                { severity: "High", text: "Unpatched gateway firmware", asset: "Asset 02" },
              ]}
            />
            <div className={styles.previewCompliance} data-rise>
              <div>
                <strong>Compliance mapping</strong>
                <small>Illustrative view</small>
              </div>
              <p>NIST SP 800-53 · SOC 2</p>
              <div className={styles.coverageTrack}>
                <i />
              </div>
              <small>
                Mapped control coverage <span>Review details →</span>
              </small>
            </div>
          </div>
        </>
      );
  }
}

function StatRow({ stats }: { stats: Stat[] }) {
  return (
    <div className={styles.previewStats}>
      {stats.map((s) => (
        <div className={styles.previewStat} data-rise key={s.label}>
          <small>{s.label}</small>
          <strong
            data-count={s.value}
            data-pad={s.pad ?? ""}
            data-suffix={s.suffix ?? ""}
          >
            {(s.pad ? String(s.value).padStart(s.pad, "0") : String(s.value)) +
              (s.suffix ?? "")}
          </strong>
          <span>{s.caption}</span>
        </div>
      ))}
    </div>
  );
}

function ChainCard() {
  return (
    <div className={styles.chainCard} data-rise>
      <div className={styles.chainHeading}>
        <strong>Attack path · suspicious Modbus write</strong>
        <small>Trace ID EB-2048</small>
      </div>
      <div className={styles.chainGraphic}>
        <div className={styles.chainSide}>
          <small>External · untrusted</small>
          <div>
            <span>Threat actor</span>
            <b>→</b>
            <span>Malware</span>
            <b>→</b>
            <span>CVE-2024-3400</span>
          </div>
        </div>
        <div className={styles.boundaryMark} aria-label="Boundary line" />
        <div className={styles.chainSide}>
          <small>Protected · internal</small>
          <div>
            <span>Boundary gate</span>
            <b>→</b>
            <span>Water control PLC</span>
            <em>Blocked</em>
          </div>
        </div>
      </div>
      <p>
        Plain-language explanation · A write command from an untrusted source was
        stopped before reaching the protected controller.
      </p>
    </div>
  );
}

function ListCard({ title, rows }: { title: string; rows: Finding[] }) {
  return (
    <div className={styles.previewList} data-rise>
      <strong>{title}</strong>
      {rows.map((f) => (
        <div className={styles.previewFinding} key={f.text}>
          <b className={f.severity === "Critical" ? styles.critical : styles.high}>
            {f.severity}
          </b>
          <span>{f.text}</span>
          <small>{f.asset} →</small>
        </div>
      ))}
    </div>
  );
}

function CoverageRow({ name, value }: { name: string; value: number }) {
  return (
    <div style={{ marginTop: 10 }}>
      <p style={{ marginBottom: 6 }}>
        {name} · <span data-count={value} data-suffix="%">{value}%</span>
      </p>
      <div className={styles.coverageTrack}>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
