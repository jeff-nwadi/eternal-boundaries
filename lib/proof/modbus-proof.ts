import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Loads the real Modbus engine-off vs engine-on proof run from the proof pack
 * (Modbus-engine-off-on-proof-pack/). This is a genuine byte-level interception
 * on a LAB dummy Modbus target — not production hardware. The UI carries the
 * pack's own "what this proves / does not prove" caveats verbatim.
 */
export interface ProofLeg {
  leg: number;
  name: string;
  destination: string;
  timeUtc: string | null;
  sentHex: string;
  recvHex: string;
  verdict: string; // FORWARDED | BLOCKED
  note: string;
}

export interface GateLogLine {
  timestamp: string;
  eventType: string;
  details: string;
  allowed: boolean;
  status: string;
  attack: boolean;
  fromRun: boolean;
}

export interface ModbusProof {
  run: string;
  attack: string;
  target: string;
  date: string;
  legs: ProofLeg[];
  gateLog: GateLogLine[];
}

const DIR = path.join(process.cwd(), "Modbus-engine-off-on-proof-pack");

interface RawLeg {
  leg: number;
  name: string;
  destination: string;
  time_utc: string | null;
  sent_hex: string;
  recv_hex: string;
  verdict: string;
  note: string;
}

export async function readModbusProof(): Promise<ModbusProof | null> {
  let resultsRaw: string;
  try {
    resultsRaw = await fs.readFile(path.join(DIR, "results.json"), "utf8");
  } catch {
    return null; // pack absent → UI shows an honest "not available" state
  }

  const parsed = JSON.parse(resultsRaw) as {
    run: string;
    attack: string;
    target: string;
    date: string;
    legs: RawLeg[];
  };

  const legs: ProofLeg[] = parsed.legs.map((l) => ({
    leg: l.leg,
    name: l.name,
    destination: l.destination,
    timeUtc: l.time_utc,
    sentHex: l.sent_hex,
    recvHex: l.recv_hex,
    verdict: l.verdict,
    note: l.note,
  }));

  // Gate log is optional — the view still works without it.
  let gateLog: GateLogLine[] = [];
  try {
    const logRaw = await fs.readFile(path.join(DIR, "gate_log_excerpt.jsonl"), "utf8");
    const runTimes = new Set(legs.map((l) => l.timeUtc).filter(Boolean) as string[]);
    gateLog = logRaw
      .split(/\r?\n/)
      .filter((l) => l.trim().length > 0)
      .map((line) => {
        const o = JSON.parse(line) as {
          timestamp: string;
          event_type: string;
          details: string;
          allowed: boolean;
          status: string;
          attack: boolean;
        };
        return {
          timestamp: o.timestamp,
          eventType: o.event_type,
          details: o.details,
          allowed: o.allowed,
          status: o.status,
          attack: o.attack,
          // From this run if a leg references the exact timestamp.
          fromRun: runTimes.has(o.timestamp),
        };
      });
  } catch {
    gateLog = [];
  }

  return {
    run: parsed.run,
    attack: parsed.attack,
    target: parsed.target,
    date: parsed.date,
    legs,
    gateLog,
  };
}

/** Space the hex into 2-char byte groups for readable display. */
export function groupHex(hex: string): string {
  return (hex.match(/.{1,2}/g) ?? []).join(" ");
}
