import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

/** Returns the current session (or null) without redirecting. */
export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** Requires any authenticated user; otherwise redirects to /login. */
export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session;
}

/** Requires an `admin`; unauthenticated → /login, non-admin → /dashboard. */
export async function requireAdmin() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");
  return session;
}
