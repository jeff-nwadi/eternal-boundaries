/**
 * Marketing site content model (single source of truth for landing copy).
 *
 * Honesty flags, do not remove without a real source:
 *  - PRICING values are PLACEHOLDERS, not finalized.
 *  - TESTIMONIALS is intentionally empty. Do not fabricate quotes or logos.
 *  - Product stats are descriptive facts about the product, not usage metrics.
 */

import type { LucideIcon } from "lucide-react";
import {
  Radar,
  ShieldAlert,
  ClipboardCheck,
  Waypoints,
  ListChecks,
  FileDown,
  Lock,
  Users,
  Boxes,
  ShieldCheck,
  History,
} from "lucide-react";

export const SITE = {
  name: "Eternal Boundaries",
  // Chosen default tagline. Swap for any of the alternates discussed.
  tagline: "Know what crossed the line.",
  subtitle:
    "Threat intelligence, vulnerabilities, and compliance in one console. See what is exposed, fix what matters, and prove it to auditors.",
};

export const NAV_LINKS = [
  { label: "Platform", href: "#platform" },
  { label: "Compliance", href: "#compliance" },
  { label: "Security", href: "#security" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/** Honest descriptive stats, not usage/customer metrics. */
export const STATS: { value: string; label: string }[] = [
  { value: "3", label: "Views in one console" },
  { value: "2", label: "Frameworks mapped (NIST, SOC 2)" },
  { value: "STIX 2.1", label: "Native threat format" },
];

/** The three real product views. */
export const PRODUCT_VIEWS: {
  name: string;
  icon: LucideIcon;
  summary: string;
}[] = [
  {
    name: "Threat Intelligence",
    icon: Radar,
    summary: "A live threat feed. Click any item to trace the full attack chain.",
  },
  {
    name: "Vulnerabilities",
    icon: ShieldAlert,
    summary: "Every weak spot ranked by severity, each with plain steps to fix it.",
  },
  {
    name: "Compliance Mapping",
    icon: ClipboardCheck,
    summary: "Findings mapped to NIST 800-53 and SOC 2, so you see where you stand.",
  },
];

export const FEATURES: {
  title: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    title: "Live threat feed",
    icon: Radar,
    description: "See incoming threats as they arrive, all in one live feed.",
  },
  {
    title: "See how an attack connects",
    icon: Waypoints,
    description:
      "Click any threat to see how the attacker, their tools, and the target link up.",
  },
  {
    title: "Ranked vulnerabilities",
    icon: ShieldAlert,
    description: "Every weak spot in one list, sorted by how serious it is.",
  },
  {
    title: "Clear fix-it steps",
    icon: ListChecks,
    description: "Each issue comes with simple, plain-language steps to fix it.",
  },
  {
    title: "Audit readiness",
    icon: ClipboardCheck,
    description:
      "See how you measure up against the checklists auditors use, like NIST and SOC 2.",
  },
  {
    title: "Shareable reports",
    icon: FileDown,
    description: "Export a clean report to share with your team or auditors.",
  },
];

/** Plain-language framework explanations (reuses the dashboard tooltip pattern). */
export const COMPLIANCE_FRAMEWORKS: {
  name: string;
  scope: string;
  plain: string;
}[] = [
  {
    name: "NIST SP 800-53",
    scope: "SC and SI control families",
    plain:
      "The U.S. federal security control catalog. We map findings to the boundary and cryptographic controls (SC) and the integrity and monitoring controls (SI).",
  },
  {
    name: "SOC 2 Type II",
    scope: "CC6 and CC7 criteria",
    plain:
      "The trust and security audit standard. We map to the access controls (CC6) and the system operations and monitoring criteria (CC7).",
  },
];

/** Security claims limited to what the app actually does. No certification claims. */
export const SECURITY_POINTS: {
  title: string;
  icon: LucideIcon;
  description: string;
}[] = [
  {
    title: "Invite-only access",
    icon: Lock,
    description: "No open signup. Admins provision every account, with a logged trail.",
  },
  {
    title: "Role-based controls",
    icon: Users,
    description: "Analyst, auditor, and admin roles, least-privilege by default.",
  },
  {
    title: "Tenant isolation",
    icon: Boxes,
    description: "Each org's data is scoped and never visible across tenants.",
  },
  {
    title: "Verified remediation",
    icon: ShieldCheck,
    description: "A fix is marked done only after a signed callback confirms it.",
  },
  {
    title: "Full attribution",
    icon: History,
    description: "Every action is tied to the user who performed it.",
  },
];

export type PricingTier = {
  name: string;
  blurb: string;
  // PLACEHOLDER prices, not finalized. null = "Custom".
  monthly: number | null;
  annual: number | null;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const PRICING: {
  note: string;
  tiers: PricingTier[];
} = {
  note: "Placeholder pricing. Tiers and prices are not finalized.",
  tiers: [
    {
      name: "Starter",
      blurb: "For a small team getting a single clear view.",
      monthly: 0,
      annual: 0,
      features: [
        "All three dashboard views",
        "Up to 3 team members",
        "Sample and imported data",
        "Community support",
      ],
      cta: "Start free",
    },
    {
      name: "Team",
      blurb: "For security teams running day to day operations.",
      monthly: 490,
      annual: 4900,
      highlighted: true,
      features: [
        "Everything in Starter",
        "Unlimited team members",
        "Role-based access and audit trail",
        "NIST and SOC 2 mapping",
        "Priority support",
      ],
      cta: "Book a demo",
    },
    {
      name: "Enterprise",
      blurb: "For regulated and multi-tenant organizations.",
      monthly: null,
      annual: null,
      features: [
        "Everything in Team",
        "Multi-tenant isolation",
        "Remediation verification webhook",
        "SSO and custom onboarding",
        "Dedicated support",
      ],
      cta: "Contact sales",
    },
  ],
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
};

/** Intentionally empty. Do not add quotes until real, attributable ones exist. */
export const TESTIMONIALS: Testimonial[] = [];

export const FAQS: { id: number; question: string; answer: string }[] = [
  {
    id: 1,
    question: "What is Eternal Boundaries?",
    answer:
      "One dashboard that brings your threat feed, vulnerabilities, and compliance status together so your team can act on them.",
  },
  {
    id: 2,
    question: "Do I need to replace my current tools?",
    answer:
      "No. It reads the data your existing tools produce and gives you one clear place to work from.",
  },
  {
    id: 3,
    question: "How do the fix-it steps work?",
    answer:
      "Each vulnerability comes with plain-language steps to fix it, not just a raw scan result.",
  },
  {
    id: 4,
    question: "Which compliance standards do you cover?",
    answer:
      "Your results line up with NIST 800-53 and SOC 2, the checklists auditors use, so coverage is easy to trace.",
  },
  {
    id: 5,
    question: "Is the data on this page real?",
    answer:
      "No. Everything shown in the product previews is sample data for demonstration, never real client telemetry.",
  },
];
