/**
 * Plain-language explanations for the NIST SP 800-53 and SOC 2 controls in
 * scope (CLAUDE.md §6). `name` is the formal control name; `plain` is a
 * one-line, non-technical explanation shown next to / on hover of each ID
 * (so a reader never sees a bare "SI-4"). Falls back to the ledger's own name
 * for anything not listed.
 */
export const controlReference: Record<string, { name: string; plain: string }> = {
  // NIST SP 800-53 families
  SI: {
    name: "System and Information Integrity",
    plain: "Checks your systems are actively watched and quickly patched when problems appear.",
  },
  SC: {
    name: "System and Communications Protection",
    plain: "Keeps outside networks from reaching your internal systems, and protects data in transit.",
  },
  "SI-2": { name: "Flaw Remediation", plain: "Checks that known security flaws get patched." },
  "SI-4": { name: "System Monitoring", plain: "Checks your systems are being actively watched for problems." },
  "SI-7": {
    name: "Software, Firmware, and Information Integrity",
    plain: "Checks that software and data haven't been tampered with.",
  },
  "SC-5": {
    name: "Denial-of-Service Protection",
    plain: "Guards against attacks that try to knock services offline.",
  },
  "SC-7": { name: "Boundary Protection", plain: "Keeps outside networks from reaching your internal ones." },
  "SC-8": {
    name: "Transmission Confidentiality and Integrity",
    plain: "Protects data while it travels between systems.",
  },
  "SC-13": { name: "Cryptographic Protection", plain: "Checks that sensitive data is properly encrypted." },
  // SOC 2 Trust Services Criteria
  CC6: {
    name: "Logical and Physical Access Controls (SOC 2)",
    plain: "Controls who can get into your systems and buildings.",
  },
  CC7: {
    name: "System Operations (SOC 2)",
    plain: "Keeps day-to-day operations monitored and incidents caught early.",
  },
  "CC7.1": {
    name: "System Operations & Vulnerability Management",
    plain: "Watches for new weak spots and unexpected changes to your systems.",
  },
};

export function controlInfo(
  id: string,
  fallbackName: string
): { name: string; plain: string } {
  return controlReference[id] ?? { name: fallbackName, plain: fallbackName };
}
