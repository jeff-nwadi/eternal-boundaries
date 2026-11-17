import {
  Crosshair,
  User,
  ShieldCheck,
  ShieldOff,
  Cpu,
  Check,
  X,
  Info,
  ChevronRight,
} from "lucide-react";

import {
  type ModbusProof,
  type ProofLeg,
  groupHex,
} from "@/lib/proof/modbus-proof";
import { Panel } from "@/components/dashboard/ui/panel";
import { EmptyState } from "@/components/dashboard/ui/empty-state";

const RED = "var(--severity-critical)";
const GOOD = "var(--primary)";

/* ---------------- small building blocks ---------------- */

function Node({
  icon,
  label,
  tone = "rgb(255 255 255 / 0.8)",
  dim = false,
}: {
  icon: React.ReactNode;
  label: string;
  tone?: string;
  dim?: boolean;
}) {
  return (
    <div className={`flex w-16 shrink-0 flex-col items-center gap-2 ${dim ? "opacity-35" : ""}`}>
      <span
        className="grid size-12 place-items-center rounded-xl bg-white/[0.06]"
        style={{ color: tone }}
      >
        {icon}
      </span>
      <span className="text-center text-[11px] leading-tight text-white/55">{label}</span>
    </div>
  );
}

/** Connector between two nodes: flowing (arrow) or blocked (stop). */
function Link({ blocked = false }: { blocked?: boolean }) {
  if (blocked) {
    return (
      <div className="flex min-w-10 flex-1 items-center justify-center">
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ color: RED, backgroundColor: "color-mix(in oklab, var(--severity-critical) 16%, transparent)" }}
        >
          <X className="size-3" strokeWidth={3} />
          Blocked
        </span>
      </div>
    );
  }
  return (
    <div className="flex min-w-10 flex-1 items-center">
      <span className="h-px flex-1 bg-white/20" />
      <ChevronRight className="size-4 shrink-0 text-white/35" strokeWidth={2} />
    </div>
  );
}

type Kind = "off-attack" | "on-attack" | "legit";

const SCENARIOS: Record<
  Kind,
  {
    title: string;
    outcome: string;
    outcomeTone: string;
    sentence: string;
    actor: React.ReactNode;
    actorLabel: string;
    gateOn: boolean;
    reached: boolean;
    deviceTone: string;
  }
> = {
  "off-attack": {
    title: "Without the gate",
    outcome: "Attack reached the device",
    outcomeTone: RED,
    sentence:
      "With our gate out of the path, the malicious command went straight to the controller — and it was accepted.",
    actor: <Crosshair className="size-5" strokeWidth={2} />,
    actorLabel: "Attacker",
    gateOn: false,
    reached: true,
    deviceTone: RED,
  },
  "on-attack": {
    title: "With the gate on",
    outcome: "Blocked at the gate",
    outcomeTone: GOOD,
    sentence:
      "The exact same command was stopped at the gate before it ever reached the controller.",
    actor: <Crosshair className="size-5" strokeWidth={2} />,
    actorLabel: "Attacker",
    gateOn: true,
    reached: false,
    deviceTone: "rgb(255 255 255 / 0.8)",
  },
  legit: {
    title: "Normal operations",
    outcome: "Delivered normally",
    outcomeTone: GOOD,
    sentence:
      "A legitimate command from a real operator passes through untouched — the gate doesn't get in the way of real work.",
    actor: <User className="size-5" strokeWidth={2} />,
    actorLabel: "Operator",
    gateOn: true,
    reached: true,
    deviceTone: "rgb(255 255 255 / 0.8)",
  },
};

function Scenario({ kind }: { kind: Kind }) {
  const s = SCENARIOS[kind];
  const actorTone = kind === "legit" ? "rgb(255 255 255 / 0.8)" : RED;
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-white/[0.04] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-white">{s.title}</span>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{ color: s.outcomeTone, backgroundColor: "color-mix(in oklab, currentColor 14%, transparent)" }}
        >
          {s.outcomeTone === GOOD ? <Check className="size-3.5" strokeWidth={3} /> : <X className="size-3.5" strokeWidth={3} />}
          {s.outcome}
        </span>
      </div>

      {/* Flow: actor → gate → controller */}
      <div className="flex items-start justify-between gap-1 sm:justify-start sm:gap-2">
        <Node icon={s.actor} label={s.actorLabel} tone={actorTone} />
        <div className="flex flex-1 items-center pt-5">
          <Link />
        </div>
        <Node
          icon={s.gateOn ? <ShieldCheck className="size-5" strokeWidth={2} /> : <ShieldOff className="size-5" strokeWidth={2} />}
          label={s.gateOn ? "Gate on" : "Gate off"}
          tone={s.gateOn ? GOOD : "rgb(255 255 255 / 0.4)"}
          dim={!s.gateOn}
        />
        <div className="flex flex-1 items-center pt-5">
          <Link blocked={!s.reached} />
        </div>
        <Node
          icon={<Cpu className="size-5" strokeWidth={2} />}
          label="Controller"
          tone={s.deviceTone}
          dim={!s.reached}
        />
      </div>

      <p className="text-sm leading-relaxed text-white/60">{s.sentence}</p>
    </div>
  );
}

