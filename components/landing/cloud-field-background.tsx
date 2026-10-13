"use client";

import * as React from "react";
import dynamic from "next/dynamic";

// ThreeUI PortalFieldCollection (cloud-field variant) — raw-WebGL cloud field.
// Loaded client-only: the effect touches WebGL/window and ships its own three.js
// runtime (~1.7MB across chunks), so we are deliberate about WHEN it loads.
import "@designcodeio/threeui/style.css";

// Import from the component subpath, NOT the package barrel ("@designcodeio/threeui").
// The barrel eagerly pulls every shader, including `temple-night`, which imports
// removed three.js constants (LinearEncoding) and breaks the build. The cloud-field
// path renders via a sandboxed iframe and needs no host three import.
const PortalFieldCollection = dynamic(
  () =>
    import("@designcodeio/threeui/components/PortalFieldCollection").then(
      (m) => m.PortalFieldCollection
    ),
  { ssr: false, loading: () => null }
);

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
  cancelIdleCallback?: (id: number) => void;
};
type SaveDataNavigator = Navigator & { connection?: { saveData?: boolean } };

/**
 * Full-bleed cloud-field background, loaded cost-consciously (Lighthouse):
 *  - skipped entirely on small screens, reduced-motion, and Save-Data, so the
 *    ~1.7MB three.js runtime is never fetched there (and the effect is barely
 *    visible under the hero's dark overlay anyway);
 *  - on capable desktops, deferred to browser-idle so it never blocks first
 *    paint / LCP, then faded in.
 * Until it mounts, the hero still has its background color + gradient overlay.
 */
export function CloudFieldBackground({ className }: { className?: string }) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as SaveDataNavigator).connection?.saveData ?? false;
    if (!wide || reduce || saveData) return;

    const w = window as IdleWindow;
    let idleId = 0;
    let timeoutId = 0;
    const start = () => setShow(true);

    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(start, { timeout: 2500 });
    } else {
      timeoutId = window.setTimeout(start, 1200);
    }

    return () => {
      if (idleId) w.cancelIdleCallback?.(idleId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`${className ?? ""} duration-1000 animate-in fade-in`}
      aria-hidden="true"
    >
      <PortalFieldCollection
        variant="cloud-field"
        hue={0}
        saturation={1.0}
        brightness={1.0}
        className="h-full w-full"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
