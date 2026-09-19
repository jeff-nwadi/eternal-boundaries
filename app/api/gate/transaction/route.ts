import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const engineUrl = process.env.GATE_ENGINE_URL || "https://api.eternalboundaries.com";
  const token =
    process.env.GATE_ENGINE_TOKEN ||
    process.env.GATE_ENGINE_API_KEY ||
    "EB-COMMAND-CENTER-SECURE-KEY";

  try {
    const body = await request.json();
    const { transaction_id, metadata_blob } = body;

    if (!transaction_id) {
      return NextResponse.json(
        { status: "error", message: "transaction_id is required" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 10000);

    const res = await fetch(`${engineUrl}/transaction`, {
      method: "POST",
      headers: {
        "X-Secure-Ingestion-Token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_id,
        metadata_blob: metadata_blob || "remediation action payload",
      }),
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!res.ok) {
      return NextResponse.json(
        {
          status: "error",
          message: `Engine responded with status ${res.status}`,
        },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      {
        status: "error",
        message: isTimeout
          ? "Engine transaction connection timed out."
          : "Failed to send transaction to engine.",
      },
      { status: 504 }
    );
  }
}
