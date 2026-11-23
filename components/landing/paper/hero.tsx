import { ArrowUpRight } from "lucide-react";

import { DashboardPreview } from "./dashboard-preview";
import { StaggerText } from "./stagger-text";

export function Hero() {
  return (
    <section className="relative isolate pb-12">
      {/* Cropped, rounded hero panel — the grid + glow live inside it so the
          background is contained within the rounded shape. The header floats
          over its top, so the panel carries top padding to clear the nav. */}
      <div
        data-hero-panel
        className="relative isolate mx-4 mt-[18px] overflow-clip rounded-[30px] border border-[rgba(91,43,210,0.08)] px-6 pb-10 pt-[118px] [background:linear-gradient(180deg,#f1ecfb_0%,#f7f4f1_68%)] max-[640px]:mx-2.5 max-[640px]:mt-2.5 max-[640px]:rounded-[22px] max-[640px]:px-4 max-[640px]:pb-7 max-[640px]:pt-[90px]"
      >
        {/* Fine graph-paper grid filling the panel, soft vignette toward the
            rounded edges. Ambient drift + parallax are driven by anime.js. */}
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
            className="text-[clamp(42px,5.1vw,68px)] font-[670] leading-[1.08] !tracking-[-0.065em] text-[color:var(--paper-ink)] max-[640px]:text-[clamp(32px,10vw,50px)] max-[640px]:[overflow-wrap:break-word]"
          />
          <p
            data-hero-subhead
            className="mt-[18px] max-w-[630px] text-[16px] leading-[1.6] text-[color:var(--paper-muted)] [text-wrap:pretty]"
          >
            Eternal Boundaries helps you understand your threats, secure your
            systems, and prove your compliance — giving you the confidence to
            protect every boundary.
          </p>
          <div className="mt-[26px] flex items-center gap-3 max-[640px]:flex-wrap max-[640px]:justify-center">
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
        <div className="">
          <DashboardPreview />
        </div>
      </div>
    </section>
  );
}
