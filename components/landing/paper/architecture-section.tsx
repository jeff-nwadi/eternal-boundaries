const items = [
  [
    "Observe",
    "Bring threat signals, system exposure, and network events into one view.",
  ],
  [
    "Explain",
    "Follow a threat from an outside signal to the system it may affect.",
  ],
  ["Enforce", "Apply boundary rules and see each allow or block decision."],
  [
    "Evidence",
    "Connect findings to controls, suggested fixes, and a review trail.",
  ],
];

export function ArchitectureSection() {
  return (
    <section
      id="security"
      className="mx-auto w-[calc(100%-40px)] pb-[42px] pt-[55px] sm:w-[min(100%-40px,700px)] sm:pb-[62px] sm:pt-[77px] lg:w-[min(1248px,calc(100%-64px))]"
    >
      <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
        Built around the boundary
      </span>
      <h2 className="pb-4 text-[30px] sm:text-[34px]">
        A clear line through <br /> a complex stack.
      </h2>
      <div className="grid grid-cols-2 border-t border-[var(--paper-line)] sm:grid-cols-4">
        {items.map(([title, text]) => (
          <article
            data-motion-kind="architecture"
            key={title}
            className="pb-[13px] pr-[10px] pt-[15px] [&+article]:border-l [&+article]:border-[var(--paper-line)] [&+article]:pl-3 [&:nth-child(3)]:border-l-0 [&:nth-child(3)]:border-t [&:nth-child(3)]:border-[var(--paper-line)] [&:nth-child(3)]:pl-0 [&:nth-child(4)]:border-t [&:nth-child(4)]:border-[var(--paper-line)] sm:pb-1 sm:pr-[21px] sm:pt-[19px] sm:[&+article]:pl-5 sm:[&:nth-child(3)]:border-l sm:[&:nth-child(3)]:border-t-0 sm:[&:nth-child(3)]:pl-5 sm:[&:nth-child(4)]:border-t-0"
          >
            <h3 className="text-[13px] font-[650] tracking-[-0.015em] [font-family:var(--font-inter)]" data-motion-cue>
              {title}
            </h3>
            <p className="mt-[6px] text-[16px] leading-[1.5] text-[var(--paper-muted)]">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
