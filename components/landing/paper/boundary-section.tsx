import styles from "../paper-landing-page.module.css";

export function BoundarySection() {
  return (
    <section className={styles.splitSection}>
       <div className={styles.boundaryPanel} data-motion-kind="boundary">
        <div className={styles.panelCaption}>
          <span>Untrusted network</span>
          <span>Protected system</span>
        </div>
        <div className={styles.miniFlow}>
          <div>
            <small>External zone</small>
            <strong>Write command received</strong>
            <span>Function code 0x06</span>
          </div>
          <div className={styles.miniBoundary}>
            <span>Boundary inspection</span>
            <i data-motion-cue />
          </div>
          <div>
            <small>Protected zone</small>
            <strong>Controller command</strong>
            <span>
              Policy decision <b>BLOCK</b>
            </span>
          </div>
        </div>
        <p>
          Decision context stays readable: source → command → rule → affected
          asset.
        </p>
      </div>
      
      <div className={styles.splitCopy}>
        <span className={styles.kicker}>The boundary is the product</span>
        <h2>
          Know what crosses.
          <br />
          Know what gets stopped.
        </h2>
        <p>
          Traffic meets a clear line between untrusted and protected systems.
          Inspect commands at the boundary and make each decision visible to
          your team.
        </p>
        <div className={styles.tagRow}>
          <span>IT networks</span>
          <span>Industrial OT</span>
        </div>
      </div>
    </section>
  );
}
