import { Waypoints, ShieldAlert, ClipboardCheck, type LucideIcon } from "lucide-react";

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
      className="mx-auto w-[min(1248px,calc(100%-64px))] pb-[72px] pt-[82px] max-[900px]:w-[min(100%-40px,700px)] max-[640px]:w-[calc(100%-40px)] max-[640px]:pb-[52px] max-[640px]:pt-[60px]"
    >
      <div className="mb-[42px] grid grid-cols-[1fr_0.8fr] items-end gap-[42px] max-[640px]:mb-[26px] max-[640px]:grid-cols-1 max-[640px]:gap-[17px]">
        <div>
          <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
            One signal. Shared context.
          </span>
          <h2 className="text-[clamp(30px,3.25vw,42px)] font-[620] max-[640px]:text-[32px]">
            Three views.
            <br /> 
            One clear picture.
          </h2>
        </div>
        <p className="max-w-[470px] text-[16px] leading-[1.6] text-[var(--paper-muted)] [text-wrap:pretty]">
          Move from what happened to what matters, then to what to do next —
          with the evidence in one readable place.
        </p>
      </div>
      <div className="grid grid-cols-[repeat(3,minmax(0,320px))] justify-between gap-[18px] max-[900px]:grid-cols-[repeat(2,minmax(0,320px))] max-[900px]:justify-center max-[640px]:grid-cols-[minmax(0,340px)] max-[640px]:justify-center max-[640px]:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              className="relative flex min-h-[360px] flex-col overflow-hidden rounded-[20px] border border-[#efe6d4] p-[26px] [background:linear-gradient(165deg,#fbf6ea_0%,#f6ecd4_100%)] max-[900px]:min-h-[230px] max-[900px]:p-[18px] max-[900px]:last:col-[1/-1] max-[900px]:last:w-[min(100%,320px)] max-[900px]:last:justify-self-center max-[640px]:min-h-[330px] max-[640px]:p-[18px]"
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
              <span className="relative z-[1] text-[12px] uppercase text-[var(--paper-ink)] pb-2">
                {card.id}
              </span>
              <h3 className="relative z-[1] mt-[14px] text-[22px] font-[640] text-[var(--paper-ink)] pb-2 max-[640px]:mt-[10px]" data-motion-cue>
                {card.title}
              </h3>
              <p className="relative z-[1] mt-[11px] max-w-[380px] text-[16px] leading-[1.55] text-[var(--paper-muted)] [text-wrap:pretty]">
                {card.text}
              </p>
              <a
                className="relative z-[1] mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-[#201d24] py-[10px] pl-[18px] pr-4 text-[13px] font-semibold !text-white transition-colors duration-150 hover:bg-[#332e38]"
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
