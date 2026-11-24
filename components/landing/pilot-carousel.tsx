"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { CLOSING_CTA_CONTENT as copy } from "@/lib/content";

export function PilotCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const slides = copy.slides;
  const isPaused = paused || hovered || focusWithin || reducedMotion;

  useEffect(() => {
    if (isPaused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [isPaused, slides.length]);

  function move(direction: -1 | 1) {
    setActive((current) => (current + direction + slides.length) % slides.length);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      move(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      move(1);
    }
  }

  return (
    <section
      ref={rootRef}
      aria-label={copy.carouselLabel}
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocusCapture={() => setFocusWithin(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      className="relative flex min-h-[310px] flex-col rounded-3xl border border-foreground/10 bg-foreground/[0.06] p-5 outline-none focus-visible:outline-2 focus-visible:outline-accent-foreground sm:min-h-[360px] sm:p-8"
    >
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-sm font-medium text-foreground/60">{copy.carouselTitle}</h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label={copy.previousLabel}
            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-foreground"
          >
            <ChevronLeft aria-hidden="true" className="size-4 transition-transform duration-200 hover:-translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label={copy.nextLabel}
            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-foreground"
          >
            <ChevronRight aria-hidden="true" className="size-4 transition-transform duration-200 hover:translate-x-0.5" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? copy.playLabel : copy.pauseLabel}
            aria-pressed={paused}
            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent-foreground"
          >
            {paused ? <Play aria-hidden="true" className="size-4" /> : <Pause aria-hidden="true" className="size-4" />}
          </button>
        </div>
      </div>

      <div className="relative mt-8 flex-1" aria-live={isPaused ? "polite" : "off"}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
            className="absolute inset-0 flex flex-col"
          >
              <span className="font-mono text-xs tracking-[0.16em] text-foreground/60">
              {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
            </span>
            <p className="mt-5 max-w-lg text-balance font-heading text-2xl font-medium leading-snug sm:text-3xl">
              {slides[active].lead}{" "}
              <span className="rounded-sm bg-accent/60 px-1 text-accent-foreground">
                {slides[active].highlight}
              </span>{" "}
              {slides[active].rest}
            </p>
            <p className="mt-auto pt-6 text-sm leading-6 text-foreground/65">
              {slides[active].caption}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center gap-2" aria-label={`${copy.slideLabel} ${active + 1}`}>
        {slides.map((slide, index) => (
          <button
            key={slide.caption}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`${copy.slideLabel} ${index + 1}`}
            aria-pressed={active === index}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-accent-foreground ${
              active === index ? "w-8 bg-accent-foreground" : "w-4 bg-foreground/20 hover:bg-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
