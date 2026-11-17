import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

import styles from "../paper-landing-page.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <Link
        href="/"
        className={styles.wordmark}
        aria-label="Eternal Boundaries home"
      >
        
        <span>Eternal Boundaries</span>
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <a href="#platform">Platform</a>
        <a href="#how-it-works">How it works</a>
        <a href="#compliance">Compliance</a>
        <a href="#pricing">Pricing</a>
      </nav>
      <div className={styles.headerActions}>
        <Link href="/login" className={styles.signIn}>
          Sign in
        </Link>
        <a className={styles.headerCta} href="#contact">
          Talk to our team <ArrowUpRight size={14} />
        </a>
      </div>
      <details className={styles.mobileMenu}>
        <summary aria-label="Open navigation">
          <Menu size={19} />
        </summary>
        <nav aria-label="Mobile navigation">
          <a href="#platform">Platform</a>
          <a href="#how-it-works">How it works</a>
          <a href="#compliance">Compliance</a>
          <a href="#pricing">Pricing</a>
          <Link href="/login">Sign in</Link>
        </nav>
      </details>
    </header>
  );
}
