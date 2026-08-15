import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
      className={`dark ${geistSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-dvh bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
