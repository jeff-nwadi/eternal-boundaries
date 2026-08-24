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
- ⚠️ `localhost:8080` only resolves on whichever machine is running the backend engine.
- **CONFIRMED (2026-08-22):** a `GET /api/threats/live` variant exists but is test-only, used by the backend owner to verify STIX payload structure locally. **Production direction remains push-based POST** as originally specified — don't build a pull/polling loop for the main threat feed.
- **Reachability — CONFIRMED, tunnel now live:** backend owner has exposed a public tunnel at `https://eternal-boundaries-419.loca.lt`, claimed to route all engine endpoints (health, threat stream, admin invite, compliance metrics). Per backend owner, every route requires two headers or returns 401:
  - `X-Tenant-Id`
  - `X-ETBV-License-Key`
  - Test/staging values received: `X-Tenant-Id: tenant-stage-941a`, `X-ETBV-License-Key: etbv_live_tst_6f2e8c1b9a3d4f5e6b7c8d9e`. Treat as staging-only; do not hardcode in source, load from env, and confirm with backend owner before assuming these work in any deployed environment.
  - **Not yet independently verified.** Automated fetch attempts against this tunnel from outside tooling are blocked (robots-disallowed response) — this must be tested manually (curl/Postman/actual app) before being trusted as working.

- **⚠️ NEW tunnel URL received (2026-08-23), unverified, do not treat as replacing the above without confirming:** `https://cent-plots-threats-tender.trycloudflare.com` — a Cloudflare Tunnel (different provider than the `loca.lt` one above, no explanation given for the switch). Backend owner asked to wire this into the frontend directly.
  - **Unconfirmed whether the `X-Tenant-Id` / `X-ETBV-License-Key` headers still apply to this endpoint** — do not assume; confirm explicitly before building against it.
  - Same as the `loca.lt` tunnel: not independently verified from outside tooling. Test manually before trusting.
  - Do not remove any "sample data" UI disclaimers on the basis of this tunnel going live. Disclaimer removal is gated on the still-open items in §8 (CWE-1000 terminology, confirmation that the CVE-2026-12345 fix has actually propagated to the live endpoint), not on connectivity alone.

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

## 6b. Multi-tenancy — CONFIRMED (2026-08-23), schema change required, supersedes single-tenant Phase 2 build

The Phase 2 auth build (users/roles/invites) was built single-tenant — this must be extended before any real client onboarding. Confirmed architecture:

- **Every `users` and `invites` record requires a mandatory `tenant_id` field.** Not nullable, not optional.
- **Tenant isolation is enforced at the query level:** when a client's own `admin` (e.g. their SOC lead) views the admin panel, all user/invite queries must be scoped to that admin's `tenant_id` — they should never be able to see or affect another tenant's users. This needs to be enforced in the query/data layer, not just hidden in the UI (a client admin hitting the API directly must not be able to fetch another tenant's data).
- **We (the two founders) operate under a separate global/master tenant** (e.g. `system-admin-01` or similar) that is allowed to provision new tenant/client profiles during onboarding, but does **not** have standing access to a client's day-to-day employee invites once their tenant is set up. Don't build us a backdoor "view all tenants' users" capability beyond the explicit tenant-provisioning action — keep our own access scoped the same way any tenant admin's is, aside from the ability to create new tenants.
- **Matches backend engine design:** the engine already scopes its own auth via `X-Tenant-Id` (see §5.2) for telemetry isolation between client organizations — this app's schema needs to align with the same `tenant_id` concept so a future integration (e.g. filtering the STIX feed or compliance data per tenant) isn't fighting two different tenant models.
- **Still to decide when this is actually built:** how `tenant_id` gets assigned to an invite (does the inviting admin's own `tenant_id` just propagate automatically to invites they create — almost certainly yes, but confirm this explicitly when scoping the Claude Code prompt for this change), and whether `auditor` promotion (§6a Rule 1) also needs to be tenant-scoped (an admin should only be able to promote users within their own tenant — near-certainly yes, but make this explicit in the implementation, don't leave it implicit).

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
