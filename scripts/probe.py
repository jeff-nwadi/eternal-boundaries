import http.client
import json
import ssl
import sys

def log(msg):
    print(msg, flush=True)
    with open("probe_output.txt", "a", encoding="utf-8") as f:
        f.write(msg + "\n")

def run_probe(name, method, path, headers, body=None):
    log("=" * 60)
    log(f"PROBE: {name}")
    log("=" * 60)
    log(f"{method} https://api.eternalboundaries.com{path}")
    log(f"Headers: {json.dumps(headers, indent=2)}")
    if body:
        log(f"Body: {json.dumps(body, indent=2)}")
    log("-" * 60)

    context = ssl.create_default_context()
    conn = http.client.HTTPSConnection("api.eternalboundaries.com", 443, context=context, timeout=10)

    encoded_body = json.dumps(body).encode('utf-8') if body else None

    try:
        conn.request(method, path, body=encoded_body, headers=headers)
        res = conn.getresponse()

        log(f"Response Status: {res.status} {res.reason}")
        log("Response Headers:")
        for k, v in res.getheaders():
            log(f"  {k}: {v}")

        raw_data = res.read()
        log(f"\nResponse Body ({len(raw_data)} bytes):")
        try:
            parsed = json.loads(raw_data.decode('utf-8'))
            log(json.dumps(parsed, indent=2))
        except Exception:
            log(raw_data.decode('utf-8', errors='replace'))
    except Exception as e:
        log(f"ERROR: {type(e).__name__} - {e}")
    finally:
        conn.close()
    log("\n")

if __name__ == "__main__":
    with open("probe_output.txt", "w", encoding="utf-8") as f:
        f.write("") # Clear log file

    # Probe 1: GET /api/v1/compliance/mappings (with-headers)
    run_probe(
        "1. GET https://api.eternalboundaries.com/api/v1/compliance/mappings (with-headers)",
        "GET",
        "/api/v1/compliance/mappings",
        {
            "Accept": "application/json, text/plain, */*",
            "X-Tenant-Id": "tenant-stage-941a",
            "X-ETBV-License-Key": "etbv_live_tst_6f2e8c1b9a3d4f5e6b7c8d9e",
            "User-Agent": "curl/7.68.0"
        }
    )

    # Probe 2: GET /api/v1/compliance/mappings (--no-headers)
    run_probe(
        "2. GET https://api.eternalboundaries.com/api/v1/compliance/mappings (--no-headers)",
        "GET",
        "/api/v1/compliance/mappings",
        {
            "Accept": "application/json, text/plain, */*",
            "User-Agent": "curl/7.68.0"
        }
    )

    # Probe 3: POST /transaction (transaction_packet wrapper)
    run_probe(
        "3. POST https://api.eternalboundaries.com/transaction (transaction_packet wrapper)",
        "POST",
        "/transaction",
        {
            "Content-Type": "application/json",
            "Accept": "application/json, text/plain, */*",
            "X-API-Key": "EB-COMMAND-CENTER-SECURE-KEY",
            "X-Tenant-Id": "tenant-stage-941a",
            "X-ETBV-License-Key": "etbv_live_tst_6f2e8c1b9a3d4f5e6b7c8d9e",
            "User-Agent": "curl/7.68.0"
        },
        {
            "transaction_packet": {
                "transaction_id": "TX-TEST-RUN-01",
                "metadata_blob": "Staging validation data block",
                "cve_id": "CVE-2026-XXXX",
                "linked_controls": ["NIST-800-53", "SOC2-CC-6.1"]
            }
        }
    )
