import { ArrowUpRight } from "lucide-react";

import styles from "../paper-landing-page.module.css";

const options = [
  [
    "Security team",
    "Threat context, vulnerability review, and control mapping for a focused security program.",
  ],
  [
    "Network boundary",
    "Console plus boundary planning for IT and industrial OT traffic.",
  ],
  [
    "Municipal utility",
    "Talk through operational needs and grant-aligned security goals for water and utility environments.",
  ],
];

export function PricingSection() {
  return (
    <section className={styles.pricing} id="pricing">
      <div className={styles.pricingHead}>
        <div>
          <span className={styles.kicker}>Pricing</span>
          <h2>A plan shaped around your boundary.</h2>
        </div>
        <p>Early product · pricing scoped to your environment</p>
      </div>
      <div className={styles.pricingGrid}>
        {options.map(([name, text]) => (
          <article data-motion-kind="pricing" key={name}>
            <h3>{name}</h3>
            <p>{text}</p>
            <a href="#contact">
              {name === "Security team"
                ? "Scope and quote"
                : name === "Network boundary"
                  ? "Discuss your deployment"
                  : "Plan a conversation"}{" "}
              <ArrowUpRight size={14} data-motion-cue />
            </a>
          </article>
        ))}
      </div>
      <small className={styles.priceNote}>
        No public list price yet. We’ll discuss scope and fit before proposing a
        plan.
      </small>
    </section>
  );
}
