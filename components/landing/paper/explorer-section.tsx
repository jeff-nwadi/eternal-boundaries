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

const cardTitle = "flex items-start justify-between gap-3";
const cardStrong = "text-[12px] font-[620] [font-family:var(--font-bricolage)]";
const cardSub = "text-[12px] text-[#88828b]";
const cardBadge =
  "shrink-0 rounded-full border border-[#ebe3ee] px-2 py-1 text-[12px] text-[var(--paper-purple)]";
const explorerCard =
  "min-w-0 rounded-[11px] border border-white/[0.92] bg-white/[0.78] px-[17px] py-[15px] shadow-[0_1px_3px_rgba(91,59,72,0.04)]";

export function ExplorerSection() {
  return (
    <section className="bg-[#fbf7f5] py-[72px] pb-[70px] max-[640px]:py-[53px]">
      <div className="mx-auto mb-[38px] w-[min(780px,calc(100%-48px))] text-center max-[640px]:mb-[25px] max-[640px]:w-[calc(100%-40px)]">
        <span className="mb-3 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
          A clearer way to work security
        </span>
        <h2 className="text-[clamp(30px,3.1vw,40px)] max-[640px]:text-[30px]">
          Eternal Boundaries helps your team
          <br />
          see the whole security picture.
        </h2>
        <p className="mx-auto mt-[15px] max-w-[650px] text-[16px] leading-[1.6] text-[var(--paper-muted)]">
          Start with a question your team actually asks. Follow the evidence
          across threats, vulnerabilities, network boundaries, and the controls
          you need to review.
        </p>
      </div>
      <div className="mx-auto grid w-[min(1248px,calc(100%-64px))] grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)] items-start gap-[42px] max-[900px]:w-[min(100%-40px,700px)] max-[900px]:grid-cols-[minmax(230px,0.7fr)_minmax(0,1.3fr)] max-[900px]:gap-6 max-[640px]:w-[calc(100%-40px)] max-[640px]:grid-cols-1 max-[640px]:gap-[23px]">
        <div className="pt-[2px]">
          {questions.map((item, i) => (
            <details
              className="group border-b border-[#e7e0df]"
              data-motion-kind="question"
              key={item.question}
              open={i === 0}
            >
              <summary className="flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-semibold [&::-webkit-details-marker]:hidden max-[640px]:min-h-[45px]">
                {item.question}
                <span
                  data-motion-cue
                  className="text-[17px] font-normal text-[#9a939b] group-open:text-[var(--paper-purple)]"
                >
                  {i === 0 ? "−" : "+"}
                </span>
              </summary>
              <p className="mb-2 mr-5 max-w-[330px] text-[16px] leading-[1.55] text-[var(--paper-muted)]">
                {item.answer}
              </p>
              {item.link && (
                <a href="#how-it-works" className="mb-3 inline-flex text-[12px] text-[var(--paper-purple)]">
                  {item.link}
                </a>
              )}
            </details>
          ))}
        </div>
        <div className="grid gap-6">
          <div className="rounded-[22px] p-[17px] [background:repeating-radial-gradient(ellipse_at_0%_0%,transparent_0_29px,rgba(130,76,104,0.11)_30px_31px,transparent_32px_54px),linear-gradient(112deg,#edb3c5_0%,#f4c8cc_49%,#efb49e_100%)] [background-size:112%_112%,100%_100%] [animation:contour-drift_28s_ease-in-out_infinite_alternate] motion-reduce:[animation:none] max-[640px]:rounded-[17px] max-[640px]:p-[10px]">
            <div className="grid gap-3 rounded-2xl border border-white/[0.82] bg-[rgba(255,250,249,0.56)] p-[13px] max-[640px]:gap-[10px] max-[640px]:rounded-[13px] max-[640px]:p-[9px]">
              <ThreatPathCard />
            </div>
          </div>
          <div className="rounded-[22px] p-[17px] [background:repeating-radial-gradient(ellipse_at_0%_0%,transparent_0_29px,rgba(130,76,104,0.11)_30px_31px,transparent_32px_54px),linear-gradient(112deg,#edb3c5_0%,#f4c8cc_49%,#efb49e_100%)] [background-size:112%_112%,100%_100%] [animation:contour-drift_28s_ease-in-out_infinite_alternate] motion-reduce:[animation:none] max-[640px]:rounded-[17px] max-[640px]:p-[10px]">
            <div className="grid gap-3 rounded-2xl border border-white/[0.82] bg-[rgba(255,250,249,0.56)] p-[13px] max-[640px]:gap-[10px] max-[640px]:rounded-[13px] max-[640px]:p-[9px]">
              <VulnerabilityCard />
              <ComplianceCard />
            </div>
          </div>
          <p className="text-center text-[12px] text-[#8a848b]">
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
    <article data-motion-kind="threat" className={explorerCard}>
      <div className={cardTitle}>
        <div className="grid gap-[3px]">
          <strong className={cardStrong}>Threat path · suspicious control command</strong>
          <small className={cardSub}>An illustrative view of signal → weakness → system</small>
        </div>
        <span className={cardBadge}>Threat intelligence</span>
      </div>
      <div className="mt-[13px] grid grid-cols-2 gap-[9px] max-[640px]:gap-[6px]">
        {[
          ["External / untrusted · signal", "Suspicious write request", "Observed at the network edge"],
          ["Weakness", "Exposed service", "Suggested fix available"],
          ["Internal / protected · boundary decision", "Policy blocks the command", "Decision linked to the event"],
          ["Affected system", "Industrial controller", "Protected system · OT network"],
        ].map(([s, t, d]) => (
          <div key={t} data-motion-cue className="grid gap-[3px] rounded-[4px] border-l-2 border-[#c8b6dd] bg-[#f7f4fa] p-[10px] max-[640px]:p-2">
            <small className="text-[12px] uppercase text-[#8a788f]">{s}</small>
            <strong className="text-[12px]">{t}</strong>
            <span className="text-[12px] text-[#827d85]">{d}</span>
          </div>
        ))}
      </div>
      <p className="mt-[11px] text-[12px] leading-[1.5] text-[#77717a]">
        <b className="mb-[3px] block text-[12px] text-[#514b55]">In plain language</b> The command is
        linked to an exposed service and a protected controller; the boundary
        policy stops it before it reaches the system.
      </p>
    </article>
  );
}

