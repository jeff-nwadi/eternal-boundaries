import { ArrowUpRight } from "lucide-react";

export function ClosingCta() {
  return (
    <section
      id="contact"
      className="mx-auto mb-[38px] mt-[52px] flex min-h-[150px] w-[min(1248px,calc(100%-64px))] items-center justify-between gap-[25px] rounded-[8px] border border-[#ead4db] bg-[#fff4f3] px-[34px] py-[27px] max-[900px]:w-[min(100%-40px,700px)] max-[640px]:mt-8 max-[640px]:w-[calc(100%-40px)] max-[640px]:flex-col max-[640px]:items-start max-[640px]:p-[22px]"
    >
      <div>
        <span className="mb-2 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
          Start with a conversation
        </span>
        <h2 className="text-[25px] font-[620] max-[640px]:text-[23px]">See your security clearly.</h2>
        <p className="mt-[7px] text-[16px] text-[var(--paper-muted)]">
          Bring your network, your questions, and the controls you need to map.
        </p>
        <small className="mt-[5px] block text-[12px] text-[#948c91]">
          No pressure. Just a fit check.
        </small>
      </div>
      <a
        className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-[var(--paper-purple)] px-[15px] text-[12px] font-[650] !text-white transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-[#4820b3]"
        data-motion-kind="cta"
        href="mailto:hello@eternalboundaries.com"
      >
        Talk to our team <ArrowUpRight size={15} data-motion-cue />
      </a>
    </section>
  );
}
