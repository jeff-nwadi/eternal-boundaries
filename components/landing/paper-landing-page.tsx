import { PaperMotionEffects } from "./paper-motion-effects";
import { SiteHeader } from "./paper/site-header";
import { Hero } from "./paper/hero";
import { PlatformSection } from "./paper/platform-section";
import { BoundarySection } from "./paper/boundary-section";
import { ComplianceSection } from "./paper/compliance-section";
import { GateSection } from "./paper/gate-section";
import { ArchitectureSection } from "./paper/architecture-section";
import { PricingSection } from "./paper/pricing-section";
import { ExplorerSection } from "./paper/explorer-section";
import { ClosingCta } from "./paper/closing-cta";
import { SiteFooter } from "./paper/site-footer";

export function PaperLandingPage() {
  return (
    <div className="paper-root">
      <SiteHeader />
      <main data-paper-motion-root>
        <PaperMotionEffects />
        <Hero />
        <PlatformSection />
        <BoundarySection />
        <ComplianceSection />
        <GateSection />
        <ArchitectureSection />
        <ExplorerSection />
        <ClosingCta />
      </main>
      <SiteFooter />
    </div>
  );
}
