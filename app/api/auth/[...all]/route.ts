import { toNextJsHandler } from "better-auth/next-js";

import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

export async function POST(req: Request) {
  const { pathname } = new URL(req.url);

  // No public sign-up (CLAUDE.md §6a). The HTTP sign-up endpoints are refused;
  // accounts are created only in-process by the invite-redemption action.
  if (pathname.endsWith("/sign-up/email") || pathname.endsWith("/sign-up")) {
    return Response.json(
      { error: "Public sign-up is disabled. An invite is required." },
      { status: 403 }
    );
  }

  return handlers.POST(req);
}
