"use client";

import { usePathname } from "next/navigation";

import { Footer } from "@/components/landing/footer";

// Route prefixes that make up the authenticated app / auth flow. The marketing
// footer is for public pages only — it should never render inside these.
const APP_PREFIXES = ["/dashboard", "/admin", "/login", "/invite", "/suspended"];

/**
 * Renders the shared marketing footer on public pages only. Keeps it off the
 * dashboard, admin panel, and auth screens without each of those having to opt
 * out individually.
 */
export function FooterGate() {
  const pathname = usePathname();
  const inApp = APP_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (inApp) return null;
  return <Footer />;
}
