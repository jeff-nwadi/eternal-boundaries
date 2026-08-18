import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

/**
 * First-layer gate for authenticated areas (Next 16 "proxy" convention). This
 * only checks for the presence of a session cookie (cheap, edge-safe) — the
 * authoritative session + role validation happens in the server components via
 * requireAuth / requireAdmin.
 */
export function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
