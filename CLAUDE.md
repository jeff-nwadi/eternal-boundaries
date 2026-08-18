# CLAUDE.md — Eternal Boundaries

This file gives Claude Code the full context needed to work on this repo. Read this before making changes. If something here conflicts with what you observe in the codebase, the codebase wins — flag the mismatch instead of silently picking one.

## 1. What this project is

**Eternal Boundaries** is an enterprise Cyber Threat Intelligence & Compliance Dashboard, split across two independently-owned codebases under a shared LLC (Eternal Boundaries LLC, Delaware):

- **Backend engine** (not in this repo, not editable here) — owned by a separate collaborator/entity. A pre-compiled security engine that sits at a network entry point, intercepts traffic, blocks multi-vector exploit chains, and emits STIX 2.1 JSON. We consume its output; we do not build, see, or modify its source.
- **Frontend chassis** (this repo) — what we own outright. A React dashboard that ingests STIX 2.1 threat data + vulnerability scan JSON + compliance ledger JSON and renders it for enterprise security teams (SOC analysts, CISOs, compliance auditors).

**Target users:** Corporate SOC/Blue Team analysts, CISOs, compliance auditors at mid-to-large tech/finance firms, and small municipal utilities (water systems) pursuing federal cybersecurity grants (CISA SLCGP, NSF SBIR, FEMA).

## 2. Repo ownership boundary — important

- This repo (frontend) is 100% owned by us per the LLC agreement; the backend engine is 100% owned by the other party under their holding company.
- **Never assume access to or knowledge of backend implementation details.** Treat the backend purely as a data source with a documented interface (see §5). If the interface is undocumented or ambiguous, stop and ask rather than guessing at backend behavior.
- Do not fabricate or assume compliance/security claims about the backend engine's actual detection capability. Report what the data says; don't editorialize about the engine's effectiveness in UI copy.

## 3. Core views (locked scope for current sprint)

Three views only. Don't add scope beyond these without confirming first.

1. **Threat Intelligence** — live STIX 2.1 indicator feed; click an indicator to see its full relationship chain (threat-actor → malware → attack-pattern → vulnerability → targeted asset), resolved from STIX `relationship` objects. Includes a visual "boundary" divider separating external/untrusted infrastructure from internal/protected assets — this is the project's signature UI motif, not just decoration; keep it when refactoring.
2. **Vulnerabilities** — scan results table (CVE, asset, severity, CVSS, status, remediation guidance) with severity-distribution chart and filters. Every finding must carry human-readable remediation text — this is the entire point of differentiating from a raw data dump. Don't ship a finding without one.
3. **Compliance Mapping** — vulnerability findings rolled up against **NIST SP 800-53** (SC/SI control families) and **SOC 2 Type II** (CC6/CC7 criteria), showing open-vs-covered counts per control, plus a report export action.

## 4. Design system

### Visual reference points (in priority order)
1. **shadcn/ui — Mira template** as the component/layout foundation. Use shadcn primitives (cards, tables, tabs, dialogs, badges) rather than hand-rolling equivalents where Mira already has a pattern for it.
2. **trybloom.ai** as the simplicity/cleanliness bar — sparse, confident, uncluttered SaaS layout with generous whitespace and restrained UI chrome. This is the tone to aim for: not a busy "SIEM tool" look, closer to a modern consumer-grade SaaS product that happens to show security data.
3. **21st.dev** as a component/theme reference library — pull specific patterns (cards, tables, badges) from there when Mira doesn't already cover something, and for polish/motion ideas.

### Tokens
- **Mode:** dark. SOC/security teams monitor 24/7 and dark mode is the category standard — don't flip to light mode without explicit sign-off.
- **Accent color:** `#AFF33E` (lime), from the "Lime Frost" palette. Use for primary actions, active states, brand mark, and the boundary-line motif. Don't use lime for severity-Low — severity Low is teal (`#2DD4BF`) so the two don't collide visually.
- **Severity colors:** Critical `#F0465B`, High `#FF8A3D`, Medium `#F5C244`, Low `#2DD4BF`. These are fixed — don't reassign per-component.
- **Neutrals:** cool/"frost"-leaning dark grays (near `#0A0D10` background, `#11161B`–`#151C22` panels, `#1C242B`–`#28323B` borders), not warm/neutral grays.
- **Headers:** Lucida Sans (`'Lucida Sans', 'Lucida Sans Unicode', 'Lucida Grande', sans-serif`).
- **Body/data:** Geist (loaded from Google Fonts, `system-ui` fallback). Use for all UI copy, table data, and numeric/mono contexts.
- **Density:** high-density data views (compact tables, tight line-height charts, small badges) are correct for this audience — don't over-space things in the name of "clean," that's what trybloom.ai's simplicity should apply to (layout clarity, restrained chrome) not to data density.

