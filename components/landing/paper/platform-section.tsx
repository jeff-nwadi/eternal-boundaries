import { Waypoints, ShieldAlert, ClipboardCheck, type LucideIcon } from "lucide-react";

import { SectionHeading } from "./section-heading";

const cards: {
  id: string;
  title: string;
  text: string;
  link: string;
  icon: LucideIcon;
}[] = [
  {
    id: "01 / Threat intelligence",
    title: "Follow the whole chain",
    text: "Connect an alert to the attacker, tools, weakness, and system at risk. See why it matters.",
    link: "Trace an attack path ↗",
    icon: Waypoints,
  },
  {
    id: "02 / Vulnerabilities",
    title: "Prioritize the fix",
    text: "Review weak spots by severity, affected system, and exposure, with clear next steps.",
    link: "Explore vulnerability review ↗",
    icon: ShieldAlert,
  },
  {
    id: "03 / Compliance mapping",
    title: "Show your coverage",
    text: "Map findings to NIST SP 800-53 and SOC 2. See evidence, gaps, and what needs review.",
    link: "View the control map ↗",
    icon: ClipboardCheck,
  },
];

export function PlatformSection() {
  return (
    <section
      id="platform"
      className="mx-auto w-[calc(100%-40px)] pb-[52px] pt-[60px] sm:w-[min(100%-40px,700px)] sm:pb-[72px] sm:pt-[82px] lg:w-[min(1248px,calc(100%-64px))]"
    >
      <SectionHeading
        title={
          <>
            Three views.
            <br className="hidden sm:block" /> One clear picture.
          </>
        }
        subtitle="Move from what happened to what matters, then to what to do next — with the evidence in one readable place."
      />
      <div className="grid grid-cols-[minmax(0,340px)] justify-start gap-4 sm:grid-cols-[repeat(2,minmax(0,320px))] sm:justify-center sm:gap-[18px] lg:grid-cols-[repeat(3,minmax(0,320px))] lg:justify-between">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              className="relative flex min-h-[330px] flex-col overflow-hidden rounded-[20px] border border-[#efe6d4] p-[18px] [background:linear-gradient(165deg,#fbf6ea_0%,#f6ecd4_100%)] sm:min-h-[230px] sm:last:col-[1/-1] sm:last:w-[min(100%,320px)] sm:last:justify-self-center lg:min-h-[360px] lg:p-[26px] lg:last:col-auto lg:last:w-auto lg:last:justify-self-auto"
              data-motion-kind="architecture"
              data-platform-card
              key={card.id}
            >
              <Icon
                className="pointer-events-none absolute bottom-4 left-0 right-0 z-0 mx-auto w-[150px] origin-bottom text-[#c79a3e] opacity-[0.26]"
                data-platform-icon
                size={150}
                strokeWidth={1}
                aria-hidden="true"
              />
              <span className="relative z-[1] pb-2 text-[12px] uppercase text-[var(--paper-ink)]">
                {card.id}
              </span>
              <h3 className="relative z-[1] mt-[10px] pb-2 text-[22px] font-[640] text-[var(--paper-ink)] sm:mt-[14px]" data-motion-cue>
                {card.title}
              </h3>
              <p className="relative z-[1] mt-[15px] max-w-[380px] text-[16px] leading-[1.55] text-[var(--paper-muted)] [text-wrap:pretty]">
                {card.text}
              </p>
              <a
                className="relative z-[1] mt-auto inline-flex w-fit items-center gap-2 text-[13px] font-semibold !text-black transition-colors duration-150 hover:text-[var(--paper-purple)] sm:pt-4"
                href={
                  card.id.startsWith("01")
                    ? "#how-it-works"
                    : card.id.startsWith("02")
                      ? "#pricing"
                      : "#compliance"
                }
              >
                {card.link}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
