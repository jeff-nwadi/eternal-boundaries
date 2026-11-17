import styles from "../paper-landing-page.module.css";

export function GateSection() {
  return (
    <section className={styles.gateSection} id="how-it-works">
      <div className={styles.gateDemo} data-motion-kind="gate">
        <div className={styles.scenarioBadge}>
          <span>Scenario 01 / 03</span>
          <i data-motion-cue />
        </div>
        <h3>Suspicious Modbus write</h3>
        <p>A control command approaches a protected system.</p>
        <div className={styles.outcomeGrid}>
          <div>
            <small>Gate off</small>
            <strong>Request passes</strong>
            <span>
              External source <b>→</b> Write command <b>→</b> Controller
            </span>
          </div>
          <div className={styles.blocked}>
            <small>Gate on</small>
            <strong>Policy blocks</strong>
            <span>
              External source <b>→</b> Write command <b>→</b> Stopped at gate
            </span>
          </div>
        </div>
        <small className={styles.demoNote}>
          Conceptual demonstration · scenario controls shown as a design state
        </small>
      </div>
      <div className={styles.gateCopy}>
        <span className={styles.kicker}>Gate proof</span>
        <h2>
          One scenario.
          <br />
          Two clear outcomes.
        </h2>
        <p>
          See how a boundary decision changes the path. The same command reaches
          the controller with the gate off and is stopped when policy is
          enforced.
        </p>
        <div className={styles.scenarioLinks}>
          <a className={styles.activeScenario} href="#how-it-works">
            01 Modbus write
          </a>
          <a href="#how-it-works">02 Exploit path</a>
          <a href="#how-it-works">03 Policy match</a>
        </div>
        <a className={styles.textLink} href="#security">
          Explore the boundary model ↗
        </a>
      </div>
    </section>
  );
}
