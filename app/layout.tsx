import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans, DM_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";

const dmSans = DM_Sans({subsets:['latin'],variable:'--font-sans'});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
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
      className={cn("dark", "h-full", "antialiased", bricolage.variable, plusJakarta.variable, "font-sans", dmSans.variable)}
      suppressHydrationWarning
    >
      <body
        className="min-h-dvh bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </body>
    </html>
  );
}
