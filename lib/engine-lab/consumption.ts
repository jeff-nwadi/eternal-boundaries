import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Reads the boundary-consumption fixtures from the ETBV dashboard-data handoff
 * (consumption_results.csv). These are OFFLINE, analyst-defined contract
 * fixtures — not live parser or vendor behavior (per the bundle's README and
 * each row's own `provenance`). The UI must label them as such.
 */
export interface ConsumptionRow {
  key: string;
  specimenId: string;
  specimen: string;
  sha256: string;
  policyId: string;
  outcome: string;
  N: number;
  window: string;
  committedRange: string;
  committedBytes: number;
  frameCount: number;
  spanKind: string;
  suffix: string;
  suffixBytes: number;
  approvalCoverage: string;
  provenance: string;
}

const DATA_PATH = path.join(
  process.cwd(),
  "etbv-dashboard-data",
  "consumption-boundaries",
  "consumption_results.csv"
);

/** Quote-aware single-line CSV splitter (RFC4180 quoting; no embedded newlines). */
function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

function toInt(v: string | undefined): number {
  const n = Number.parseInt((v ?? "").trim(), 10);
  return Number.isFinite(n) ? n : 0;
}

export async function readConsumptionRows(): Promise<ConsumptionRow[]> {
  let raw: string;
  try {
    raw = await fs.readFile(DATA_PATH, "utf8");
  } catch {
    return []; // file absent → UI shows an honest empty state
  }

  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[0]);
  const col = (name: string) => header.indexOf(name);
  const idx = {
    key: col("key"),
    specimenId: col("specimen_id"),
    specimen: col("specimen"),
    sha256: col("sha256"),
    policyId: col("policy_id"),
    outcome: col("outcome"),
    N: col("N"),
    window: col("window"),
    committedRange: col("committed_range"),
    committedBytes: col("committed_bytes"),
    frameCount: col("frame_count"),
    spanKind: col("span_kind"),
    suffix: col("suffix"),
    suffixBytes: col("suffix_bytes"),
    approvalCoverage: col("approval_coverage"),
    provenance: col("provenance"),
  };

  const rows: ConsumptionRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const f = splitCsvLine(lines[i]);
    rows.push({
      key: f[idx.key] ?? "",
      specimenId: f[idx.specimenId] ?? "",
      specimen: f[idx.specimen] ?? "",
      sha256: f[idx.sha256] ?? "",
      policyId: f[idx.policyId] ?? "",
      outcome: f[idx.outcome] ?? "",
      N: toInt(f[idx.N]),
      window: f[idx.window] ?? "",
      committedRange: f[idx.committedRange] ?? "",
      committedBytes: toInt(f[idx.committedBytes]),
      frameCount: toInt(f[idx.frameCount]),
      spanKind: f[idx.spanKind] ?? "",
      suffix: f[idx.suffix] ?? "",
      suffixBytes: toInt(f[idx.suffixBytes]),
      approvalCoverage: f[idx.approvalCoverage] ?? "",
      provenance: f[idx.provenance] ?? "",
    });
  }
  return rows;
}
