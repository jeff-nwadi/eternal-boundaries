/**
 * Standalone connectivity test for the backend engine tunnel (CLAUDE.md §5.2).
 *
 * NOT wired into the app. Run manually to see exactly what the tunnel returns
 * before we trust it or build anything against it.
 *
 *   node --env-file=.env.local scripts/test-gate-engine.mjs
 *   node --env-file=.env.local scripts/test-gate-engine.mjs /some/other/path
 *   node --env-file=.env.local scripts/test-gate-engine.mjs /api/compliance/metrics --no-headers
 *
 * Pass --no-headers to send NO auth headers (a control request to confirm the
 * documented 401-without-headers behavior).
 *
 * Reads GATE_ENGINE_URL, GATE_ENGINE_TENANT_ID, GATE_ENGINE_LICENSE_KEY from the
 * environment (loaded from .env.local). Nothing is hardcoded or committed.
 *
 * NOTE (§5.2): the tunnel is unverified, outside fetches have been robots-blocked
 * before, and it's UNCONFIRMED whether these headers even apply to this Cloudflare
 * tunnel. This script only observes and logs — it changes no state.
 */

const BASE = process.env.GATE_ENGINE_URL;
const TENANT_ID = process.env.GATE_ENGINE_TENANT_ID;
const LICENSE_KEY = process.env.GATE_ENGINE_LICENSE_KEY;

const REQUEST_TIMEOUT_MS = 12_000;
const BODY_PREVIEW_LIMIT = 4000;

// CLI args: any non-flag args are explicit paths to probe. --no-headers sends
// no auth headers (control request). The health path is NOT documented in §5.2
// (only /api/threats/live and /api/compliance/metrics are), so with no explicit
// path we probe a few common health candidates.
const rawArgs = process.argv.slice(2);
const SEND_HEADERS = !rawArgs.includes("--no-headers");
const pathArgs = rawArgs.filter((a) => !a.startsWith("--"));
const PATHS = pathArgs.length
  ? pathArgs
  : ["/health", "/api/health", "/healthz", "/status", "/"];

function fail(msg) {
  console.error(`\n✗ ${msg}\n`);
  process.exit(1);
}

if (!BASE) fail("GATE_ENGINE_URL is not set. Run with: node --env-file=.env.local scripts/test-gate-engine.mjs");
if (SEND_HEADERS && !TENANT_ID) fail("GATE_ENGINE_TENANT_ID is not set (needed for X-Tenant-Id).");
if (SEND_HEADERS && !LICENSE_KEY) fail("GATE_ENGINE_LICENSE_KEY is not set (needed for X-ETBV-License-Key).");

/** Mask a secret for logging — show only enough to confirm it's the right one. */
function mask(secret) {
  if (!secret) return "(unset)";
  if (secret.length <= 8) return "****";
  return `${secret.slice(0, 4)}…${secret.slice(-4)} (len ${secret.length})`;
}

async function probe(path) {
  const url = new URL(path, BASE).toString();
  const headers = { Accept: "application/json, text/plain, */*" };
  if (SEND_HEADERS) {
    headers["X-Tenant-Id"] = TENANT_ID;
    headers["X-ETBV-License-Key"] = LICENSE_KEY;
  }

  console.log("\n" + "─".repeat(72));
  console.log(`GET ${url}`);
  console.log(`Auth headers: ${SEND_HEADERS ? "sent" : "NONE (control request)"}`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const startedAt = Date.now();

  try {
    const res = await fetch(url, {
      method: "GET",
      headers,
      redirect: "follow",
      signal: controller.signal,
    });
    const elapsed = Date.now() - startedAt;

    console.log(`\nStatus:   ${res.status} ${res.statusText}`);
    console.log(`Time:     ${elapsed}ms`);
    console.log(`Final URL:${res.redirected ? " (redirected) " : " "}${res.url}`);

    console.log("\nResponse headers:");
    for (const [k, v] of res.headers.entries()) {
      console.log(`  ${k}: ${v}`);
    }

    const contentType = res.headers.get("content-type") ?? "";
    const raw = await res.text();
    console.log(`\nBody (${raw.length} bytes, content-type: ${contentType || "none"}):`);

    if (contentType.includes("application/json")) {
      try {
        console.log(JSON.stringify(JSON.parse(raw), null, 2).slice(0, BODY_PREVIEW_LIMIT));
      } catch {
        console.log(raw.slice(0, BODY_PREVIEW_LIMIT));
      }
    } else {
      console.log(raw.slice(0, BODY_PREVIEW_LIMIT));
    }
    if (raw.length > BODY_PREVIEW_LIMIT) {
      console.log(`\n… [truncated ${raw.length - BODY_PREVIEW_LIMIT} more bytes]`);
    }

    return { path, ok: res.ok, status: res.status, contentType };
  } catch (err) {
    const elapsed = Date.now() - startedAt;
    const reason =
      err?.name === "AbortError"
        ? `timed out after ${REQUEST_TIMEOUT_MS}ms`
        : `${err?.name ?? "Error"}: ${err?.message ?? err} (cause: ${err?.cause?.code ?? "n/a"})`;
    console.log(`\n✗ Request failed (${elapsed}ms): ${reason}`);
    return { path, ok: false, status: null, error: reason };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  console.log("Backend engine tunnel connectivity test (CLAUDE.md §5.2)");
  console.log("========================================================");
  console.log(`Base URL:        ${BASE}`);
  console.log(`Auth headers:    ${SEND_HEADERS ? "sent" : "NONE (control request)"}`);
  console.log(`X-Tenant-Id:     ${SEND_HEADERS ? TENANT_ID : "(omitted)"}`);
  console.log(`X-ETBV-License-Key: ${SEND_HEADERS ? mask(LICENSE_KEY) : "(omitted)"}`);
  console.log(`Paths to probe:  ${PATHS.join(", ")}`);

  const results = [];
  for (const path of PATHS) {
    results.push(await probe(path));
  }

  console.log("\n" + "═".repeat(72));
  console.log("SUMMARY");
  for (const r of results) {
    const label = r.error
      ? `ERROR (${r.error})`
      : `${r.status}${r.ok ? " OK" : ""}${r.contentType ? ` · ${r.contentType.split(";")[0]}` : ""}`;
    console.log(`  ${r.path.padEnd(18)} → ${label}`);
  }
  console.log("");
}

main();
