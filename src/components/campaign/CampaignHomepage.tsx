import { FOUNDER } from "@/lib/founder";
import { AgreementCheckBanner } from "./AgreementCheckBanner";
import { CampaignHero, type HeroStat } from "./CampaignHero";
import { CampaignSteps } from "./CampaignSteps";
import { CampaignTools } from "./CampaignTools";
import { FinalCta } from "./FinalCta";
import { FounderBand } from "./FounderBand";
import { OneAgentMatch } from "./OneAgentMatch";
import { SamePlaybook } from "./SamePlaybook";
import { TwoGuides } from "./TwoGuides";

// The homepage (v6, 15 Oct 2026, "It's the campaign that wins"): the core
// line and one field, then the same playbook at any price, the five steps,
// Andy's story, the tools, one agent, the agreement check, the two guides
// and the closing line. BRAND.md §14 has the rules.

export function CampaignHomepage({ guidesAndTools }: { guidesAndTools: number }) {
  // The only headline figures the site uses: Andy's, ours, and a live count.
  const stats: HeroStat[] = [
    FOUNDER.salesStat,
    { value: "1 agent", label: "for each job you ask us to help with, never a list" },
    { value: "0%", label: "of agent commission taken by us" },
    { value: String(guidesAndTools), label: "free guides and tools, no sign-up" },
  ];
  return (
    <>
      <CampaignHero stats={stats} />
      <SamePlaybook />
      <CampaignSteps />
      <FounderBand />
      <CampaignTools />
      <OneAgentMatch />
      <AgreementCheckBanner />
      <TwoGuides />
      <FinalCta />
    </>
  );
}
