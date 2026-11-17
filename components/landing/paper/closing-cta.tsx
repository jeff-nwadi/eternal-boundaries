import { ArrowUpRight } from "lucide-react";

import styles from "../paper-landing-page.module.css";

export function ClosingCta() {
  return (
    <section className={styles.closingCta} id="contact">
      <div>
        <span className={styles.kicker}>Start with a conversation</span>
        <h2>See your security clearly.</h2>
        <p>
          Bring your network, your questions, and the controls you need to map.
        </p>
        <small>No pressure. Just a fit check.</small>
      </div>
      <a
        className={styles.primaryButton}
        data-motion-kind="cta"
        href="mailto:hello@eternalboundaries.com"
      >
        Talk to our team <ArrowUpRight size={15} data-motion-cue />
      </a>
    </section>
  );
}
