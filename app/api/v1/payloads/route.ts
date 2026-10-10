import { NextResponse } from "next/server";

export async function GET() {
  const defaultUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:8888"
      : "https://api.eternalboundaries.com";
  const engineUrl = process.env.GATE_ENGINE_URL || defaultUrl;

  const token =
    process.env.GATE_ENGINE_TOKEN ||
    process.env.GATE_ENGINE_API_KEY ||
    "EB-COMMAND-CENTER-SECURE-KEY";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    // 1. Primary attempt: /api/v1/payloads
    let res = await fetch(`${engineUrl}/api/v1/payloads`, {
      method: "GET",
      headers: {
        "X-Secure-Ingestion-Token": token,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    // 2. If 404, fallback probe to /api/v1/compliance/mappings
    if (res.status === 404) {
      res = await fetch(`${engineUrl}/api/v1/compliance/mappings`, {
        method: "GET",
        headers: {
          "X-Secure-Ingestion-Token": token,
          Accept: "application/json",
        },
        cache: "no-store",
        signal: controller.signal,
      });
    }

    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json({
        status: "fallback",
        message: `Backend engine responded with status ${res.status}. Serving sample CVE control matrix.`,
        cve_control_matrix: null,
      });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    clearTimeout(timer);
    return NextResponse.json({
      status: "fallback",
      message: "Backend engine connection unavailable. Serving sample CVE control matrix.",
      cve_control_matrix: null,
    });
  }
}
