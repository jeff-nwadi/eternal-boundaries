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

- **✅ CONFIRMED WORKING END-TO-END (2026-09-18), after extensive debugging.** Both core backend endpoints are verified with real, raw HTTP responses (not just descriptions):

  **`GET https://api.eternalboundaries.com/api/v1/compliance/mappings`**
  - Auth header: `X-Secure-Ingestion-Token: EB-COMMAND-CENTER-SECURE-KEY`
  - Confirmed `200 OK` response shape:
    ```json
    {
      "status": "success",
      "framework": "ETB Layer-Zero Framework",
      "version": "1.0.0",
      "mappings": [
        {"id": "MAP-001", "control_id": "CIS-v8-4.1", "framework_component": "...", "status": "COMPLIANT", "last_assessed": "..."}
      ]
    }
    ```
  - ⚠️ **This shape has NO per-finding CVE linking** — no `cve_id`, no connection to individual vulnerabilities. It reports framework/control-level status only. The original §5.4 gap (linking a specific vulnerability to the specific controls it affects) is **still unresolved** — this endpoint answers "is control X compliant" but not "which vulnerabilities caused control X to be non-compliant." Do not build UI copy that implies per-finding traceability from this endpoint.

  **`POST https://api.eternalboundaries.com/transaction`**
  - Auth header: same as above, `X-Secure-Ingestion-Token: EB-COMMAND-CENTER-SECURE-KEY`
  - Confirmed required body shape (after many incorrect variations tested over time — this is the one that actually works):
    ```json
    {"transaction_id": "TX-999-TEST", "metadata_blob": "test payload data"}
    ```
  - Confirmed `200 OK` response: `{"status":"TRANSACTION_COMPLETE","tracking_id":"..."}`
  - Note: `metadata_blob` is a raw string field, not structured JSON — confirm with backend owner what content format it actually expects for real remediation data before wiring the "Mark as remediated" action to it for real (the test above used placeholder text).

  **Reachability history**: this endpoint went through ~10+ rounds of connectivity failures (DNS issues, wrong ports, security group misconfigurations, Cloudflare Tunnel drops (error 1033) from an unstable `cloudflared` process, a domain-wide redirect rule accidentally catching API paths, and at least 4 different incorrect header names/payload shapes proposed before the ones above were confirmed working). Backend owner has since said the tunnel now runs as a persistent background service — treat this as provisionally more stable than the ad-hoc phone/manual-terminal tunnels from earlier, but continue to independently verify rather than assume stability going forward, given the pattern.

- **Historical/superseded details below, kept for context:**

- `POST http://localhost:8080` — send raw alert JSON; backend converts to a valid STIX 2.1 package and updates graph linkages.
- Live file: `ETB_LayerZero_Framework/stix_stream_live.json`
- Mock/review file: `ETB_LayerZero_Framework/stix_stream_sample.json` (received — see §5.1)
- ⚠️ `localhost:8080` only resolves on whichever machine is running the backend engine.
- **CONFIRMED (2026-08-22):** a `GET /api/threats/live` variant exists but is test-only, used by the backend owner to verify STIX payload structure locally. **Production direction remains push-based POST** as originally specified — don't build a pull/polling loop for the main threat feed.
- **Reachability history (superseded — see AWS migration below):** backend engine previously ran on the backend owner's mobile phone via Termux, causing repeated dead tunnel URLs across three providers (loca.lt → Cloudflare → localhost.run) as the phone's power-saving/carrier behavior killed the connections. Auth headers used with these tunnels: `X-Tenant-Id`, `X-ETBV-License-Key` (test/staging values: `X-Tenant-Id: tenant-stage-941a`, `X-ETBV-License-Key: etbv_live_tst_6f2e8c1b9a3d4f5e6b7c8d9e` — staging only, load from env, never hardcode).

