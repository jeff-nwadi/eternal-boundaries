import styles from "../paper-landing-page.module.css";

export function ComplianceSection() {
  return (
    <section className={styles.splitSection} id="compliance">
      <div className={styles.splitCopy}>
        <span className={styles.kicker}>Compliance, with context</span>
        <h2>
          Turn findings into
          <br />
          evidence you can follow.
        </h2>
        <p>
          Connect technical findings to the controls they affect. See what is
          covered, where evidence is missing, and what deserves a closer look.
        </p>
        <div className={styles.tagRow}>
          <span>NIST SP 800-53</span>
          <span>SOC 2</span>
        </div>
      </div>
      <div className={styles.controlPanel} data-motion-kind="compliance">
        <div className={styles.controlHeader}>
          <strong>Control coverage</strong>
          <small>Illustrative view</small>
        </div>
        <ControlRow
          control="NIST SP 800-53 · AC-4"
          title="Information flow enforcement"
          status="Evidence linked"
        />
        <ControlRow
          control="SOC 2 · CC6.6"
          title="System boundary protection"
          status="Review needed"
          warning
        />
        <ControlRow
          control="NIST SP 800-53 · SI-4"
          title="System monitoring"
          status="Map finding →"
        />
      </div>
    </section>
  );
}

function ControlRow({
  control,
  title,
  status,
  warning = false,
}: {
  control: string;
  title: string;
  status: string;
  warning?: boolean;
}) {
  return (
    <div className={styles.controlRow} data-motion-cue>
      <div>
        <small>{control}</small>
        <span>{title}</span>
      </div>
      <em className={warning ? styles.review : ""}>{status}</em>
    </div>
  );
}
