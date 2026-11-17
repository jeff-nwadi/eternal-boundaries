import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import styles from "../paper-landing-page.module.css";

const columns = [
  [
    "Platform",
    [
      "Threat intelligence",
      "Vulnerability guidance",
      "Compliance mapping",
      "Boundary gate",
    ],
  ],
  [
    "Solutions",
    [
      "Security operations",
      "Industrial networks",
      "Municipal utilities",
      "Auditor workflows",
    ],
  ],
  [
    "Resources",
    [
      "How the boundary works",
      "NIST SP 800-53 mapping",
      "SOC 2 mapping",
      "Frequently asked questions",
    ],
  ],
  ["Company", ["About", "Contact", "Privacy", "Security"]],
] as const;

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
          <Link href="/" className={styles.footerWordmark}>
            <span className={styles.brandGlyph}>E</span>Eternal Boundaries
          </Link>
          <p>
            Threats explained. Compliance mapped. Boundary decisions made easier
            to see and understand.
          </p>
          <small>IT networks · Industrial OT · Control mapping</small>
        </div>
        <div className={styles.footerCta}>
          <span>Planning a security review?</span>
          <a className={styles.headerCta} href="#contact">
            Talk to our team <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className={styles.footerColumns}>
        {columns.map(([title, links]) => (
          <div key={title as string}>
            <strong>{title as string}</strong>
            {(links as readonly string[]).map((link) => (
              <a
                key={link}
                href={
                  link.includes("Compliance") ||
                  link.includes("NIST") ||
                  link.includes("SOC")
                    ? "#compliance"
                    : link.includes("boundary") || link.includes("gate")
                      ? "#how-it-works"
                      : link.includes("Threat") || link.includes("Vulnerability")
                        ? "#platform"
                        : "#contact"
                }
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.footerBottom}>
        <span>
          © 2026 Eternal Boundaries. Early product; capabilities are evolving.
        </span>
        <div>
          <a href="#contact">Privacy</a>
          <a href="#contact">Terms</a>
          <a href="#contact">Contact</a>
          <Link href="/login">Sign in ↗</Link>
        </div>
      </div>
    </footer>
  );
}