/* ---------------- engineer detail (collapsible, native) ---------------- */

function LegBytes({ leg }: { leg: ProofLeg }) {
  return (
    <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4 first:border-0 first:pt-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-white">
          Leg {leg.leg} · {leg.verdict}
        </span>
        <span className="text-xs text-white/40">{leg.destination}</span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <code className="block overflow-x-auto rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-white/70">
          sent&nbsp; {groupHex(leg.sentHex)}
        </code>
        <code className="block overflow-x-auto rounded-lg bg-black/30 px-3 py-2 font-mono text-xs text-white/70">
          recv&nbsp; {groupHex(leg.recvHex)}
        </code>
      </div>
    </div>
  );
}

/* ---------------- main ---------------- */

export function GateProof({ proof }: { proof: ModbusProof | null }) {
  if (!proof) {
    return <EmptyState message="Proof pack not found (Modbus-engine-off-on-proof-pack/)." />;
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Plain-language summary */}
      <Panel>
        <div className="flex flex-col gap-3">
          <p className="text-base leading-relaxed text-white/85">
            We took <span className="font-medium text-white">one real network attack</span> on an
            industrial controller and sent it twice — once with our gate <span className="font-medium text-white">off</span>,
            once with it <span className="font-medium text-white">on</span> — then sent a normal
            command too. Here is exactly what happened each time.
          </p>
          <p className="text-sm leading-relaxed text-white/55">
            The attack: someone sends a malformed control command over the industrial protocol
            (Modbus), trying to write data into a protected spot on the device — the kind of move
            used to tamper with industrial equipment.
          </p>
        </div>
      </Panel>

      {/* The three scenarios, as a story */}
      <div className="flex flex-col gap-4">
        <Scenario kind="off-attack" />
        <Scenario kind="on-attack" />
        <Scenario kind="legit" />
      </div>

      {/* What it means — plain, honest */}
      <Panel title="What this means">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: GOOD }}>
              <Check className="size-4" strokeWidth={3} /> What it shows
            </span>
            <p className="text-sm leading-relaxed text-white/65">
              The gate caught a real attack as it crossed the network and stopped it before the
              device — while still letting normal commands through. It isn&apos;t blocking everything;
              it&apos;s telling good from bad.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-white/60">
              <Info className="size-4" strokeWidth={1.75} /> What it doesn&apos;t
            </span>
            <p className="text-sm leading-relaxed text-white/55">
              This was a controlled test against a practice device in our lab, with one attack and
              one normal command. It&apos;s a real result, not yet a guarantee for every device or
              every attack.
            </p>
          </div>
        </div>
      </Panel>

      {/* Engineer detail — tucked away, kept for verification */}
      <details className="group rounded-2xl bg-white/[0.04] p-6">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-medium text-white/80 marker:hidden">
          Technical detail (raw packets &amp; gate log)
          <ChevronRight className="size-4 text-white/40 transition-transform group-open:rotate-90" strokeWidth={2} />
        </summary>

        <div className="mt-6 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-white/40">Attack</span>
            <span className="text-sm leading-relaxed text-white/70">{proof.attack}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-white/40">Target</span>
            <span className="text-sm leading-relaxed text-white/70">{proof.target}</span>
          </div>

          <div className="flex flex-col gap-4">
            {proof.legs.map((leg) => (
              <LegBytes key={leg.leg} leg={leg} />
            ))}
          </div>

          {proof.gateLog.length > 0 ? (
            <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4">
              <span className="text-xs uppercase tracking-wide text-white/40">
                Gate log (this run highlighted)
              </span>
              {proof.gateLog.map((l, i) => (
                <div
                  key={i}
                  className={`flex flex-col gap-1 rounded-lg px-3 py-2 text-xs sm:flex-row sm:items-center sm:gap-4 ${
                    l.fromRun ? "bg-white/[0.05]" : "opacity-45"
                  }`}
                >
                  <span className="shrink-0 font-mono text-white/50">{l.timestamp.slice(11, 19)} UTC</span>
                  <span className="shrink-0 font-semibold" style={{ color: l.allowed ? "rgb(255 255 255 / 0.6)" : GOOD }}>
                    {l.status}
                  </span>
                  <span className="min-w-0 flex-1 text-white/70">{l.details}</span>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </details>
    </div>
  );
}
