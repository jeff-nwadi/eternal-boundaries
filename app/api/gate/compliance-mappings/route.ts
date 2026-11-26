import { NextResponse } from "next/server";

/**
 * Server-side proxy to the backend compliance engine.
 *
 * Contract (confirmed 2026-11-26, verified live against api.eternalboundaries.com):
 *   GET https://api.eternalboundaries.com/api/v1/compliance/mappings?tenant_id=<id>
 *   Header: X-API-Token: <scoped token>
 *   401 {"detail":"Not authenticated"}          -> token missing
 *   403 {"detail":"DROP: INVALID_API_TOKEN"}    -> token invalid
 *   403 {"detail":"DROP: TENANT_SCOPE_MISMATCH"}-> token not scoped to tenant_id
 *
 * All values come from env — never hardcode the token. The token is scoped to a
 * tenant, so GATE_ENGINE_TENANT_ID must match the tenant the token was minted for
 * (sandbox: tnt_demo).
 */
export async function GET() {
  const engineUrl = process.env.GATE_ENGINE_URL || "https://api.eternalboundaries.com";
  const tenantId = process.env.GATE_ENGINE_TENANT_ID;
  const token =
    process.env.GATE_ENGINE_API_TOKEN ||
    process.env.GATE_ENGINE_TOKEN ||
    process.env.GATE_ENGINE_API_KEY;

  if (!token) {
    return NextResponse.json(
      { status: "error", message: "Compliance engine token is not configured." },
      { status: 503 }
    );
  }
  if (!tenantId) {
    return NextResponse.json(
      { status: "error", message: "Compliance engine tenant id is not configured." },
      { status: 503 }
    );
  }

  const url = new URL(`${engineUrl}/api/v1/compliance/mappings`);
  url.searchParams.set("tenant_id", tenantId);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-Token": token,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      const body: unknown = await res.json().catch(() => null);
      const detail =
        body && typeof body === "object" && "detail" in body
          ? String((body as Record<string, unknown>).detail)
          : undefined;

      const message =
        res.status === 401
          ? "Compliance engine rejected the request: token missing."
          : detail === "DROP: INVALID_API_TOKEN"
            ? "Compliance engine rejected the token (invalid)."
            : detail === "DROP: TENANT_SCOPE_MISMATCH"
              ? "Compliance token is not scoped to this tenant."
              : `Backend engine responded with status ${res.status}.`;

      return NextResponse.json({ status: "error", message }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    clearTimeout(timer);
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        status: "error",
        message: isTimeout
          ? "Backend engine connection timed out."
          : "Failed to connect to backend engine.",
      },
      { status: 504 }
    );
  }
}