function VulnerabilityCard() {
  return (
    <article data-motion-kind="vulnerability" className={`w-full ${explorerCard}`}>
      <div className={cardTitle}>
        <div className="grid gap-[3px]">
          <strong className={cardStrong}>Vulnerabilities · ranked for review</strong>
          <small className={cardSub}>Example remediation view</small>
        </div>
        <span className={cardBadge}>Critical first</span>
      </div>
      <div className="mt-[11px] grid grid-cols-2 gap-[9px] max-[640px]:gap-[6px]">
        <div data-motion-cue className="grid gap-1 rounded-[5px] border border-[#eee9e6] p-[9px] max-[640px]:p-[7px]">
          <small className="text-[12px] uppercase text-[#af5866]">Critical</small>
          <strong className="text-[12px]">Remote service exposed</strong>
          <p className="text-[12px] leading-[1.45] text-[var(--paper-muted)]">
            Restrict access, apply the fix, then check the boundary rule.
          </p>
        </div>
        <div data-motion-cue className="grid gap-1 rounded-[5px] border border-[#eee9e6] p-[9px] max-[640px]:p-[7px]">
          <small className="text-[12px] uppercase text-[#a97964]">High</small>
          <strong className="text-[12px]">Gateway firmware behind</strong>
          <p className="text-[12px] leading-[1.45] text-[var(--paper-muted)]">
            Schedule an update and confirm the affected system is covered.
          </p>
        </div>
      </div>
    </article>
  );
}

function ComplianceCard() {
  return (
    <article data-motion-kind="controls-preview" className={`w-full ${explorerCard}`}>
      <div className={cardTitle}>
        <div className="grid gap-[3px]">
          <strong className={cardStrong}>Compliance · control evidence</strong>
          <small className={cardSub}>NIST SP 800-53 · SOC 2</small>
        </div>
        <span className={cardBadge}>Control map</span>
      </div>
      <div className="mt-[10px] grid gap-2">
        <span data-motion-cue className="flex items-center justify-between gap-[10px] text-[12px] text-[#5d5760]">
          Access enforcement <b className="text-[12px] font-medium text-[var(--paper-purple)]">Evidence linked</b>
        </span>
        <span data-motion-cue className="flex items-center justify-between gap-[10px] text-[12px] text-[#5d5760]">
          Boundary protection <b className="text-[12px] font-medium text-[var(--paper-purple)]">Review needed</b>
        </span>
        <span data-motion-cue className="flex items-center justify-between gap-[10px] text-[12px] text-[#5d5760]">
          System monitoring <b className="text-[12px] font-medium text-[var(--paper-purple)]">Finding mapped</b>
        </span>
      </div>
    </article>
  );
}
