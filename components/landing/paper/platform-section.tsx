import { Waypoints, ShieldAlert, ClipboardCheck, type LucideIcon } from "lucide-react";

import styles from "../paper-landing-page.module.css";

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
    <section className={styles.platform} id="platform">
      <div className={styles.sectionHead}>
        <div>
          <span className={styles.kicker}>One signal. Shared context.</span>
          <h2>
            Three views.
            <br />
            One clear picture.
          </h2>
        </div>
        <p>
          Move from what happened to what matters, then to what to do next —
          with the evidence in one readable place.
        </p>
      </div>
      <div className={styles.platformCards}>
        {cards.map((card) => {
          const Icon = card.icon;
          return (
          <article
            className={styles.platformCard}
            data-motion-kind="architecture"
            data-platform-card
            key={card.id}
          >
            <Icon
              className={styles.platformIcon}
              data-platform-icon
              size={150}
              strokeWidth={1}
              aria-hidden="true"
            />
            <span className="text-black">{card.id}</span>
            <h3 data-motion-cue>{card.title}</h3>
            <p>{card.text}</p>
            <a
              className={styles.platformPill}
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
