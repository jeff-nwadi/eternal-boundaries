import Link from "next/link";
import { ArrowUpRight, Menu } from "lucide-react";

const navLink = "transition-colors duration-150 hover:text-[var(--paper-purple)]";
const mobileLink =
  "rounded-[5px] p-[9px] text-[12px] hover:bg-[#f6f3f8] hover:text-[var(--paper-purple)]";

export function SiteHeader() {
  return (
    <header className="absolute left-0 right-0 top-[18px] z-20 mx-auto flex h-[76px] w-[min(1248px,calc(100%-64px))] items-center justify-between gap-6 max-[900px]:w-[min(100%-40px,700px)] max-[640px]:h-[66px] max-[640px]:w-[calc(100%-36px)]">
      <Link
        href="/"
        aria-label="Eternal Boundaries home"
        className="inline-flex items-center gap-[9px] whitespace-nowrap text-[15px] font-[650] tracking-[-0.025em] [font-family:var(--font-bricolage)]"
      >
        <span>Eternal Boundaries</span>
      </Link>
      <nav
        aria-label="Main navigation"
        className="hidden lg:flex items-center gap-8 text-[13px] text-[#4d4850] max-[900px]:gap-[18px] "
      >
        <a href="#platform" className={navLink}>
          Platform
        </a>
        <a href="#how-it-works" className={navLink}>
          How it works
        </a>
        <a href="#compliance" className={navLink}>
          Compliance
        </a>
        <a href="#pricing" className={navLink}>
          Pricing
        </a>
      </nav>
      <div className="hidden lg:flex items-center gap-[22px] text-[13px] max-[900px]:gap-[13px] max-[640px]:hidden">
        <Link href="/login" className={navLink}>
          Sign in
        </Link>
        <a
          href="#contact"
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--paper-purple)] px-[15px] text-[12px] font-[650] !text-white transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-[#4820b3]"
        >
          Talk to our team <ArrowUpRight size={14} />
        </a>
      </div>
      <details className="relative flex lg:hidden">
        <summary
          aria-label="Open navigation"
          className="grid h-9 w-9 cursor-pointer list-none place-items-center rounded-[7px] border border-[var(--paper-line)] [&::-webkit-details-marker]:hidden"
        >
          <Menu size={19} />
        </summary>
        <nav
          aria-label="Mobile navigation"
          className="absolute right-0 top-[43px] grid min-w-[190px] gap-[3px] rounded-[9px] border border-[var(--paper-line)] bg-white p-[9px] shadow-[0_12px_30px_rgba(40,30,40,0.12)]"
        >
          <a href="#platform" className={mobileLink}>
            Platform
          </a>
          <a href="#how-it-works" className={mobileLink}>
            How it works
          </a>
          <a href="#compliance" className={mobileLink}>
            Compliance
          </a>
          <a href="#pricing" className={mobileLink}>
            Pricing
          </a>
          <Link href="/login" className={mobileLink}>
            Sign in
          </Link>
        </nav>
      </details>
    </header>
  );
}
