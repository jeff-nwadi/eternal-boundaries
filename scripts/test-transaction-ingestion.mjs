import fs from 'fs';

let logBuffer = '';
function log(msg) {
  console.log(msg);
  logBuffer += msg + '\n';
}

// Manually parse .env.local to avoid Node environment loading discrepancies
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

const BASE_URL = env.GATE_ENGINE_URL || 'http://eternalboundaries.duckdns.org';
const API_KEY = env.GATE_ENGINE_API_KEY;

if (!API_KEY) {
  log("ERROR: GATE_ENGINE_API_KEY is missing from .env.local");
  fs.writeFileSync('transaction_test_output.txt', logBuffer, 'utf8');
  process.exit(1);
}

const targetUrl = new URL('/transaction', BASE_URL).toString();
const payload = {
  transaction_id: "TX-TEST-RUN-01",
  metadata_blob: "Staging validation data block",
  cve_id: "CVE-2026-XXXX",
  linked_controls: ["NIST-800-53", "SOC2-CC-6.1"]
};

log("Raw Ingestion Endpoint Test (POST /transaction)");
log("=================================================");
log(`Target URL: ${targetUrl}`);
log(`X-API-Key:  ${API_KEY ? API_KEY.slice(0, 4) + '...' + API_KEY.slice(-4) : '(unset)'}`);
log("Payload:");
log(JSON.stringify(payload, null, 2));
log("-------------------------------------------------");

async function testTransactionIngestion() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  const start = Date.now();

  try {
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain, */*',
        'X-API-Key': API_KEY,
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timer);
    const elapsed = Date.now() - start;

    log(`\nResponse Status: ${res.status} ${res.statusText} (${elapsed}ms)`);
    log("Response Headers:");
    for (const [k, v] of res.headers.entries()) {
      log(`  ${k}: ${v}`);
    }

    const text = await res.text();
    log(`\nResponse Body (${text.length} bytes):`);
    try {
      const json = JSON.parse(text);
      log(JSON.stringify(json, null, 2));
    } catch {
      log(text);
    }
  } catch (err) {
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    log(`\nRequest FAILED (${elapsed}ms): ${err.name} - ${err.message}`);
    if (err.cause) {
      log(`Cause: ${JSON.stringify(err.cause)}`);
    }
  } finally {
    fs.writeFileSync('transaction_test_output.txt', logBuffer, 'utf8');
  }
}

testTransactionIngestion().then(() => process.exit(0));
