"use client";

import * as React from "react";
import { animate, stagger } from "animejs";

/**
 * All landing motion is anime.js: an on-load hero entrance, scroll-tracked
 * section reveals (IntersectionObserver → anime), and hover/focus micro-
 * interactions on the diagrams. No CSS keyframes. Respects prefers-reduced-motion.
 */
export function PaperMotionEffects() {
  React.useEffect(() => {
    const page = document.querySelector<HTMLElement>("[data-paper-motion-root]");
    if (!page) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    const active = new Set<ReturnType<typeof animate>>();
    const run = (
      targets: Element | NodeListOf<Element> | Element[],
      properties: Parameters<typeof animate>[1],
    ) => {
      const animation = animate(targets, properties);
      active.add(animation);
      void animation.then(() => active.delete(animation));
      return animation;
    };

    const cleanups: (() => void)[] = [];

    // 1) Hero entrance on load (copy, then the preview).
    const heroCopy = page.querySelector<HTMLElement>("[data-hero-copy]");
    if (heroCopy) {
      const items = heroCopy.querySelectorAll<HTMLElement>(":scope > *");
      run(items, {
        opacity: [0, 1],
        translateY: [18, 0],
        duration: 640,
        delay: stagger(90),
        ease: "out(3)",
      });
    }
    const preview = page.querySelector<HTMLElement>('[data-motion-kind="preview"]');
    if (preview) {
      run(preview, {
        opacity: [0, 1],
        translateY: [26, 0],
        duration: 760,
        delay: 320,
        ease: "out(3)",
      });
    }

    // 2) Scroll-tracked reveals — INDIVIDUAL elements, not whole sections. Each
    // section triggers a staggered rise-in of its own blocks (headings, cards,
    // rows, panels), so items animate one by one rather than as one chunk.
    const UNITS = "article, details, [data-motion-kind]";
    const sections = Array.from(
      page.querySelectorAll<HTMLElement>(":scope > section"),
    ).slice(1);
    const sectionTargets = new Map<Element, HTMLElement[]>();
    const allHidden: HTMLElement[] = [];

    for (const section of sections) {
      // Top-level blocks only: a card/panel animates as one unit, and its inner
      // text is not double-animated.
      const targets = Array.from(
        section.querySelectorAll<HTMLElement>(`h2, h3, p, small, ${UNITS}`),
      ).filter((el) => !el.parentElement?.closest(UNITS));
      if (!targets.length) continue;
      for (const el of targets) {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        allHidden.push(el);
      }
      sectionTargets.set(section, targets);
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const targets = sectionTargets.get(entry.target);
          if (targets && targets.length) {
            run(targets, {
              opacity: [0, 1],
              translateY: [20, 0],
              duration: 620,
              delay: stagger(70),
              ease: "out(3)",
              onComplete: () => {
                for (const el of targets) {
                  el.style.removeProperty("opacity");
                  el.style.removeProperty("transform");
                }
              },
            });
          }
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    for (const section of sections) revealObserver.observe(section);
    cleanups.push(() => revealObserver.disconnect());

    // 3) Hover/focus micro-interactions on diagrams and their signals.
    page.querySelectorAll<HTMLElement>("[data-motion-kind]").forEach((item) => {
      const kind = item.dataset.motionKind;
      const cue = item.querySelectorAll<HTMLElement>("[data-motion-cue]");
      if (!cue.length) return;

      const onEnter = () => {
        switch (kind) {
          case "preview":
          case "threat":
            run(cue, {
              scale: [1, 1.045, 1],
              duration: 560,
              delay: stagger(70),
              ease: "out(2)",
            });
            break;
          case "boundary":
            run(cue, {
              scaleY: [0.45, 1, 0.72, 1],
              duration: 650,
              ease: "inOut(2)",
            });
            break;
          case "compliance":
            run(cue, {
              translateX: [0, 4, 0],
              duration: 430,
              delay: stagger(65),
              ease: "out(2)",
            });
            break;
          case "gate":
            run(cue, { scale: [1, 1.08, 1], duration: 650, ease: "inOut(2)" });
            break;
          case "architecture":
            run(cue, {
              translateY: [0, -3, 0],
              duration: 440,
              delay: stagger(55),
              ease: "out(2)",
            });
            break;
          case "pricing":
          case "cta":
            run(cue, {
              translateX: [0, 3, 0],
              translateY: [0, -2, 0],
              duration: 330,
              ease: "out(2)",
            });
            break;
          case "question":
            run(cue, { scale: [1, 1.3, 1], duration: 240, ease: "out(2)" });
            break;
          case "vulnerability":
            run(cue, {
              translateY: [0, -3, 0],
              duration: 450,
              delay: stagger(80),
              ease: "out(2)",
            });
            break;
          case "controls-preview":
            run(cue, {
              translateX: [0, 3, 0],
              duration: 420,
              delay: stagger(60),
              ease: "out(2)",
            });
            break;
        }
      };

      item.addEventListener("pointerenter", onEnter);
      item.addEventListener("focusin", onEnter);
      cleanups.push(() => {
        item.removeEventListener("pointerenter", onEnter);
        item.removeEventListener("focusin", onEnter);
      });
    });

    // 4) Link icon nudges.
    page.querySelectorAll<HTMLElement>("a:has(svg)").forEach((link) => {
      const icon = link.querySelector<SVGElement>("svg");
      if (!icon) return;
      const move = () =>
        run(icon, {
          translateX: 2,
          translateY: -1,
          duration: 160,
          ease: "out(2)",
        });
      const reset = () =>
        run(icon, {
          translateX: 0,
          translateY: 0,
          duration: 180,
          ease: "out(2)",
        });
      link.addEventListener("pointerenter", move);
      link.addEventListener("pointerleave", reset);
      link.addEventListener("focusin", move);
      link.addEventListener("focusout", reset);
      cleanups.push(() => {
        link.removeEventListener("pointerenter", move);
        link.removeEventListener("pointerleave", reset);
        link.removeEventListener("focusin", move);
        link.removeEventListener("focusout", reset);
      });
    });

    // If the user turns on reduced-motion mid-session, finish everything and
    // make sure any hidden sections are shown.
    const finishForReducedMotion = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      active.forEach((animation) => animation.complete(true));
      for (const el of allHidden) {
        el.style.removeProperty("opacity");
        el.style.removeProperty("transform");
      }
    };
    reducedMotion.addEventListener("change", finishForReducedMotion);

    return () => {
      reducedMotion.removeEventListener("change", finishForReducedMotion);
      cleanups.forEach((cleanup) => cleanup());
      active.forEach((animation) => animation.pause());
    };
  }, []);

  return null;
}
