import { ArrowUpRight } from "lucide-react";

import styles from "../paper-landing-page.module.css";
import { DashboardPreview } from "./dashboard-preview";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.heroWash} aria-hidden="true" />
      <div className={styles.heroCopy} data-hero-copy>
        <h1>
          Your security boundary,
          <br />
          under your control.
        </h1>
        <p>
          Eternal Boundaries helps you understand your threats, secure your
          systems, and prove your compliance — giving you the confidence to
          protect every boundary.
        </p>
        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#platform">
            Talk to our team <ArrowUpRight size={16} />
          </a>
        </div>
        <span className={styles.heroNote}>
          Built for security teams · IT + industrial OT
        </span>
      </div>
      <DashboardPreview />
    </section>
  );
}
