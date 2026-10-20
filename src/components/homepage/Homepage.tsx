import { MoveProvider } from "@/components/interactive/move-context";
import { CaseNote } from "./CaseNote";
import { FounderNote } from "./FounderNote";
import { GuideShelf } from "./GuideShelf";
import { HomeHero } from "./HomeHero";
import { IntroductionsBand } from "./IntroductionsBand";
import { QuestionDesk } from "./QuestionDesk";
import { StartPlanner } from "./StartPlanner";

// The homepage (20 Oct 2026, "Clear decisions": Andy's approved design,
// replacing the 15 Oct campaign-led homepage). One progression: know what
// matters (the opening), start where you are (three starting points and the
// full plan), make sense of it (four good questions), read the guides, see
// one example in practice, meet the person behind the guides, and choose
// personal help only if you want it. Picking buying, selling or both in the
// planner re-points the rest of the page, the header and the phone bar.
// BRAND.md §14 has the rules.

export function Homepage() {
  return (
    <MoveProvider publish>
      <HomeHero />
      <StartPlanner />
      <QuestionDesk />
      <GuideShelf />
      <CaseNote />
      <FounderNote />
      <IntroductionsBand />
    </MoveProvider>
  );
}
