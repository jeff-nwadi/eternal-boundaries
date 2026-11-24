import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/landing/footer";

// Self-hosted local fonts (no web fetch) — the variable files cover every weight.
// Inter drives all body/UI text; Bricolage Grotesque drives headings.
const inter = localFont({
  src: [
    { path: "./fonts/Inter-Variable.ttf", style: "normal", weight: "100 900" },
    { path: "./fonts/Inter-Italic-Variable.ttf", style: "italic", weight: "100 900" },
  ],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = localFont({
  src: "./fonts/BricolageGrotesque-Variable.ttf",
  variable: "--font-bricolage",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eternal Boundaries — Threat Intelligence & Compliance",
    template: "%s · Eternal Boundaries",
  },
  description:
    "Enterprise cyber threat intelligence and compliance dashboard. Turn STIX threat feeds, vulnerability scans, and control coverage into decisions your SOC and auditors can act on.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", bricolage.variable, inter.variable, "font-sans")}
      suppressHydrationWarning
    >
      <body
        className="min-h-dvh bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
