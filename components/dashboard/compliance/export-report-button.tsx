"use client";

import { FileDown } from "lucide-react";
import { toast } from "sonner";

import type { ComplianceFramework } from "@/lib/mock-data";
import type { ComplianceMapping } from "@/lib/queries/use-compliance-mappings";
import { Button } from "@/components/ui/button";

type ExportReportButtonProps = {
  frameworks: ComplianceFramework[];
  mappings: ComplianceMapping[];
  isLive: boolean;
  covered: number;
  total: number;
  sourceLabel: string;
  disabled?: boolean;
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function reportDocument({
  frameworks,
  mappings,
  isLive,
  covered,
  total,
  sourceLabel,
}: ExportReportButtonProps): string {
  const generatedAt = new Intl.DateTimeFormat(undefined, {
    dateStyle: "long",
    timeStyle: "short",
  }).format(new Date());

  const frameworkRows = isLive
    ? `<tr><td>Engine-reported mappings</td><td>${covered} / ${total}</td><td>${total - covered} not marked compliant</td></tr>`
    : frameworks
        .map((framework) => {
          const name = framework.name.startsWith("NIST")
            ? "NIST SP 800-53 (Rev. 5)"
            : "SOC 2 Type II";
          const { covered_count: coveredCount, total_controls_tracked: tracked, open_findings_count: gaps } =
            framework.summary;
          return `<tr><td>${escapeHtml(name)}</td><td>${coveredCount} / ${tracked}</td><td>${gaps} open in sample</td></tr>`;
        })
        .join("");

  const controlRows = isLive
    ? mappings
        .map(
          (mapping) => `<tr><td class="mono">${escapeHtml(mapping.control_id)}</td><td>${escapeHtml(mapping.framework_component)}</td><td>${escapeHtml(mapping.status)}</td><td>${escapeHtml(mapping.last_assessed || "—")}</td></tr>`,
        )
        .join("")
    : frameworks
        .flatMap((framework) =>
          framework.control_families.map(
            (family) => `<tr><td class="mono">${escapeHtml(family.id)}</td><td>${escapeHtml(family.name)}</td><td>${escapeHtml(family.status)}</td><td>${escapeHtml(family.details)}</td></tr>`,
          ),
        )
        .join("");

  const source = escapeHtml(sourceLabel);
  const verificationLabel = isLive
    ? "ENGINE-REPORTED · NOT INDEPENDENTLY VERIFIED"
    : "SAMPLE DATA · NOT AUDITED";

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Eternal Boundaries — Compliance Report</title>
  <style>
    :root { color-scheme: light; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #f5f4f2; color: #201d24; font: 14px/1.5 Arial, sans-serif; }
    .toolbar { position: sticky; top: 0; display: flex; justify-content: center; padding: 14px; background: #201d24; color: #fff; }
    .toolbar button { border: 0; border-radius: 8px; padding: 10px 16px; background: #5b2bd2; color: #fff; font: inherit; font-weight: 700; cursor: pointer; }
    main { max-width: 900px; margin: 32px auto; padding: 48px; background: #fff; border: 1px solid #e4e0dd; }
    .brand { color: #5b2bd2; font-weight: 700; letter-spacing: .04em; font-size: 12px; text-transform: uppercase; }
    h1 { margin: 10px 0 3px; font-size: 28px; letter-spacing: -.03em; }
    h2 { margin: 30px 0 10px; font-size: 16px; }
    .muted { color: #6f6a72; }
    .flag { margin: 22px 0; padding: 11px 14px; border: 1px solid #d8d2dc; background: #f8f7f4; font-size: 11px; font-weight: 700; letter-spacing: .07em; }
    .summary { display: flex; align-items: baseline; gap: 12px; padding: 18px 0; border-top: 1px solid #e4e0dd; border-bottom: 1px solid #e4e0dd; }
    .summary strong { font-size: 30px; letter-spacing: -.04em; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background: #f8f7f4; color: #6f6a72; font-size: 10px; text-align: left; text-transform: uppercase; letter-spacing: .06em; }
    th, td { padding: 10px 9px; border-bottom: 1px solid #e9e6e3; vertical-align: top; }
    .mono { font-family: Consolas, "Courier New", monospace; }
    .note { margin-top: 24px; padding-top: 14px; border-top: 1px solid #e4e0dd; color: #6f6a72; font-size: 11px; }
    @media print {
      @page { size: A4; margin: 16mm; }
      body { background: #fff; font-size: 11px; }
      .toolbar { display: none; }
      main { max-width: none; margin: 0; padding: 0; border: 0; }
      h1 { font-size: 23px; }
      h2 { page-break-after: avoid; }
      tr { page-break-inside: avoid; }
      .flag, th { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="toolbar"><button onclick="window.print()">Print or save as PDF</button></div>
  <main>
    <div class="brand">Eternal Boundaries</div>
    <h1>Compliance mapping report</h1>
    <div class="muted">Generated ${escapeHtml(generatedAt)}</div>
    <div class="flag">${verificationLabel}</div>
    <p><strong>Data source:</strong> ${source}</p>
    <div class="summary"><strong>${covered} / ${total}</strong><span class="muted">${isLive ? "engine-reported mappings marked compliant" : "controls marked covered in the sample ledger"}</span></div>
    <h2>Framework summary</h2>
    <table><thead><tr><th>Framework</th><th>Covered</th><th>Open</th></tr></thead><tbody>${frameworkRows}</tbody></table>
    <h2>${isLive ? "Engine-reported control mappings" : "Control families listed in sample"}</h2>
    <table><thead><tr><th>${isLive ? "Control ID" : "Family"}</th><th>${isLive ? "Framework component" : "Name"}</th><th>Status</th><th>${isLive ? "Last assessed" : "Notes"}</th></tr></thead><tbody>${controlRows || `<tr><td colspan="4">No control records are available.</td></tr>`}</tbody></table>
    <div class="note"><strong>Read carefully:</strong> This report is not an audit opinion, certification, or independent verification. Statuses are sample or engine-reported. The static sample ledger does not link individual vulnerability findings to controls; this report makes no CVE-to-control attribution.</div>
  </main>
</body>
</html>`;
}

export function ExportReportButton(props: ExportReportButtonProps) {
  function exportPdf() {
    const reportWindow = window.open("", "_blank");
    if (!reportWindow) {
      toast.error("Allow pop-ups to open the report, then choose Save as PDF.");
      return;
    }

    reportWindow.opener = null;
    reportWindow.document.open();
    reportWindow.document.write(reportDocument(props));
    reportWindow.document.close();
    reportWindow.focus();
    reportWindow.setTimeout(() => reportWindow.print(), 250);
  }

  return (
    <Button
      variant="default"
      size="lg"
      onClick={exportPdf}
      disabled={props.disabled}
      aria-label="Download compliance report as PDF"
      className="rounded-full px-5"
    >
      <FileDown strokeWidth={1.75} />
      Download PDF
    </Button>
  );
}