- **✅ AWS migration completed (2026-08-2X) — engine now runs on dedicated infrastructure, not a phone.** Confirmed specs:
  - Instance ID: `i-09544569498b34851`, type `t3.micro`, Ubuntu 26.04, `us-east-2`
  - Public IPv4: `3.17.182.27` / Public DNS: `ec2-3-17-182-27.us-east-2.compute.amazonaws.com`
  - VPC/subnet isolated; **IMDSv2 set to Required** (confirmed, good practice)
  - Security group hardening requested and in progress: remove `0.0.0.0/0` open ingress, restrict SSH (22) to backend owner's IP only, restrict data-streaming ports similarly.
  - **This is a bare IP, not a domain** — the earlier-promised permanent named domain (`api.eternalboundaries.com`) has not been delivered; treat the raw IP as the current working endpoint but expect it may still change. Use an env var (`GATE_ENGINE_URL`), never hardcode.
  - **Not yet confirmed:** whether the `X-Tenant-Id` / `X-ETBV-License-Key` auth headers work against this new AWS endpoint the same way they did against the old tunnels. Test explicitly, don't assume.

- **Current working endpoint (2026-09-05):** `http://eternalboundaries.duckdns.org:8080` — a free DuckDNS subdomain pointed at the AWS instance, explicitly a stopgap until the real `eternalboundaries.com` domain is purchased (backend owner: "until we get our first payment"). A separate message referred to `eternalboundaries.com` as already "permanently anchored" via a DDNS daemon — that claim conflicts with the DuckDNS stopgap explanation and should be treated as not yet real; the DuckDNS subdomain is the actual current endpoint.
  - Port 8080 is IP-allowlisted (confirmed via iptables rule, per backend owner) — our dev machine's public IP needed to be sent to him to be added before requests stop timing out. Confirm allowlisting persists / ask about a process for IP changes if testing from a different network later.
  - ⚠️ Watch for typos in URLs sent by the backend owner — one message said to point at `http://duckdns.org` (the DuckDNS *service's own homepage*) instead of `eternalboundaries.duckdns.org` (our actual subdomain). Confirm exact hostnames before testing, don't assume correction is unnecessary.

- **⚠️ IMPORTANT: `/api/compliance/metrics` response shape does not match what was confirmed earlier — needs resolution before building the Compliance Mapping view against it.** A PDF from the backend owner (2026-09-05) describes this endpoint as returning a generic `metrics[]` array (`stix_id`, `object_type`, `ui_meta.dashboard_view`, `ui_meta.ui_severity`) with **no `cve_id` or `linked_controls` fields** — i.e., no CVE-to-NIST/SOC2 mapping at all. This contradicts the earlier-confirmed sample (§ above) that *did* include real per-finding control linking, which was the fix for the original disconnected-totals problem.
  - Backend owner's explanation: `/api/compliance/metrics` is "strictly a flat presentation layer" for generic dashboard styling: the real `cve_id`/control-mapping data supposedly "remains intact" in a different, not-yet-specified part of the ingestion pipeline.
  - **Do not build the Compliance Mapping view against this generic `metrics[]` shape** — it does not contain the control-linking data the view needs. **Get the actual endpoint/path that returns `cve_id` + `linked_controls` before proceeding** — this was asked, not yet answered as of this doc.
  - This generic `metrics[]` shape, if confirmed accurate, may be useful for the Threat Intelligence feed view instead (its `dashboard_view: "threat-intel"` routing suggests that's its intended purpose) — but confirm this is real, tested data before relying on it for anything.

### 5.2a Admin/invite endpoints on the backend — CONFIRMED unrelated to app auth
- Backend owner has separate `POST /api/admin/invite` and `POST /api/auth/register` routes on his engine. **Confirmed (2026-08-22): these are standalone management hooks for provisioning admin access to the ETBV filtering engine itself — not connected to this app's user accounts in any way.**
- **Do not wire the app's invite/register UI to these endpoints.** Our own BetterAuth + Neon stack (§6a) remains the sole source of truth for app user accounts, roles, and the deny-by-default/admin-attribution rules already built. This was an important point to nail down since the endpoint shapes looked similar enough to cause confusion.

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

### 5.4 Compliance ledger — UPDATED (2026-08-22): live endpoint now includes real per-finding linking

Original static file (`compliance_ledger_live.json`) had no link between individual CVEs and control counts (see original flags below, still valid for that file). **Backend owner has since shipped a new endpoint that appears to resolve this:**

`GET /api/compliance/metrics` (via the tunnel, see §5.2) — sample response received:
```json
{
  "status": "success",
  "timestamp": "2026-08-22T07:05:00Z",
  "summary": { "total_cves_evaluated": 142, "compliant_controls": 12, "non_compliant_controls": 3 },
  "findings": [
    {
      "cve_id": "CVE-2026-34567",
      "severity": "CRITICAL",
      "cvss_score": 9.8,
      "linked_controls": [
        { "control_id": "NIST-SP-800-53-SI-2", "control_name": "Flaw Remediation", "status": "NON_COMPLIANT", "mapping_confidence": "HIGH" },
        { "control_id": "SOC2-CC-7.1", "control_name": "Vulnerability Management", "status": "NON_COMPLIANT", "mapping_confidence": "HIGH" }
      ]
    }
  ]
}
```
This shape has a real link (`findings[].cve_id` → `linked_controls[]`) with a `mapping_confidence` field, which is a meaningfully better design than the earlier disconnected totals — **if it holds up under real testing.**

**⚠️ CVE-2026-12345 severity — RESOLVED (2026-08-22):** confirmed as a copy-paste slip on the backend owner's mock data. Correct value is **MEDIUM** (CVSS ~5.5), matching `mock_vuln_scan.json`. Backend owner is updating the live `/api/compliance/metrics` payload to match. Verify the live response reflects this before building — don't assume the fix has propagated without checking.

**Endpoint relationship — CONFIRMED (2026-08-22):** `mock_vuln_scan.json`-equivalent data (SOC analyst table) and `/api/compliance/metrics` (auditor compliance bars) remain two separate endpoints/tables intentionally, but backend owner states both draw from the same underlying database so CVE data will stay identical across both — no client-side reconciliation should be needed once live. Still worth spot-checking in practice once both are live, given the mismatch that already occurred once.

- Only one real sample response has been seen from `/api/compliance/metrics` beyond the corrected sample. Fetch/verify the actual live endpoint yourself before wiring the Compliance Mapping view to it.

**Original static file flags (still apply to `compliance_ledger_live.json` if used instead of the live endpoint):**
- No linking field between file and `mock_vuln_scan.json`.
- NIST section only lists 2 control families but claims 12 tracked; SOC2 lists 1 but claims 8 tracked.
- `details` fields are descriptive but not independently verifiable.

### 5.5 Remediation action — CONFIRMED architecture (production model)

This section was previously marked unverified. The backend owner has now confirmed the production design below, including a working HMAC verification code sample. Build against this.

**Flow:**
1. Analyst clicks "Mark as remediated" (do not label as "Verified"/"Confirmed" in UI copy — that label is earned by the flow below, not by the click itself) on a finding in the Vulnerabilities/Compliance view.
2. Our backend sends an internal webhook to the client's on-prem engine instance (production deployment runs on the client's own network infrastructure — NOT the backend owner's local Termux dev environment, which is dev/test only).
3. The client's engine instance replays the original exploit/attack pattern against the target asset. If the attempt is intercepted/blocked/logged, the asset is considered verified-isolated for that specific finding.
4. The engine POSTs the result back to our webhook receiver, signed via **HMAC-SHA256** (see below).
5. Our receiver verifies the signature before touching the database. Only on a valid signature does the finding flip to "Covered" and the compliance ledger update.

**Fail-closed — hard requirement, not a nice-to-have:**
- If the client's engine is unreachable, times out, or the webhook fails, the record **must remain "Open."** No code path may flip a finding to "Covered" without a verified signed response.
- UI must show a distinct "Verification Error: Engine Unreachable" state (not the same as "Open" from an un-remediated finding) so analysts can tell the difference between "not yet fixed" and "fix attempted but couldn't be confirmed."

**Latency / UI state:**
- Actual re-scan: <50ms on the engine side. Full round trip (network + DB write + propagation to dashboard): ~1–2 seconds.
- UI must show an active "Verifying Matrix Isolation..." pending state during this window — don't show a static spinner with no label, and don't optimistically flip to "Covered" before confirmation arrives.

**Webhook authentication — HMAC-SHA256, confirmed implementation:**
- Shared secret (`GATE_ENGINE_SECRET`) is provisioned to both the client's engine instance and our backend `.env` at install time.
- Engine concatenates key result fields (e.g. `vulnerability_id + target_asset + verification_status`), computes an HMAC-SHA256 hash using the shared secret, and sends it in the `X-Engine-Signature` header.
- Our API route must recompute the same HMAC over the same fields using our copy of the secret and compare using **`crypto.timingSafeEqual`** — never a plain `===`/`==` comparison, which can leak timing information.
- Reject with `401 Unauthorized` on any mismatch, and do not update any DB state before the signature check passes.
- **Secret rotation:** verify against an array of currently-valid secrets (current + incoming), not a single hardcoded string, so the key can be rotated without downtime. Confirmed reference implementation:

```js
const crypto = require('crypto');

function verifySignatureDualSecret(payload, receivedSignature, secretsArray) {
  const receivedBuffer = Buffer.from(receivedSignature, 'utf8');
  for (const secret of secretsArray) {
    const computedSignature = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    const computedBuffer = Buffer.from(computedSignature, 'utf8');
    if (computedBuffer.length === receivedBuffer.length) {
      if (crypto.timingSafeEqual(computedBuffer, receivedBuffer)) return true;
    }
  }
  return false;
}
```

**Still open / unresolved — do not treat as answered:**
- The "God Mode Root Flaw," "CWE-1000 Track," and general product terminology questions raised earlier have not been answered. Don't let confirmed backend architecture (this section) imply the content-level flags in §5.1/§5.3/§5.4 are resolved — they aren't. Those are a separate issue from this verification flow.

**Signature spec — re-confirmed after a mismatch was caught (2026-08-19):** a later message from the backend owner briefly proposed a different header name (`X-Gate-Engine-Signature`) and a different signing method (hash of the raw minified JSON body) than what's specified above. This was flagged as a breaking inconsistency and the backend owner confirmed reverting to the **original spec above is authoritative**: header `X-Engine-Signature`, signature computed over the concatenated fields (`vulnerability_id + target_asset + verification_status`), not the raw request body. If any future message from the backend side proposes a different header name or signing method again, treat it as a red flag requiring explicit reconciliation before touching the webhook code — do not silently support both.

## 5.6 Active infrastructure mitigation (block-ip / isolate-host / revoke-credentials) — OUT OF SCOPE, do not build

A payload schema for the dashboard to actively command the client's infrastructure was proposed by the backend owner (2026-08-19):
```json
{ "action": "block-ip", "target": "198.51.100.42" }
{ "action": "isolate-host", "target": "host-prod-db-04" }
{ "action": "revoke-credentials", "target": "user-session-token-9981" }
```
This is explicitly **not current scope** and was confirmed as future work by the backend owner after being flagged. This is a fundamentally different and much higher-stakes capability than the remediation-*verification* flow in §5.5 — this would let the dashboard take real, potentially destructive action on a client's live production infrastructure (blocking an IP, quarantining a host, revoking a session).

**Do not build any UI, route, or button toward this schema until all of the following are explicitly designed and agreed, not just assumed:**
- Role-based access control — who is allowed to trigger this (almost certainly `admin` only, not `analyst`/`auditor`)
- A confirmation/multi-factor gate before an action fires (no single-click execution of an infrastructure-mutating action)
- Full audit logging of who triggered what action, on what target, and when
- Clear, non-optimistic UI feedback matching the fail-closed philosophy already established in §5.5

If asked to "add a block-ip button" or similar without this scaffolding having been explicitly discussed first, treat that as scope creep and flag it rather than building it.

**⚠️ Resurfaced (2026-09-20) via `metadata_blob` payload spec — caught and resolved.** Backend owner's proposed `metadata_blob` structure for the `/transaction` remediation endpoint (§5.2) included `remediation_action` values of `isolate-host` and `block-ip` — i.e., the exact out-of-scope capability from above, quietly folded into what was framed as a routine payload detail. Flagged directly; backend owner agreed fully and confirmed:

- **Current phase (Phase 1 UI): simulation only.** The "Mark as remediated" / "Intent to Remediate" button changes a **UI-only status flag** (e.g., `ALERTING` → `PENDING RECOUP`) or appends a simulated event string. **It must NOT trigger any outbound command to real infrastructure.** Build and treat this as frontend-only state for now — no live backend mutation of real client systems, regardless of what `/transaction` accepts on the backend side.
- **Before any real infrastructure action is wired**, the following must be designed and built first (backend owner's own stated roadmap, agreed 2026-09-20):
  - RBAC split: `SecOps-Viewer` (read-only) vs. `SecOps-Admin` (authorized to deploy gates) — note this doesn't map 1:1 to the existing `analyst`/`auditor`/`admin` roles in §6a; reconcile explicitly when this is actually designed, don't assume equivalence.
  - A mandatory double-confirmation modal before any destructive action fires.
  - An immutable, cryptographically-verifiable audit log entry per action (who, what, when) for compliance purposes.
- **Do not build toward real infrastructure mutation until the above is explicitly designed together** — this section's original scope boundary stands; this incident is a confirmation of it holding, not a replacement for it. If a future payload spec, endpoint change, or "quick addition" reintroduces real infrastructure command execution without this safety plane being built first, flag it again the same way.

## 6. Compliance framework mapping reference

- **NIST SP 800-53**, families in scope: `SC-*` (System and Communications Protection — e.g., SC-7 Boundary Protection, SC-8 Transmission Confidentiality, SC-13 Cryptographic Protection, SC-5 DoS Protection) and `SI-*` (System and Information Integrity — e.g., SI-2 Flaw Remediation, SI-4 System Monitoring, SI-7 Software Integrity).
- **SOC 2 Type II**, criteria in scope: `CC6` (Logical and Physical Access Controls) and `CC7` (System Operations — monitoring, incident detection).
- CVE → control mapping logic is currently **hardcoded per mock finding** and not derived from a real rule (e.g. CWE category → control family). This is a known gap — do not present compliance percentages as authoritative until real mapping logic exists. Flag this prominently if asked to build the PDF export feature.

## 6a. Auth & role architecture — decided, do not deviate without re-confirming

- **Access model: invite-only.** No public signup endpoint. Decided specifically because the `auditor` role carries compliance weight and needs a strict audit trail — a public signup path is an unacceptable risk for that role.
- **Rule 1 — deny by default:** the registration/account-creation path must never be able to auto-assign or default a new account to the `auditor` role. If invite-based account creation accepts a role parameter, the code path must reject or ignore an `auditor` value unless the actor issuing the invite is themselves an `admin` performing an explicit, separate promotion action — not part of generic signup logic.
- **Rule 2 — admin attribution:** every invite must be logged in the database with the specific `admin` user ID who issued it. This is a hard schema requirement, not optional metadata — the audit trail depends on being able to answer "who authorized this account" for any user, especially auditors.
- **Roles:** `analyst`, `auditor`, `admin`. Only an `admin` can create invites or promote a user to `auditor`.
- **Future scaling note (not built now):** if invite-only becomes a bottleneck later, the agreed fallback is a **hybrid domain-restricted model** — signup open to approved company domains, but still only ever auto-assigning the lowest `analyst` tier. `auditor` promotion stays a manual admin action even in that future model. Don't build the domain-restricted path now; this is documented so a future implementation doesn't quietly loosen the auditor rule.

## 6b. Multi-tenancy — CONFIRMED (2026-08-23), IMPLEMENTED (2026-08-23)

The Phase 2 auth build (users/roles/invites) was built single-tenant — this must be extended before any real client onboarding. Confirmed architecture:

- **Every `users` and `invites` record requires a mandatory `tenant_id` field.** Not nullable, not optional.
- **Tenant isolation is enforced at the query level:** when a client's own `admin` (e.g. their SOC lead) views the admin panel, all user/invite queries must be scoped to that admin's `tenant_id` — they should never be able to see or affect another tenant's users. This needs to be enforced in the query/data layer, not just hidden in the UI (a client admin hitting the API directly must not be able to fetch another tenant's data).
- **We (the two founders) operate under a separate global/master tenant** (e.g. `system-admin-01` or similar) that is allowed to provision new tenant/client profiles during onboarding, but does **not** have standing access to a client's day-to-day employee invites once their tenant is set up. Don't build us a backdoor "view all tenants' users" capability beyond the explicit tenant-provisioning action — keep our own access scoped the same way any tenant admin's is, aside from the ability to create new tenants.
- **Matches backend engine design:** the engine already scopes its own auth via `X-Tenant-Id` (see §5.2) for telemetry isolation between client organizations — this app's schema needs to align with the same `tenant_id` concept so a future integration (e.g. filtering the STIX feed or compliance data per tenant) isn't fighting two different tenant models.
- **Still to decide when this is actually built:** how `tenant_id` gets assigned to an invite (does the inviting admin's own `tenant_id` just propagate automatically to invites they create — almost certainly yes, but confirm this explicitly when scoping the Claude Code prompt for this change), and whether `auditor` promotion (§6a Rule 1) also needs to be tenant-scoped (an admin should only be able to promote users within their own tenant — near-certainly yes, but make this explicit in the implementation, don't leave it implicit).

**Implementation summary (2026-08-23):** built as specified. New `tenant` table (`id`, `name`, `is_master`); `tenant_id` is `NOT NULL` + FK on both `user` and `invite`. All admin queries scoped via a shared `tenantScopeOf(session)` helper that throws (fails closed) if no tenant is resolvable — not an opt-in check per query. Cross-tenant writes (e.g. promoting a user ID belonging to another tenant) match zero rows rather than silently succeeding or throwing an unclear error. Invite `tenant_id` is pulled server-side from the creating admin's session, never from client input. Only `provisionTenant` (gated by `requireMasterAdmin`) crosses tenant boundaries, and only to create a new tenant + its first invite — no standing cross-tenant read access anywhere else. Migration was hand-adjusted from Drizzle's auto-generated version to safely backfill existing rows into the master tenant before enforcing `NOT NULL`, avoiding data loss on non-empty databases. Seed script and `.env.local.example` updated for `MASTER_TENANT_ID`/`MASTER_TENANT_NAME`.

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

- **"God Mode Root Flaw" / CWE-1000 terminology — RESOLVED (2026-08-23).** Final agreed naming:
  - Vulnerability name: **"LayerZero Injection Flaw"**
  - Classification: **"Internal review, not yet CWE-mapped"** (explicitly does not claim an active external MITRE review process — this was corrected from an earlier draft, "Pending MITRE Structural Review," which implied a specific external process that wasn't actually underway)
  - Use these exact strings in templates/UI going forward. Safe to use in client-facing/demo content.
  - Other renamed object names (confirmed 2026-08-22, no issue with these):
    - Threat actor: "Unidentified Zero-Click Actor Group" → "Advanced Persistent Threat (APT) Group - Out-of-Band Vector"
    - Malware: "God Mode Payload" → "Arbitrary Execution Stream Injection Payload"
    - CVE-2026-99812: "Network Edge Bypass" → "Boundary Verification Bypass"
- **Real STIX/vuln/compliance sample files still contain other unresolved content issues — see §5.1, §5.3.** Do not build production data-mapping logic against flagged fields until resolved.
- CVE-to-control mapping logic has no real link in the received data (§5.4) — needs a resolved field or explanation from the backend owner, not an invented one.
- ~~`/remediate` verification semantics unconfirmed~~ — **RESOLVED, see §5.5.** Production remediation flow is confirmed: on-prem engine replay-verification, fail-closed default, HMAC-SHA256 signed webhook responses with timing-safe comparison and rotation support. Build against §5.5 as specified.
- PDF/report export is a stub — no real generation logic yet.
- AI features (summarization, prioritization, remediation drafting, report narration) have been discussed as a possible future addition but are explicitly **deferred** until the core three views are built and tested. Do not add AI features speculatively.
- Business/legal terms (LLC structure, revenue split, IP reversion) live outside this codebase's concern — don't encode business logic assumptions (e.g. licensing checks) into the frontend without an explicit ask.
- **⚠️ MITRE CWE submission (ES2606-11f89c19) moved to CONSULTATION phase (2026-08-2X) with real, substantive reviewer concerns — do not treat as "on track."** Official MITRE response (verified, forwarded directly): the submission is flagged as **"too attack-focused"** — describing a chain of existing weaknesses rather than a new distinct weakness — and the reviewer explicitly floats the alternative outcome that ETBV may end up represented as *chaining relationships between existing CWE entries* rather than a new CWE at all. Also flagged: the submitted reference link 404s and needs to be made publicly accessible, or the submission is unlikely to progress. **Do not use "pending review" language that implies a routine/on-track status — the actual reviewer feedback is a real, open technical objection.** Submission addressed to "Justin Schomer" — confirm this is the backend owner's legal name.


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