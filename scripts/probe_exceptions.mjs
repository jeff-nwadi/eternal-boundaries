import fs from 'fs';

const TENANT_ID = 'tenant-stage-941a';
const LICENSE_KEY = 'etbv_live_tst_6f2e8c1b9a3d4f5e6b7c8d9e';
const API_KEY = 'EB-COMMAND-CENTER-SECURE-KEY';

async function runProbe(name, url, method, headers, body) {
  console.log(`\n==================================================`);
  console.log(`PROBE: ${name}`);
  console.log(`==================================================`);
  console.log(`${method} ${url}`);
  console.log(`Headers:`, JSON.stringify(headers, null, 2));
  if (body) {
    console.log(`Body:`, JSON.stringify(body, null, 2));
  }

  // First check with redirect: 'manual' to see if 301/302 occurs
  try {
    const resManual = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'manual',
      signal: AbortSignal.timeout(8000)
    });
    console.log(`\n[Manual Redirect Check] Status: ${resManual.status} ${resManual.statusText}`);
    console.log(`[Manual Redirect Check] Location Header: ${resManual.headers.get('location') || '(none)'}`);
    console.log(`[Manual Redirect Check] All Headers:`);
    for (const [k, v] of resManual.headers.entries()) {
      console.log(`  ${k}: ${v}`);
    }
  } catch (e) {
    console.log(`\n[Manual Redirect Check] Error: ${e.message}`);
  }

  // Next check with default redirect handling to see final response
  try {
    const start = Date.now();
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'follow',
      signal: AbortSignal.timeout(8000)
    });
    const elapsed = Date.now() - start;
    const text = await res.text();

    console.log(`\n[Follow Redirect Result] Status: ${res.status} ${res.statusText} (${elapsed}ms)`);
    console.log(`[Follow Redirect Result] Final URL: ${res.url}`);
    console.log(`[Follow Redirect Result] Redirected: ${res.redirected}`);
    console.log(`[Follow Redirect Result] Response Headers:`);
    for (const [k, v] of res.headers.entries()) {
      console.log(`  ${k}: ${v}`);
    }
    console.log(`\n[Follow Redirect Result] Response Body (${text.length} bytes):`);
    try {
      console.log(JSON.stringify(JSON.parse(text), null, 2));
    } catch {
      console.log(text);
    }
  } catch (e) {
    console.log(`\n[Follow Redirect Result] Error: ${e.message}`);
  }
}

async function main() {
  // Probe 1: GET /api/v1/compliance/mappings (with-headers)
  await runProbe(
    "1. GET /api/v1/compliance/mappings (WITH Auth Headers)",
    "https://api.eternalboundaries.com/api/v1/compliance/mappings",
    "GET",
    {
      "Accept": "application/json, text/plain, */*",
      "X-Tenant-Id": TENANT_ID,
      "X-ETBV-License-Key": LICENSE_KEY
    }
  );

  // Probe 2: GET /api/v1/compliance/mappings (--no-headers)
  await runProbe(
    "2. GET /api/v1/compliance/mappings (WITHOUT Auth Headers)",
    "https://api.eternalboundaries.com/api/v1/compliance/mappings",
    "GET",
    {
      "Accept": "application/json, text/plain, */*"
    }
  );

  // Probe 3: POST /transaction (with transaction_packet wrapper)
  await runProbe(
    "3. POST /transaction (WITH transaction_packet wrapper)",
    "https://api.eternalboundaries.com/transaction",
    "POST",
    {
      "Content-Type": "application/json",
      "Accept": "application/json, text/plain, */*",
      "X-API-Key": API_KEY,
      "X-Tenant-Id": TENANT_ID,
      "X-ETBV-License-Key": LICENSE_KEY
    },
    {
      "transaction_packet": {
        "transaction_id": "TX-TEST-RUN-01",
        "metadata_blob": "Staging validation data block",
        "cve_id": "CVE-2026-XXXX",
        "linked_controls": ["NIST-800-53", "SOC2-CC-6.1"]
      }
    }
  );
}

main();
