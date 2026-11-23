export function GateSection() {
  return (
    <section
      id="how-it-works"
      className="relative grid grid-cols-1 items-center gap-[27px] overflow-hidden px-5 py-[35px] [background:linear-gradient(105deg,#fff0d3_0%,#f9e8e5_48%,#f5e3ed_100%)] sm:px-8 sm:py-[54px] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.94fr)] lg:gap-[52px] lg:px-[max(32px,calc((100%-1248px)/2))]"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-50 [background:repeating-radial-gradient(ellipse_at_12%_42%,transparent_0_29px,rgba(107,69,91,0.2)_30px_31px,transparent_32px_53px)] [background-size:140%_140%] [-webkit-mask-image:linear-gradient(90deg,#000,transparent_42%,transparent_60%,#000)] [mask-image:linear-gradient(90deg,#000,transparent_42%,transparent_60%,#000)] [animation:contour-drift_24s_ease-in-out_infinite_alternate] motion-reduce:[animation:none]"
        aria-hidden="true"
      />
      <div
        className="relative z-[1] rounded-[10px] border border-[rgba(117,86,118,0.12)] bg-white/90 p-[15px] shadow-[0_8px_28px_rgba(83,60,73,0.06)] sm:p-[22px]"
        data-motion-kind="gate"
      >
        <div className="flex w-fit items-center gap-[10px] rounded-full border border-[#ece5e8] px-2 py-[5px] text-[12px] text-[#68616a]">
          <span>Scenario 01 / 03</span>
          <i
            data-motion-cue
            className="relative h-[5px] w-[28px] overflow-hidden rounded-[99px] bg-[#e3dfe1] after:absolute after:inset-y-0 after:left-0 after:w-[11px] after:rounded-[inherit] after:bg-[var(--paper-purple)] after:content-[''] after:[animation:scenario-progress_2.4s_ease-in-out_infinite] motion-reduce:after:[animation:none]"
          />
        </div>
        <h3 className="mt-[17px] text-[19px]">Suspicious Modbus write</h3>
        <p className="mt-[5px] text-[12px] text-[var(--paper-muted)]">
          A control command approaches a protected system.
        </p>
        <div className="mt-[18px] grid grid-cols-2 gap-[7px] sm:gap-3">
          <div className="grid gap-2 rounded-[6px] border border-[#e7e2e2] bg-white p-[9px] sm:p-[14px]">
            <small className="text-[12px] uppercase text-[#8a858b]">Gate off</small>
            <strong className="text-[12px]">Request passes</strong>
            <span className="text-[12px] leading-[1.5] text-[#77717a] sm:leading-normal">
              External source <b className="font-normal text-[#aaa3ac]">→</b> Write command{" "}
              <b className="font-normal text-[#aaa3ac]">→</b> Controller
            </span>
          </div>
          <div className="grid gap-2 rounded-[6px] border border-[#e6d6f3] bg-[#f8f4fc] p-[9px] sm:p-[14px]">
            <small className="text-[12px] uppercase text-[#8a858b]">Gate on</small>
            <strong className="text-[12px] text-[var(--paper-purple)]">Policy blocks</strong>
            <span className="text-[12px] leading-[1.5] text-[#77717a] sm:leading-normal">
              External source <b className="font-normal text-[#aaa3ac]">→</b> Write command{" "}
              <b className="font-normal text-[#aaa3ac]">→</b> Stopped at gate
            </span>
          </div>
        </div>
        <small className="mt-[13px] block text-[12px] text-[#8f8990]">
          Illustration only · not a live engine run
        </small>
      </div>
      <div className="relative z-[1] max-w-[700px] lg:max-w-[515px]">
        <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
          Gate proof
        </span>
        <h2 className="mb-4 text-[32px] font-[620] sm:text-[clamp(30px,3.25vw,42px)]">
          One scenario.
          <br />
          Two clear outcomes.
        </h2>
        <p className="max-w-[470px] text-[16px] leading-[1.6] text-[var(--paper-muted)] [text-wrap:pretty]">
          See how a boundary decision changes the path. The same command reaches
          the controller with the gate off and is stopped when policy is
          enforced.
        </p>
        <div className="mt-[18px] flex flex-wrap gap-2">
          <a
            className="rounded-full border border-[var(--paper-purple)] bg-[var(--paper-purple)] px-[10px] py-[6px] text-[12px] !text-white"
            href="#how-it-works"
          >
            01 Modbus write
          </a>
          <a
            className="rounded-full border border-[rgba(80,68,85,0.14)] px-[10px] py-[6px] text-[12px] text-[#6e6771]"
            href="#how-it-works"
          >
            02 Exploit path
          </a>
          <a
            className="rounded-full border border-[rgba(80,68,85,0.14)] px-[10px] py-[6px] text-[12px] text-[#6e6771]"
            href="#how-it-works"
          >
            03 Policy match
          </a>
        </div>
        <a
          className="mt-[17px] inline-flex w-fit items-center text-[12px] text-[var(--paper-purple)] transition-colors hover:text-[var(--paper-purple)]"
          href="#security"
        >
          Explore the boundary model ↗
        </a>
      </div>
    </section>
  );
}
