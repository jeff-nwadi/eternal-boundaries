/**
 * Static local mock data for the Phase 3 dashboard.
 *
 * These are the sample files received from the backend owner. Per CLAUDE.md §5
 * they carry multiple unresolved content issues (invalid-looking CVE IDs, a
 * non-standard CWE citation, "Termux gateway" in remediation text, no link
 * between the vuln and compliance files, etc.). They are wired here ONLY as
 * static mock data to build the UI against — nothing here is verified or
 * production-ready, and no live backend is connected in this phase.
 */
import stixBundle from "../stix_stream_sample.json";
import vulnScan from "../mock_vuln_scan.json";
import complianceLedger from "../compliance_ledger_live.json";

// ---------------------------------------------------------------------------
// STIX 2.1 threat feed (stix_stream_sample.json)
// ---------------------------------------------------------------------------

export interface StixObject {
  id: string;
  type: string;
  name?: string;
  description?: string;
  created?: string;
  modified?: string;
  threat_actor_types?: string[];
  malware_types?: string[];
  is_family?: boolean;
  relationship_type?: string;
  source_ref?: string;
  target_ref?: string;
}

const stixAll = stixBundle.objects as StixObject[];

/** Threat-intel SDOs (everything that isn't a relationship edge). */
export const stixObjects: StixObject[] = stixAll.filter(
  (o) => o.type !== "relationship"
);

export interface StixEdge {
  id: string;
  type: string; // relationship_type, e.g. "uses" / "exploits"
  sourceRef: string;
  targetRef: string;
}

/** Relationship edges, normalized. */
export const stixEdges: StixEdge[] = stixAll
  .filter((o) => o.type === "relationship")
  .map((o) => ({
    id: o.id,
    type: o.relationship_type ?? "related-to",
    sourceRef: o.source_ref ?? "",
    targetRef: o.target_ref ?? "",
  }));

export const stixById: Record<string, StixObject> = Object.fromEntries(
  stixAll.map((o) => [o.id, o])
);

// ---------------------------------------------------------------------------
// Vulnerability scan (mock_vuln_scan.json)
// ---------------------------------------------------------------------------

export interface VulnFinding {
  cve_id: string;
  vulnerability_name: string;
  severity: string;
  affected_asset: string;
  patch_status: string;
  // ⚠️ Unverified content per CLAUDE.md §5.3 — rendered verbatim from the file,
  // NOT audited/actionable guidance. Do not present as production-ready.
  remediation_guidance: string;
}

export interface VulnSummary {
  total_vulnerabilities: number;
  critical_count: number;
  high_count: number;
  medium_count: number;
  remediated_count: number;
  trend: string;
}

export const vulnSummary = vulnScan.executive_summary as VulnSummary;
export const vulnFindings = vulnScan.scan_results as VulnFinding[];

// ---------------------------------------------------------------------------
// Compliance ledger (compliance_ledger_live.json)
// ---------------------------------------------------------------------------

export interface ControlFamily {
  id: string;
  name: string;
  status: string;
  details: string;
}

export interface ComplianceFramework {
  name: string;
  summary: {
    total_controls_tracked: number;
    covered_count: number;
    open_findings_count: number;
  };
  control_families: ControlFamily[];
}

export const complianceFrameworks =
  complianceLedger.frameworks as ComplianceFramework[];
