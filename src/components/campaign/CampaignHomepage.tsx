import { FOUNDER } from "@/lib/founder";
import { planPreview } from "@/lib/plans/preview";
import { MoveProvider } from "@/components/interactive/move-context";
import { CampaignHero } from "./CampaignHero";
import { FinalCta } from "./FinalCta";
import { FounderBand, type FounderStat } from "./FounderBand";
import { HamiltonCaseStudy } from "./HamiltonCaseStudy";
import { HOME_MOVES } from "./moves";
import { OneAgentMatch } from "./OneAgentMatch";
import { TryItNow } from "./TryItNow";
import { TwoGuides } from "./TwoGuides";

// The homepage (19 Oct 2026; v6 campaign line from 15 Oct). The order follows
// one progression: understand the offer (the hero and its plan card), use
// something (the calculator and the tools that settle the next decision),
// see the evidence (the Hamilton example, then Andy and the figures), and
// choose the next step (one agent, the two guides, the closing line).
// Picking selling, buying or both in the hero re-points every part that
// depends on it, and the header and phone bar too. BRAND.md §14 has the rules.

export function CampaignHomepage({ guidesAndTools }: { guidesAndTools: number }) {
  // The only headline figures the site uses: Andy's, ours, and a live count.
  const stats: FounderStat[] = [
    FOUNDER.salesStat,
    { value: "1 agent", label: "for each job you ask us to help with, never a list" },
    { value: "0%", label: "of agent commission taken by us" },
    { value: String(guidesAndTools), label: "free guides and tools, no sign-up" },
  ];
  // Built on the server from real plans, so the hero's preview matches what the plan gives.
  const previews = {
    selling: planPreview(HOME_MOVES.selling.sample),
    buying: planPreview(HOME_MOVES.buying.sample),
    both: planPreview(HOME_MOVES.both.sample),
  };
  return (
    <MoveProvider publish>
      <CampaignHero previews={previews} />
      <TryItNow />
      <HamiltonCaseStudy />
      <FounderBand stats={stats} />
      <OneAgentMatch />
      <TwoGuides />
      <FinalCta />
    </MoveProvider>
  );
}
