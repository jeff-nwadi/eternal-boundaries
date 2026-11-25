import Link from "next/link";
import { FOOTER_CONTENT as copy, SITE } from "@/lib/content";

/** Shared site footer. The monogram and marked routes remain placeholders. */
export function Footer() {
  return (
    <footer className="mt-16 w-full border-t border-[#262130] bg-[#16131c] text-[#efedf4] sm:mt-24">
      <div className="mx-auto w-full max-w-[1480px] px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
      <div className="pb-5">
        <p className="text-base font-medium leading-6">{copy.mapping}</p>
        <p className="mt-1 text-sm text-[#9b95a8]">{copy.mappingCaption}</p>
      </div>
      <div className="h-px w-full bg-white/10" />

      <div className="grid grid-cols-1 gap-x-8 gap-y-9 py-8 sm:grid-cols-2 lg:grid-cols-[minmax(180px,1.2fr)_repeat(4,minmax(0,1fr))]">
        <div className="sm:col-span-2 lg:col-span-1" data-placeholder={copy.logoPlaceholder || undefined}>
          <Link href="/" aria-label={SITE.name} className="group inline-flex items-center gap-3 rounded-md font-heading text-lg font-semibold focus-visible:outline-2 focus-visible:outline-[#b9a3f5]">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-white/[0.08] text-base text-[#c4b2f0] transition-transform duration-200 group-hover:rotate-3">
              {copy.logoMark}
            </span>
            <span>{SITE.name}</span>
          </Link>
          {/* Placeholder monogram until the approved brand mark is supplied. */}
        </div>

        {copy.columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="grid content-start justify-items-start gap-3">
            <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-[#8b8597]">
              {column.title}
            </h2>
            {column.links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                title={"placeholder" in item && item.placeholder ? `${item.label} page coming later` : undefined}
                className="group inline-flex min-h-6 items-center gap-2 text-sm text-[#b8b2c4] transition-colors duration-200 hover:text-[#d6c9ff] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#b9a3f5]"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {item.label}
                </span>
                {"comingSoon" in item && item.comingSoon ? (
                  <span className="rounded-full bg-white/[0.08] px-2 py-0.5 text-[10px] text-[#c4b2f0]">
                    Coming soon
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-white/10 pt-5 text-sm text-[#9b95a8] sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.copyright}</p>
        <nav aria-label="Legal links" className="flex items-center gap-5">
          {copy.legalLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              title={item.placeholder ? `${item.label} page coming later` : undefined}
              className="transition-colors duration-200 hover:text-[#d6c9ff] focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-[#b9a3f5]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      </div>
    </footer>
  );
}
