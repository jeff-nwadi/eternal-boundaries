import Link from "next/link";
import { FOOTER_CONTENT as copy, SITE } from "@/lib/content";

/** Shared site footer. The monogram and marked routes remain placeholders. */
export function Footer() {
  return (
    <footer className="mx-auto mb-5 mt-3 w-[min(100%-32px,1480px)] rounded-[28px] bg-foreground px-5 py-6 text-background sm:px-8 sm:py-8 lg:px-10">
      <div className="pb-5">
        <p className="text-base font-medium leading-6">{copy.mapping}</p>
        <p className="mt-1 text-sm text-background/60">{copy.mappingCaption}</p>
      </div>
      <div className="h-px w-full bg-background/[0.14]" />

      <div className="grid grid-cols-1 gap-x-8 gap-y-9 py-8 sm:grid-cols-2 xl:grid-cols-[minmax(220px,1.4fr)_repeat(4,minmax(0,1fr))]">
        <div className="sm:col-span-2 xl:col-span-1">
          <Link href="/" aria-label={SITE.name} className="group inline-flex items-center gap-3 rounded-md font-heading text-lg font-semibold focus-visible:outline-2 focus-visible:outline-accent-foreground">
            <span aria-hidden="true" className="grid size-9 place-items-center rounded-xl bg-background/[0.1] text-base transition-transform duration-200 group-hover:rotate-3">
              {copy.logoMark}
            </span>
            <span>{SITE.name}</span>
          </Link>
          {/* Placeholder monogram until the approved brand mark is supplied. */}
        </div>

        {copy.columns.map((column) => (
          <nav key={column.title} aria-label={column.title} className="grid content-start justify-items-start gap-3">
            <h2 className="mb-1 text-xs font-medium uppercase tracking-[0.16em] text-background/55">
              {column.title}
            </h2>
            {column.links.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                title={"placeholder" in item && item.placeholder ? `${item.label} page coming later` : undefined}
                className="group inline-flex min-h-6 items-center gap-2 text-sm text-background/75 transition-colors duration-200 hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-accent-foreground"
              >
                <span className="transition-transform duration-200 group-hover:translate-x-0.5">
                  {item.label}
                </span>
                {"comingSoon" in item && item.comingSoon ? (
                  <span className="rounded-full bg-background/[0.1] px-2 py-0.5 text-[10px] text-background/65">
                    Coming soon
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        ))}
      </div>

      <div className="flex flex-col gap-4 border-t border-background/[0.14] pt-5 text-sm text-background/60 sm:flex-row sm:items-center sm:justify-between">
        <p>{copy.copyright}</p>
        <nav aria-label="Legal links" className="flex items-center gap-5">
          {copy.legalLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              title={item.placeholder ? `${item.label} page coming later` : undefined}
              className="transition-colors duration-200 hover:text-accent focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
