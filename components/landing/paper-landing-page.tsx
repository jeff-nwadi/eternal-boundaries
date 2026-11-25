import { PaperMotionEffects } from "./paper-motion-effects";
import { SiteHeader } from "./paper/site-header";
import { Hero } from "./paper/hero";
import { PlatformSection } from "./paper/platform-section";
import { BoundarySection } from "./paper/boundary-section";
import { ComplianceSection } from "./paper/compliance-section";
import { GateSection } from "./paper/gate-section";
import { ArchitectureSection } from "./paper/architecture-section";
import { ExplorerSection } from "./paper/explorer-section";
import { ClosingCTA } from "./closing-cta";

export function PaperLandingPage() {
  return (
    <div className="paper-root">
      <SiteHeader />
      <main data-paper-motion-root>
        <PaperMotionEffects />
        <Hero />
        <PlatformSection />
        {/* Boundary + Compliance hide on mobile via their own section class so they
            stay direct children of <main> and keep their scroll animations. */}
        <BoundarySection />
        <ComplianceSection />
        <GateSection />
        <ArchitectureSection />
        <ExplorerSection />
        <ClosingCTA />
      </main>
    </div>
  );
}
