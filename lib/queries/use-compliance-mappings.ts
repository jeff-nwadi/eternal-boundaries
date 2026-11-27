import { useQuery } from "@tanstack/react-query";

/**
 * Live compliance contract (verified 2026-11-26 against api.eternalboundaries.com).
 *
 * GET /api/v1/compliance/mappings?tenant_id=<id>  (proxied via /api/gate/compliance-mappings)
 *
 * Real response shape:
 * {
 *   "tenant_id": "tnt_demo",
 *   "total_cves": 2,
 *   "mitigated_count": 2,
 *   "findings": [
 *     { "cve_id", "severity", "asset_target", "gate_status",
 *       "linked_controls": [{ "control_id", "framework", "title", "enforcement" }],
 *       "last_evaluated" }
 *   ]
 * }
 */
export interface ComplianceLinkedControl {
  control_id: string;
  framework: string;
  title: string;
  enforcement: string; // e.g. "enforced" | "monitored"
}

export interface ComplianceFinding {
  cve_id: string;
  severity: string; // e.g. "critical" | "high"
  asset_target: string;
  gate_status: string; // e.g. "blocked" | "mitigated"
  linked_controls: ComplianceLinkedControl[];
  last_evaluated: string;
}

export interface ComplianceMappingsResponse {
  tenant_id: string;
  total_cves: number;
  mitigated_count: number;
  findings: ComplianceFinding[];
}

/**
 * View-model for the control-level table: one row per distinct control, with the
 * CVE/finding detail collapsed away. Field names are kept stable so the table and
 * PDF export consume it unchanged.
 */
export interface ComplianceMapping {
  control_id: string;
  framework_component: string;
  status: string; // enforcement, title-cased ("Enforced" | "Monitored")
  last_assessed: string;
}

function titleCase(value: string): string {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

/**
 * Display label for a control's enforcement. "enforced" = an active Layer-Zero
 * block at the gate (Covered). "monitored" is passive telemetry only, so it is
 * labelled distinctly ("Monitored / Partial") so auditors/CISOs don't read it as
 * active blocking (per backend owner, 2026-11-26).
 */
function enforcementLabel(enforcement: string): string {
  return enforcement.toLowerCase() === "monitored"
    ? "Monitored / Partial"
    : titleCase(enforcement);
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? iso
    : new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(d);
}

/**
 * Flatten findings → distinct control rows. A single control may be referenced by
 * several CVEs; we keep one row per `control_id`, preferring the strongest
 * enforcement ("enforced" wins) and the most recent evaluation timestamp.
 */
export function flattenFindingsToControls(findings: ComplianceFinding[]): ComplianceMapping[] {
  const byControl = new Map<string, { row: ComplianceMapping; ts: number }>();

  for (const finding of findings) {
    const ts = new Date(finding.last_evaluated).getTime();
    for (const control of finding.linked_controls ?? []) {
      const existing = byControl.get(control.control_id);
      const enforced = control.enforcement.toLowerCase() === "enforced";

      if (!existing) {
        byControl.set(control.control_id, {
          ts: Number.isNaN(ts) ? 0 : ts,
          row: {
            control_id: control.control_id,
            framework_component: `${control.framework} — ${control.title}`,
            status: enforcementLabel(control.enforcement),
            last_assessed: fmtDate(finding.last_evaluated),
          },
        });
        continue;
      }

      // Upgrade to "enforced" if any linking finding enforces it.
      if (enforced && existing.row.status.toLowerCase() !== "enforced") {
        existing.row.status = enforcementLabel(control.enforcement);
      }
      // Keep the most recent assessment timestamp.
      if (!Number.isNaN(ts) && ts > existing.ts) {
        existing.ts = ts;
        existing.row.last_assessed = fmtDate(finding.last_evaluated);
      }
    }
  }

  return Array.from(byControl.values())
    .sort((a, b) => b.ts - a.ts)
    .map((entry) => entry.row);
}

export function useComplianceMappings() {
  return useQuery<ComplianceMappingsResponse>({
    queryKey: ["compliance-mappings"],
    queryFn: async () => {
      const res = await fetch("/api/gate/compliance-mappings");
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to fetch compliance mappings (${res.status})`
        );
      }
      return res.json();
    },
    staleTime: 60 * 1000,
  });
}