### What "simple like trybloom.ai" means here specifically
It does **not** mean stripping out the data density SOC users need. It means: fewer competing UI elements per screen, clear visual hierarchy (one primary action per view), confident whitespace around panels rather than cramming, and restrained use of color (lime reserved for things that matter, not decoration). When in doubt, cut an element rather than add one.

## 5. Data contracts

⚠️ **Update — real sample files have now been received from the backend owner** (`stix_stream_sample.json`, `mock_vuln_scan.json`, `compliance_ledger_live.json`). The shapes below reflect what was actually sent, **not** the earlier assumed shapes. Read the flags in each subsection before wiring any of this — several things in these files don't look like real scanner/threat-intel output and need to be resolved with the backend owner before this data goes anywhere near an auditor or a client.

### 5.1 STIX 2.1 threat feed — received shape

Valid STIX 2.1 bundle structurally (`type`, `id`, `spec_version`, `created`/`modified` timestamps, `threat-actor` / `malware` / `vulnerability` / `relationship` SDOs, `source_ref`/`target_ref` on relationships). Parsing logic built earlier (resolve by object id, walk relationship edges) is compatible with this shape.

**⚠️ Content flags — raise these with the backend owner before treating as real:**
- The single vulnerability in this sample is named **"God Mode Root Flaw (CWE-1000 Track)."** `CWE-1000` is not a specific weakness — it's CWE's top-level "Research Concepts" *view/index*, not something a real scanner would cite as a finding's classification. Ask what the actual CWE (or CVE) is.
- Threat actor is named **"Unidentified Zero-Click Actor Group"** with `threat_actor_types: ["nation-state", "crimeware"]` — "nation-state" and "crimeware" are not both realistic motivations for the same actor in standard threat-intel practice, and "zero-click" is asserted without any technical detail showing how initial access is actually achieved.
- No `infrastructure` or asset objects are present in this sample, so the internal/external boundary-line view (§3, item 1) currently has nothing to render against. Need either real infrastructure objects or a different real signal for internal vs. external assets before that view can be wired to live data.
- Only 2 relationship edges total (`uses`, `exploits`) — no `targets` edge connecting the vulnerability to an actual asset. The relationship-chain view needs that edge type present to be useful.

### 5.2 Live ingestion endpoint

- `POST http://localhost:8080` — send raw alert JSON; backend converts to a valid STIX 2.1 package and updates graph linkages.
- Live file: `ETB_LayerZero_Framework/stix_stream_live.json`
- Mock/review file: `ETB_LayerZero_Framework/stix_stream_sample.json` (received — see §5.1)
- ⚠️ `localhost:8080` only resolves on whichever machine is running the backend engine. This will not work from a different machine or once the app is deployed. Confirm with the backend owner how this gets reached in practice (tunnel, shared network, hosted URL) before building the integration around it.

### 5.3 Vulnerability scan module — received shape

```
{
  "executive_summary": { "total_vulnerabilities", "critical_count", "high_count", "medium_count", "remediated_count", "trend" },
  "scan_results": [
    { "cve_id", "vulnerability_name", "severity", "affected_asset", "patch_status", "remediation_guidance" }
  ]
}
```
File: `ETB_LayerZero_Framework/mock_vuln_scan.json` (received)

**⚠️ Content flags:**
- `cve_id` values are inconsistent in format — `"CVE-2026-ETBV-001"` is not a real CVE ID pattern (real CVE IDs are `CVE-<year>-<number>` only; the `ETBV` segment suggests an internally-invented identifier styled to look like a CVE). The other two (`CVE-2026-99812`, `CVE-2026-12345`) are at least correctly formatted but should be checked against the actual NVD database — a real CVE ID should resolve to a real published entry.
- `remediation_guidance` text is dense with proper-noun-sounding phrases ("LayerZero transaction execution bypass vectors," "Termux gateway," "webhook remediation framework," "boundary protection matrices") that don't read as concrete, actionable steps. Compare to what real remediation guidance looks like (e.g. "upgrade package X to version Y," "close port Z," "rotate credential"). **"Termux gateway" in particular does not belong in enterprise infrastructure guidance — Termux is an Android terminal app.** This needs a real explanation before it goes in front of a client.
- Only 3 findings total in this sample — too small to validate the severity-distribution chart or filtering UI meaningfully; ask for a larger sample once the content issues above are resolved.

### 5.4 Compliance ledger — received shape

```
{
  "frameworks": [
    {
      "name", "summary": { "total_controls_tracked", "covered_count", "open_findings_count" },
      "control_families": [ { "id", "name", "status", "details" } ]
    }
  ]
}
```
File: `ETB_LayerZero_Framework/compliance_ledger_live.json` (received)

