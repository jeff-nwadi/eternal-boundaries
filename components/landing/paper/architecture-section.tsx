import styles from "../paper-landing-page.module.css";

const items = [
  [
    "Observe",
    "Bring threat signals, system exposure, and network events into one view.",
  ],
  [
    "Explain",
    "Follow a threat from an outside signal to the system it may affect.",
  ],
  ["Enforce", "Apply boundary rules and see each allow or block decision."],
  [
    "Evidence",
    "Connect findings to controls, suggested fixes, and a review trail.",
  ],
];

export function ArchitectureSection() {
  return (
    <section className={styles.architecture} id="security">
      <span className={styles.kicker}>Built around the boundary</span>
      <h2>A clear line through a complex stack.</h2>
      <div className={styles.architectureGrid}>
        {items.map(([title, text]) => (
          <article data-motion-kind="architecture" key={title}>
            <h3 data-motion-cue>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
     
    </section>
  );
}
