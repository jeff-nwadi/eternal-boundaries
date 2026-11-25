"use client";

import * as React from "react";
import { animate, createAnimatable, stagger } from "animejs";

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

    // 1) Hero entrance. Text (headline, subhead, actions, note) renders static —
    // per request, no text animations. Only the non-text preview reveals.
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

    // 2) Scroll-reveal animations for cards/sections removed per request — cards
    // render static (no rise-in). Hover micro-interactions below remain.

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

    // 5) PlatformSection card-icon draw animation removed per request.

    // 6) Hero panel interactions (all anime.js):
    //   - a subtle, always-on ambient drift of the grid,
    //   - the grid parallax-shifts toward the cursor,
    //   - a purple spotlight that trails the cursor and fades in/out.
    const heroPanel = page.querySelector<HTMLElement>("[data-hero-panel]");
    const heroGrid = heroPanel?.querySelector<HTMLElement>("[data-hero-grid]") ?? null;
    const heroGlow = heroPanel?.querySelector<HTMLElement>("[data-hero-glow]") ?? null;
    if (heroPanel && heroGrid && heroGlow) {
      // Ambient: slow, seamless grid drift (46px = one tile, so the loop has no
      // visible jump). X and Y use different periods for an organic feel.
      run(heroGrid, {
        backgroundPositionX: ["0px", "46px"],
        duration: 32000,
        loop: true,
        ease: "linear",
      });
      run(heroGrid, {
        backgroundPositionY: ["0px", "46px"],
        duration: 46000,
        loop: true,
        ease: "linear",
      });

      // Parallax follow for the grid (small amplitude) and the glow spotlight.
      // createAnimatable gives the same smooth trailing follow as the auth-page
      // shader lerp; the glow's opacity is driven here too (no CSS transition).
      const gridFollow = createAnimatable(heroGrid, { x: 900, y: 900, ease: "out(4)" });
      const glowFollow = createAnimatable(heroGlow, {
        x: 460,
        y: 460,
        opacity: 420,
        ease: "out(3)",
      });

      let placed = false;
      const onMove = (event: PointerEvent) => {
        const rect = heroPanel.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        if (!placed) {
          // Snap to the first position so it doesn't slide in from the corner.
          glowFollow.x(x, 0);
          glowFollow.y(y, 0);
          placed = true;
        } else {
          glowFollow.x(x);
          glowFollow.y(y);
        }
        glowFollow.opacity(1);
        // Grid drifts a few px toward the cursor (parallax from panel centre).
        gridFollow.x((x - rect.width / 2) * 0.02);
        gridFollow.y((y - rect.height / 2) * 0.02);
      };
      const onLeave = () => {
        placed = false;
        glowFollow.opacity(0);
        gridFollow.x(0);
        gridFollow.y(0);
      };
      heroPanel.addEventListener("pointermove", onMove);
      heroPanel.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        heroPanel.removeEventListener("pointermove", onMove);
        heroPanel.removeEventListener("pointerleave", onLeave);
      });
    }

    // If the user turns on reduced-motion mid-session, finish everything.
    const finishForReducedMotion = (event: MediaQueryListEvent) => {
      if (!event.matches) return;
      active.forEach((animation) => animation.complete(true));
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
