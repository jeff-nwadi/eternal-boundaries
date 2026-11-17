import styles from "../paper-landing-page.module.css";

const questions = [
  {
    question: "What is this threat connected to?",
    answer:
      "Trace a signal through an exposed weakness to the system it may affect.",
    link: "Follow the attack chain ↗",
  },
  {
    question: "Which vulnerabilities matter most?",
    answer: "Review exposed weaknesses by severity and affected system.",
  },
  {
    question: "What crossed the boundary?",
    answer: "See which request reached the gate and what decision was made.",
  },
  {
    question: "What should we fix first?",
    answer:
      "Start with the highest-priority findings and their suggested next steps.",
  },
  {
    question: "Which controls have evidence?",
    answer: "Review mapped control coverage, evidence, and open gaps.",
  },
  {
    question: "How did the gate respond?",
    answer: "Follow the request and the policy decision in one place.",
  },
];

export function ExplorerSection() {
  return (
    <section className={styles.explorer}>
      <div className={styles.explorerHead}>
        <span className={styles.kicker}>A clearer way to work security</span>
        <h2>
          Eternal Boundaries helps your team
          <br />
          see the whole security picture.
        </h2>
        <p>
          Start with a question your team actually asks. Follow the evidence
          across threats, vulnerabilities, network boundaries, and the controls
          you need to review.
        </p>
      </div>
      <div className={styles.explorerGrid}>
        <div className={styles.questionList}>
          {questions.map((item, i) => (
            <details
              data-motion-kind="question"
              key={item.question}
              open={i === 0}
            >
              <summary>
                {item.question}
                <span data-motion-cue>{i === 0 ? "−" : "+"}</span>
              </summary>
              <p>{item.answer}</p>
              {item.link && <a href="#how-it-works">{item.link}</a>}
            </details>
          ))}
        </div>
        <div className={styles.explorerPreviews}>
          <div className={styles.gradientShell}>
            <div className={styles.gradientGlass}>
              <ThreatPathCard />
            </div>
          </div>
          <div className={styles.gradientShell}>
            <div className={styles.gradientGlass}>
              <VulnerabilityCard />
              <ComplianceCard />
            </div>
          </div>
          <p className={styles.sampleNote}>
            Illustrative interface and sample findings · no customer or
            performance claims
          </p>
        </div>
      </div>
    </section>
  );
}

function ThreatPathCard() {
  return (
    <article
      data-motion-kind="threat"
      className={`${styles.explorerCard} ${styles.threatCard}`}
    >
      <div className={styles.explorerCardTitle}>
        <div>
          <strong>Threat path · suspicious control command</strong>
          <small>An illustrative view of signal → weakness → system</small>
        </div>
        <span>Threat intelligence</span>
      </div>
      <div className={styles.threatSteps}>
        <div data-motion-cue>
          <small>External / untrusted · signal</small>
          <strong>Suspicious write request</strong>
          <span>Observed at the network edge</span>
        </div>
        <div data-motion-cue>
          <small>Weakness</small>
          <strong>Exposed service</strong>
          <span>Suggested fix available</span>
        </div>
        <div data-motion-cue>
          <small>Internal / protected · boundary decision</small>
          <strong>Policy blocks the command</strong>
          <span>Decision linked to the event</span>
        </div>
        <div data-motion-cue>
          <small>Affected system</small>
          <strong>Industrial controller</strong>
          <span>Protected system · OT network</span>
        </div>
      </div>
      <p>
        <b>In plain language</b> The command is linked to an exposed service and
        a protected controller; the boundary policy stops it before it reaches
        the system.
      </p>
    </article>
  );
}

function VulnerabilityCard() {
  return (
    <article
      data-motion-kind="vulnerability"
      className={`${styles.explorerCard} ${styles.vulnerabilityCard}`}
    >
      <div className={styles.explorerCardTitle}>
        <div>
          <strong>Vulnerabilities · ranked for review</strong>
          <small>Example remediation view</small>
        </div>
        <span>Critical first</span>
      </div>
      <div className={styles.miniVulnGrid}>
        <div data-motion-cue>
          <small className={styles.critical}>Critical</small>
          <strong>Remote service exposed</strong>
          <p>Restrict access, apply the fix, then check the boundary rule.</p>
        </div>
        <div data-motion-cue>
          <small className={styles.high}>High</small>
          <strong>Gateway firmware behind</strong>
          <p>Schedule an update and confirm the affected system is covered.</p>
        </div>
      </div>
    </article>
  );
}

function ComplianceCard() {
  return (
    <article
      data-motion-kind="controls-preview"
      className={`${styles.explorerCard} ${styles.miniCompliance}`}
    >
      <div className={styles.explorerCardTitle}>
        <div>
          <strong>Compliance · control evidence</strong>
          <small>NIST SP 800-53 · SOC 2</small>
        </div>
        <span>Control map</span>
      </div>
      <div className={styles.miniControlRows}>
        <span data-motion-cue>
          Access enforcement <b>Evidence linked</b>
        </span>
        <span data-motion-cue>
          Boundary protection <b>Review needed</b>
        </span>
        <span data-motion-cue>
          System monitoring <b>Finding mapped</b>
        </span>
      </div>
    </article>
  );
}
