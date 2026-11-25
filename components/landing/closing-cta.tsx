import { Reveal } from "@/components/reveal";
import { CLOSING_CTA_CONTENT as copy } from "@/lib/content";
import { DemoRequestForm } from "./demo-request-form";
import { PilotCarousel } from "./pilot-carousel";

export function ClosingCTA() {
  return (
    <section id="contact" className="mx-auto w-full scroll-mt-24 sm:w-[min(100%-32px,1480px)]">
      <div className="closing-cta-glow grid grid-cols-1 gap-9 overflow-hidden rounded-none border-0 px-5 py-7 sm:rounded-[28px] sm:border sm:border-foreground/10 sm:px-8 sm:py-9 lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-12 lg:py-14">
        <div className="min-w-0">
          <h2 className="max-w-xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            {copy.headline}
          </h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-foreground/75 sm:text-lg">
            {copy.subhead}
          </p>
          <DemoRequestForm />
        </div>
        <div>
          <PilotCarousel />
        </div>
      </div>
    </section>
  );
}