**⚠️ Content flags — this is the most important one to resolve before building the Compliance Mapping view against this data:**
- There is **no linking field** between this file and `mock_vuln_scan.json` — no shared CVE ID, control-family reference, or finding ID connects the two. The "1 open finding" claimed under NIST `SI` and the "1 open finding" under SOC2 `CC7.1` cannot currently be traced back to which of the 3 vulnerabilities in the scan file they correspond to.
- The NIST section only lists 2 control families (`SI`, `SC`) but claims `"total_controls_tracked": 12` — the other 10 aren't represented anywhere in the file. Same issue for SOC2: only `CC7.1` is listed but `"total_controls_tracked": 8`.
- `details` fields ("Tracks LayerZero transaction interception boundaries," "Mitigation ledger for edge injection execution pathways") are descriptive-sounding but not verifiable against anything else in the data — they don't cite a specific control requirement or a specific finding.
- **Do not build the real CVE→control mapping logic from this file as-is.** Get the backend owner to either (a) add the missing linking field, or (b) explain how the 12/8 totals and the open-findings counts are actually derived, before treating these numbers as something a compliance team could rely on.

### 5.5 Remediation action — ⚠️ UNVERIFIED, do not treat "covered" as ground truth yet
- `PUT http://localhost:8080/remediate` with `{"vulnerability_name": "..."}` — triggers backend to mark the threat resolved and roll compliance ledgers back toward 100%.
- **Open question, unresolved as of this doc:** does this reflect an actual re-scan/verification, or does it just flip a status flag? Given the disconnect already found between the vuln scan file and the compliance ledger file (§5.4), there's added reason to suspect this may just be a flag flip rather than a real re-verification. Do not label a "Verify Mitigation" button as verified/audited in the UI copy until this is confirmed by the backend owner. Until confirmed, UI copy should say something neutral like "Mark as remediated" rather than implying automatic re-verification.

## 6. Compliance framework mapping reference

- **NIST SP 800-53**, families in scope: `SC-*` (System and Communications Protection — e.g., SC-7 Boundary Protection, SC-8 Transmission Confidentiality, SC-13 Cryptographic Protection, SC-5 DoS Protection) and `SI-*` (System and Information Integrity — e.g., SI-2 Flaw Remediation, SI-4 System Monitoring, SI-7 Software Integrity).
- **SOC 2 Type II**, criteria in scope: `CC6` (Logical and Physical Access Controls) and `CC7` (System Operations — monitoring, incident detection).
- CVE → control mapping logic is currently **hardcoded per mock finding** and not derived from a real rule (e.g. CWE category → control family). This is a known gap — do not present compliance percentages as authoritative until real mapping logic exists. Flag this prominently if asked to build the PDF export feature.

## 6a. Auth & roles (Phase 2)

> Reconstructed from the Phase 2 kickoff instructions — this section was referenced but missing from the file when Phase 2 began. The two rules below are non-negotiable.

- **Roles:** `analyst`, `auditor`, `admin`.
- **No public signup.** Account creation happens only via a valid, unexpired **invite token**. There is no open sign-up endpoint.
- **Rule 1 — deny by default:** the account-creation path (invite redemption) must **never** result in an `auditor` role. If an invite record carries a role field, an `auditor` value is rejected/ignored at that layer. `auditor` promotion is a **separate, explicit admin action**, never settable at invite-creation or redemption time. (Enforced at schema level: the invite role type does not include `auditor`; and clamped again in redemption code.)
- **Rule 2 — admin attribution:** the `invites` table must record the issuing `admin` user ID (**not-null foreign key** to `user.id`), the invite creation timestamp, and redemption status/timestamp — enforced at the **schema level**, not by convention.
- **Future option, NOT current scope:** a domain-restricted signup model (auto-allow signups from a verified corporate email domain) has been discussed as a possible future addition. Do not build it in this phase.

### 6a.1 First-admin bootstrap — the one sanctioned exception

The invite system is a closed loop: accounts come only from invites, and invites can only be issued by an existing admin (schema-enforced not-null FK, `invited_by_admin_id → user.id`). A fresh database therefore has no way to create its first admin from inside the app. The **only** sanctioned exception is a manual seed script, `scripts/seed-admins.ts`, run once by an operator:

```
npm run db:seed-admins -- first.admin@company.com second.admin@company.com
# or set ADMIN_EMAIL_1 / ADMIN_EMAIL_2 in .env.local and run: npm run db:seed-admins
```

