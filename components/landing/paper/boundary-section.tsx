export function BoundarySection() {
  return (
    <section className="mx-auto hidden min-h-[420px] w-[calc(100%-40px)] grid-cols-1 items-center gap-[27px] py-[52px] sm:grid sm:w-[min(1248px,calc(100%-64px))] sm:grid-cols-2 sm:gap-8 sm:py-[70px] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.08fr)] lg:gap-[72px]">
      <div
        className="relative flex min-h-[230px] w-[min(100%,500px)] flex-col justify-between justify-self-center rounded-[9px] border border-[#e1ddda] bg-[#fdfcfb] px-3 py-[15px] sm:min-h-[250px] sm:p-5"
        data-motion-kind="boundary"
      >
        <div className="flex justify-between text-[12px] uppercase text-[#89838b]">
          <span>Untrusted network</span>
          <span>Protected system</span>
        </div>
        <div className="grid min-h-[146px] flex-1 grid-cols-[1fr_43px_1fr] items-center gap-[5px] sm:grid-cols-[1fr_70px_1fr] sm:gap-[13px]">
          <div className="grid gap-2 rounded-[6px] border border-[#e5e0e4] bg-white px-[7px] py-[9px] sm:p-[13px]">
            <small className="text-[12px] uppercase text-[#8b858e]">External zone</small>
            <strong className="text-[12px] font-semibold">Write command received</strong>
            <span className="text-[12px] text-[var(--paper-muted)]">Function code 0x06</span>
          </div>
          <div className="flex h-full flex-col items-center justify-center gap-[7px]">
            <span className="text-center text-[12px] uppercase text-[var(--paper-faint)]">
              Boundary inspection
            </span>
            <i
              data-motion-cue
              className="relative h-[74px] w-[2px] overflow-visible bg-[#8f8a93] after:absolute after:left-[-2px] after:top-0 after:h-[18px] after:w-[6px] after:rounded-[5px] after:bg-[#b8b2bb] after:shadow-[0_0_12px_rgba(130,124,133,0.4)] after:content-[''] after:[animation:boundary-scan_2.8s_ease-in-out_infinite] motion-reduce:after:[animation:none]"
            />
          </div>
          <div className="grid gap-2 rounded-[6px] border border-[#e5e0e4] bg-white px-[7px] py-[9px] sm:p-[13px]">
            <small className="text-[12px] uppercase text-[#8b858e]">Protected zone</small>
            <strong className="text-[12px] font-semibold">Controller command</strong>
            <span className="text-[12px] text-[var(--paper-muted)]">
              Policy decision <b className="font-semibold text-[var(--paper-ink)]">BLOCK</b>
            </span>
          </div>
        </div>
        <p className="border-t border-[var(--paper-line)] pt-[10px] text-center text-[12px] text-[#827c83]">
          Decision context stays readable: source → command → rule → affected
          asset.
        </p>
      </div>

      <div className="max-w-[575px]">
        <h2 className="mb-[18px] text-[32px] font-[620] sm:text-[clamp(30px,3.25vw,42px)]">
          Know what crosses.
          <br />
          Know what gets stopped.
        </h2>
        <p className="max-w-[580px] text-[16px] leading-[1.6] text-[var(--paper-muted)] [text-wrap:pretty]">
          Traffic meets a clear line between untrusted and protected systems.
          Inspect commands at the boundary and make each decision visible to
          your team.
        </p>
        <div className="mt-[26px] flex gap-[10px]">
          <span className="inline-flex min-h-[38px] items-center rounded-[6px] border border-[#dedbd9] px-[14px] text-[12px] text-[#55505a]">
            IT networks
          </span>
          <span className="inline-flex min-h-[38px] items-center rounded-[6px] border border-[#dedbd9] px-[14px] text-[12px] text-[#55505a]">
            Industrial OT
          </span>
        </div>
      </div>
    </section>
  );
}
