import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const columns = [
  [
    "Platform",
    [
      "Threat intelligence",
      "Vulnerability guidance",
      "Compliance mapping",
      "Boundary gate",
    ],
  ],
  [
    "Solutions",
    [
      "Security operations",
      "Industrial networks",
      "Municipal utilities",
      "Auditor workflows",
    ],
  ],
  [
    "Resources",
    [
      "How the boundary works",
      "NIST SP 800-53 mapping",
      "SOC 2 mapping",
      "Frequently asked questions",
    ],
  ],
  ["Company", ["About", "Contact", "Privacy", "Security"]],
] as const;

const footerLink = "w-fit text-[12px] text-[#ddd8e0] transition-colors hover:text-[#c1a2fa]";

export function SiteFooter() {
  return (
    <footer className="bg-[#26232a] px-[max(32px,calc((100%-1248px)/2))] pb-5 pt-[26px] text-[#f5f2f6] max-[900px]:px-8 max-[640px]:px-5 max-[640px]:pb-[17px] max-[640px]:pt-[23px]">
      <div className="flex items-start justify-between gap-[34px] border-b border-white/[0.14] pb-[25px] pt-[17px] max-[640px]:flex-col max-[640px]:items-start max-[640px]:gap-[18px]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-[9px] whitespace-nowrap text-[15px] font-[650] tracking-[-0.025em] text-[#f5f2f6] [font-family:var(--font-bricolage)]"
          >
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-[var(--paper-purple)] text-[13px] font-bold text-white">
              E
            </span>
            Eternal Boundaries
          </Link>
          <p className="mt-3 max-w-[340px] text-[16px] leading-[1.55] text-[#c0bbc3]">
            Threats explained. Compliance mapped. Boundary decisions made easier
            to see and understand.
          </p>
          <small className="mt-3 block text-[12px] uppercase tracking-[0.07em] text-[#a19ba5]">
            IT networks · Industrial OT · Control mapping
          </small>
        </div>
        <div className="flex items-center gap-5 text-[12px] text-[#d0cbd2] max-[640px]:w-full max-[640px]:justify-between">
          <span>Planning a security review?</span>
          <a
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-[var(--paper-purple)] px-[15px] text-[12px] font-[650] !text-white transition-[background,transform] duration-150 hover:-translate-y-px hover:bg-[#4820b3]"
            href="#contact"
          >
            Talk to our team <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-7 border-b border-white/[0.14] pb-[23px] pt-[25px] max-[640px]:grid-cols-2 max-[640px]:gap-y-[23px]">
        {columns.map(([title, links]) => (
          <div key={title as string} className="grid content-start gap-2">
            <strong className="mb-[3px] text-[12px] uppercase tracking-[0.1em] text-[#aaa4ad]">
              {title as string}
            </strong>
            {(links as readonly string[]).map((link) => (
              <a
                key={link}
                className={footerLink}
                href={
                  link.includes("Compliance") ||
                  link.includes("NIST") ||
                  link.includes("SOC")
                    ? "#compliance"
                    : link.includes("boundary") || link.includes("gate")
                      ? "#how-it-works"
                      : link.includes("Threat") || link.includes("Vulnerability")
                        ? "#platform"
                        : "#contact"
                }
              >
                {link}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-between gap-5 pt-[15px] text-[12px] text-[#aaa4ad] max-[640px]:flex-col max-[640px]:items-start">
        <span>
          © 2026 Eternal Boundaries. Early product; capabilities are evolving.
        </span>
        <div className="flex gap-[18px] max-[640px]:flex-wrap max-[640px]:gap-[14px]">
          <a href="#contact" className={footerLink}>
            Privacy
          </a>
          <a href="#contact" className={footerLink}>
            Terms
          </a>
          <a href="#contact" className={footerLink}>
            Contact
          </a>
          <Link href="/login" className={footerLink}>
            Sign in ↗
          </Link>
        </div>
      </div>
    </footer>
  );
}