It creates the first two admin accounts, prints a generated temporary password for each **once** (never stored in plaintext — only BetterAuth's hash is persisted), and exits.

**Why this is safe and does not weaken "no account creation without an invite":**
- **Not an endpoint.** It is a local CLI script, never wired to any route or handler, so it cannot be triggered by an HTTP request in any environment.
- **One-time.** It checks for an existing admin first and refuses to run if any exists — it can only ever succeed on a fresh database, and never re-seed one that is already set up.
- **Dev/setup only.** It refuses to run under `NODE_ENV=production`.
- **No standing privilege.** After bootstrap, all further accounts (including additional admins) go through the normal admin-issued invite flow. The temporary passwords are meant to be changed on first sign-in.

Do not add any HTTP-exposed variant of this. Adding admins after bootstrap is an invite-flow operation, not a script.

## 7. Tech stack

- **Framework:** Next.js (App Router). Server components for static/summary views where possible; client components for anything interactive (filters, tabs, the relationship-chain drill-down).
- **Database:** Neon (serverless Postgres). Use for persisted vulnerability/compliance history, not just the live JSON feed — the live STIX/vuln/compliance files from the backend are the real-time source, but anything we want to trend over time (open-findings-over-time, remediation SLA tracking) needs to land in Neon rather than being recomputed from a point-in-time JSON snapshot.
  - Use a migration tool (Drizzle ORM recommended for Neon + Next.js — lighter weight than Prisma for this scale) rather than hand-written SQL migrations.
  - Schema should mirror the three data domains: threat intel objects, vulnerability findings, compliance control status — see §5 for shapes to model from.
- **State management — split responsibility, don't conflate the two:**
  - **TanStack Query** for anything that originates from the backend engine or Neon (STIX feed, vuln scan results, compliance ledger, `/remediate` mutations). This is server state — let TanStack Query own caching, refetch-on-interval for the "live feed" feel, and mutation state for remediation actions.
  - **Zustand** for pure client/UI state — active tab, table filters/sort, selected indicator in the relationship view, sidebar/panel open-closed state. Don't put server data in Zustand and don't put transient UI state in TanStack Query's cache.
- **Auth:** BetterAuth. This app has an enterprise/compliance audience — auth is not optional/deferred. Use it to gate the dashboard behind login from the start, and plan for role distinction (analyst vs. auditor/compliance-viewer vs. admin) since compliance-facing exports likely need an audit trail of who viewed/exported what.
- **Security/abuse protection:** Arcjet, applied at minimum to:
  - The Next.js API routes that front the ingestion endpoint and `/remediate` action (rate limiting + bot/abuse detection on write paths).
  - Auth routes (login attempt rate limiting).
  - Note: the backend team's own `fuzz_gateway.py` tests their engine's ingestion port directly — Arcjet is a separate, additional layer protecting *our* Next.js API routes, not a replacement for whatever hardening exists on their side. Don't assume their fuzzing coverage extends to our layer.
- **UI:** shadcn/ui (Mira template) for components, Tailwind for styling, recharts for charts (severity distribution, NIST/SOC2 rollups), lucide-react for icons.
- **Fonts:** Geist (Google Fonts) for body/data, Lucida Sans system stack for headers.

## 8. Open items / things not to assume are decided

- **Real STIX/vuln/compliance sample files have been received but contain multiple unresolved content issues — see §5.1, §5.3, §5.4 for specifics.** Do not build production data-mapping logic against these files until the flagged items (invalid-looking CVE ID, non-standard CWE citation, "Termux gateway" in remediation text, missing link between vuln findings and compliance control counts) are resolved with the backend owner. Safe to use structurally (for wiring up parsers/UI) but not as a source of truth for content shown to real users yet.
- CVE-to-control mapping logic has no real link in the received data (§5.4) — needs a resolved field or explanation from the backend owner, not an invented one.
- `/remediate` verification semantics unconfirmed (§5.5) — treat as a real risk item for compliance-facing accuracy, not a nice-to-have.
- PDF/report export is a stub — no real generation logic yet.
- AI features (summarization, prioritization, remediation drafting, report narration) have been discussed as a possible future addition but are explicitly **deferred** until the core three views are built and tested. Do not add AI features speculatively.
- Business/legal terms (LLC structure, revenue split, IP reversion) live outside this codebase's concern — don't encode business logic assumptions (e.g. licensing checks) into the frontend without an explicit ask.

## 9. Commands

_Fill in exact scripts once package.json is finalized — these are the expected shape for the Next.js + Neon/Drizzle stack:_

```
npm install
npm run dev              # Next.js dev server
npm run build
npm run lint

# Database (Neon + Drizzle)
npm run db:generate      # generate migration from schema changes
npm run db:migrate       # apply migrations to Neon
npm run db:studio        # inspect data locally
```

## 10. Env vars to expect (fill in real values in `.env.local`, never commit them)

```
DATABASE_URL=            # Neon connection string
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
ARCJET_KEY=
NEXT_PUBLIC_APP_URL=
# Backend engine ingestion endpoint (see §5) — this points at the backend
# owner's machine (localhost:8080 on his end), not ours. Confirm with him
# how this actually gets reached from our deployed app (tunnel, shared
# network, hosted endpoint, etc.) before assuming a value here.
```
