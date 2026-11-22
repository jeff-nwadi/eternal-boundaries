export function ComplianceSection() {
  return (
    <section
      id="compliance"
      className="mx-auto grid min-h-[420px] w-[min(1248px,calc(100%-64px))] grid-cols-[minmax(0,0.9fr)_minmax(0,1.08fr)] items-center gap-[72px] py-[70px] max-[900px]:grid-cols-2 max-[900px]:gap-8 max-[640px]:w-[calc(100%-40px)] max-[640px]:grid-cols-1 max-[640px]:gap-[27px] max-[640px]:py-[52px]"
    >
      <div className="max-w-[575px]">
        <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
          Compliance, with context
        </span>
        <h2 className="mb-[18px] text-[clamp(30px,3.25vw,42px)] font-[620] max-[640px]:text-[32px]">
          Turn findings into
          <br />
          evidence you can follow.
        </h2>
        <p className="max-w-[580px] text-[16px] leading-[1.6] text-[var(--paper-muted)] [text-wrap:pretty]">
          Connect technical findings to the controls they affect. See what is
          covered, where evidence is missing, and what deserves a closer look.
        </p>
        <div className="mt-[26px] flex gap-[10px]">
          <span className="inline-flex min-h-[38px] items-center rounded-[6px] border border-[#dedbd9] px-[14px] text-[12px] text-[#55505a]">
            NIST SP 800-53
          </span>
          <span className="inline-flex min-h-[38px] items-center rounded-[6px] border border-[#dedbd9] px-[14px] text-[12px] text-[#55505a]">
            SOC 2
          </span>
        </div>
      </div>
      <div
        className="flex min-h-[250px] w-[min(100%,500px)] flex-col justify-self-center rounded-[9px] border border-[#e1ddda] bg-[#f1efeb] p-5 max-[640px]:min-h-[230px] max-[640px]:p-[15px]"
        data-motion-kind="compliance"
      >
        <div className="flex items-center justify-between border-b border-[#e4e0dd] pb-[14px]">
          <strong className="text-[16px] font-semibold [font-family:var(--font-bricolage)]">
            Control coverage
          </strong>
          <small className="text-[12px] uppercase text-[var(--paper-faint)]">Illustrative view</small>
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
    <div
      className="flex min-h-[64px] items-center justify-between gap-[14px] border-b border-[#e4e0dd] last:border-b-0"
      data-motion-cue
    >
      <div className="grid gap-[3px]">
        <small className="text-[12px] text-[var(--paper-faint)]">{control}</small>
        <span className="text-[12px]">{title}</span>
      </div>
      <em
        className={`whitespace-nowrap text-[12px] not-italic ${warning ? "text-[#a57d6e]" : "text-[var(--paper-ink)]"}`}
      >
        {status}
      </em>
    </div>
  );
}
