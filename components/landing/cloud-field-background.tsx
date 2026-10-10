"use client";

import dynamic from "next/dynamic";

// ThreeUI PortalFieldCollection (cloud-field variant) — raw-WebGL cloud field.
// Exact configured usage from the source brief. Loaded client-only: the effect
// touches WebGL/window and ships its own three.js runtime.
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

/**
 * Full-bleed cloud-field background. The parent should be positioned
 * (relative/absolute) and sized; this fills it.
 */
export function CloudFieldBackground({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
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
