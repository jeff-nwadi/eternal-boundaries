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
      className="mx-auto w-[min(1248px,calc(100%-64px))] pb-[62px] pt-[77px] max-[900px]:w-[min(100%-40px,700px)] max-[640px]:w-[calc(100%-40px)] max-[640px]:pb-[42px] max-[640px]:pt-[55px]"
    >
      <span className="mb-4 block text-[12px] font-semibold uppercase tracking-[0.12em] text-[var(--paper-purple)]">
        Built around the boundary
      </span>
      <h2 className="mb-[33px] text-[34px] max-[640px]:text-[30px]">
        A clear line through a complex stack.
      </h2>
      <div className="grid grid-cols-4 border-t border-[var(--paper-line)] max-[640px]:grid-cols-2">
        {items.map(([title, text]) => (
          <article
            data-motion-kind="architecture"
            key={title}
            className="pb-1 pr-[21px] pt-[19px] [&+article]:border-l [&+article]:border-[var(--paper-line)] [&+article]:pl-5 max-[640px]:pb-[13px] max-[640px]:pr-[10px] max-[640px]:pt-[15px] max-[640px]:[&+article]:pl-3 max-[640px]:[&:nth-child(3)]:border-l-0 max-[640px]:[&:nth-child(3)]:border-t max-[640px]:[&:nth-child(3)]:border-[var(--paper-line)] max-[640px]:[&:nth-child(3)]:pl-0 max-[640px]:[&:nth-child(4)]:border-t max-[640px]:[&:nth-child(4)]:border-[var(--paper-line)]"
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
