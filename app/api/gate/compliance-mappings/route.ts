import { NextResponse } from "next/server";

export async function GET() {
  const engineUrl = process.env.GATE_ENGINE_URL || "https://api.eternalboundaries.com";
  const token =
    process.env.GATE_ENGINE_TOKEN ||
    process.env.GATE_ENGINE_API_KEY ||
    "EB-COMMAND-CENTER-SECURE-KEY";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(`${engineUrl}/api/v1/compliance/mappings`, {
      method: "GET",
      headers: {
        "X-Secure-Ingestion-Token": token,
        "Accept": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: `Backend engine responded with status ${res.status}`,
        },
        { status: res.status }
      );
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
