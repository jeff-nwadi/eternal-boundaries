import fs from 'fs';

let logBuffer = '';
function log(msg) {
  console.log(msg);
  logBuffer += msg + '\n';
}

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (const line of envContent.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx > 0) {
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    env[key] = val;
  }
}

const BASE = env.GATE_ENGINE_URL || 'http://eternalboundaries.duckdns.org:8080';
const TENANT_ID = env.GATE_ENGINE_TENANT_ID;
const LICENSE_KEY = env.GATE_ENGINE_LICENSE_KEY;

async function testOne(sendHeaders) {
  const path = '/api/compliance/metrics';
  const url = new URL(path, BASE).toString();
  log(`\n==================================================`);
  log(`Testing: ${url}`);
  log(`Headers: ${sendHeaders ? 'WITH AUTH HEADERS' : 'NO HEADERS (CONTROL)'}`);
  if (sendHeaders) {
    log(`X-Tenant-Id: ${TENANT_ID}`);
    log(`X-ETBV-License-Key: ${LICENSE_KEY}`);
  }

  const headers = { Accept: 'application/json, text/plain, */*' };
  if (sendHeaders) {
    headers['X-Tenant-Id'] = TENANT_ID;
    headers['X-ETBV-License-Key'] = LICENSE_KEY;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  const start = Date.now();

  try {
    const res = await fetch(url, { method: 'GET', headers, signal: controller.signal });
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    log(`Status: ${res.status} ${res.statusText} (${elapsed}ms)`);
    log('Response Headers:');
    for (const [k, v] of res.headers.entries()) {
      log(`  ${k}: ${v}`);
    }
    const text = await res.text();
    log(`Body (${text.length} bytes):`);
    try {
      log(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      log(text);
    }
    return { ok: res.ok, status: res.status, text };
  } catch (err) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    log(`FAILED (${elapsed}ms): ${err.name} - ${err.message}`);
    if (err.cause) log(`Cause: ${JSON.stringify(err.cause)}`);
    return { ok: false, error: err.message };
  }
}

async function run() {
  log("Backend engine tunnel connectivity test (CLAUDE.md §5.2)");
  log("========================================================");
  log("--- RUN 1: WITH HEADERS ---");
  await testOne(true);
  log("\n--- RUN 2: NO HEADERS (CONTROL) ---");
  await testOne(false);
  fs.writeFileSync('test_output.txt', logBuffer, 'utf8');
  process.exit(0);
}

run();
