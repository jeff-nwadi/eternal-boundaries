import fs from 'fs';

const logFile = 'metrics_headers_output.txt';
fs.writeFileSync(logFile, '', 'utf8');

function log(msg) {
  console.log(msg);
  fs.appendFileSync(logFile, msg + '\n', 'utf8');
}

const envContent = fs.readFileSync('.env.local', 'utf8');
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    process.env[key] = val;
  }
}

const BASE = process.env.GATE_ENGINE_URL || 'http://eternalboundaries.duckdns.org';
const TENANT_ID = process.env.GATE_ENGINE_TENANT_ID;
const LICENSE_KEY = process.env.GATE_ENGINE_LICENSE_KEY;

function mask(secret) {
  if (!secret) return "(unset)";
  if (secret.length <= 8) return "****";
  return `${secret.slice(0, 4)}…${secret.slice(-4)} (len ${secret.length})`;
}

log("Backend engine tunnel connectivity test (CLAUDE.md §5.2)");
log("========================================================");
log(`Base URL:           ${BASE}`);
log(`Auth headers:       sent`);
log(`X-Tenant-Id:        ${TENANT_ID}`);
log(`X-ETBV-License-Key: ${mask(LICENSE_KEY)}`);
log(`Paths to probe:     /api/compliance/metrics`);
log("--------------------------------------------------------");
log(`GET ${BASE}/api/compliance/metrics`);
log(`Auth headers: sent`);

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 12000);
const start = Date.now();

try {
  const res = await fetch(`${BASE}/api/compliance/metrics`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'X-Tenant-Id': TENANT_ID,
      'X-ETBV-License-Key': LICENSE_KEY,
    },
    signal: controller.signal,
  });
  clearTimeout(timer);
  const elapsed = Date.now() - start;

  log(`\nStatus:   ${res.status} ${res.statusText}`);
  log(`Time:     ${elapsed}ms`);
  log(`Final URL:${res.redirected ? " (redirected) " : " "}${res.url}`);

  log("\nResponse headers:");
  for (const [k, v] of res.headers.entries()) {
    log(`  ${k}: ${v}`);
  }

  const text = await res.text();
  log(`\nBody (${text.length} bytes):`);
  try {
    log(JSON.stringify(JSON.parse(text), null, 2));
  } catch {
    log(text);
  }
} catch (err) {
  clearTimeout(timer);
  const elapsed = Date.now() - start;
  log(`\n✗ Request failed (${elapsed}ms): ${err.name} - ${err.message}`);
  if (err.cause) {
    log(`Cause: ${JSON.stringify(err.cause)}`);
  }
}

process.exit(0);
