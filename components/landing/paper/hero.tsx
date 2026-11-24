import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { StaggerText } from "./stagger-text";

export function Hero() {
  return (
    <section className="relative isolate pb-12">
      {/* Full-bleed on mobile; cropped rounded panel from tablet up (sm+). The
          header floats over the top, so top padding clears the nav. */}
      <div
        data-hero-panel
        className="relative isolate overflow-clip px-4 pb-7 pt-[90px] [background:linear-gradient(180deg,#f1ecfb_0%,#f7f4f1_68%)] sm:mx-4 sm:mt-[18px] sm:rounded-[30px] sm:border sm:border-[rgba(91,43,210,0.08)] sm:px-6 sm:pb-10 sm:pt-[118px]"
      >
        {/* Fine graph-paper grid. Ambient drift + parallax driven by anime.js. */}
        <div
          data-hero-grid
          aria-hidden="true"
          className="absolute -inset-[60px] -z-10 [background-image:linear-gradient(to_right,rgba(32,29,36,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(32,29,36,0.05)_1px,transparent_1px)] [background-size:46px_46px] [-webkit-mask-image:radial-gradient(125%_110%_at_50%_34%,#000_52%,transparent_100%)] [mask-image:radial-gradient(125%_110%_at_50%_34%,#000_52%,transparent_100%)] [will-change:transform,background-position] before:absolute before:inset-0 before:content-[''] before:[background:radial-gradient(52%_40%_at_50%_18%,rgba(91,43,210,0.18),transparent_70%),radial-gradient(85%_55%_at_50%_14%,rgba(91,43,210,0.07),transparent_82%)]"
        />
        {/* Cursor-following purple spotlight (anime.js createAnimatable). */}
        <div
          data-hero-glow
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 -z-10 -ml-[220px] -mt-[220px] h-[440px] w-[440px] rounded-full opacity-0 [background:radial-gradient(circle,rgba(91,43,210,0.18)_0%,rgba(91,43,210,0.08)_36%,transparent_68%)] [will-change:transform,opacity]"
        />
        <div
          data-hero-copy
          className="relative z-[1] mx-auto flex max-w-[740px] flex-col items-center text-center"
        >
          <StaggerText
            lines={["Your security boundary,", "under your control."]}
            className="w-full text-[clamp(32px,10vw,50px)] font-[670] leading-[1.08] !tracking-[-0.065em] text-[color:var(--paper-ink)] [overflow-wrap:break-word] sm:text-[clamp(42px,5.1vw,68px)]"
          />
          <p
            data-hero-subhead
            className="mt-[18px] max-w-[630px] text-[16px] leading-[1.6] text-[color:var(--paper-muted)] [text-wrap:pretty]"
          >
            Eternal Boundaries helps you understand your threats, secure your
            systems, and prove your compliance — giving you the confidence to
            protect every boundary.
          </p>
          <div className="mt-[26px] flex flex-wrap items-center justify-center gap-3">
            <a
              href="#platform"
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-[var(--paper-purple)] px-[18px] text-[13px] font-[650] !text-white transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-[#4820b3]"
            >
              Talk to our team <ArrowUpRight size={16} />
            </a>
          </div>
          <span className="mt-3 text-[12px] uppercase text-[color:var(--paper-faint)]">
            Built for security teams · IT + industrial OT
          </span>
        </div>
        {/* Product screenshot of the live security dashboard (illustrative,
            sample data). */}
        <div className="relative z-[2] mx-auto mt-7 w-full max-w-[1080px] overflow-hidden rounded-[11px] border border-[#e4ddda] bg-white shadow-[0_22px_54px_rgba(84,64,75,0.12)] sm:mt-9 sm:rounded-2xl lg:mt-[44px]">
          <Image
            src="/hero-dashboard.png"
            alt="Eternal Boundaries security dashboard — overview with open findings, severity breakdown, top findings and activity"
            width={1900}
            height={1000}
            priority
            className="block h-auto w-full"
          />
        </div>
      </div>
    </section>
  );
}
