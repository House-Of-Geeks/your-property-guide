import { SectionHeading } from "@/components/premium";
import { AgentChecks, AgentFinder } from "@/components/interactive/AgentFinder";
import { GuideShelf } from "@/components/interactive/GuideShelf";
import { MoveProvider } from "@/components/interactive/move-context";
import { NumbersPanel } from "@/components/interactive/NumbersPanel";
import { PlanBuilderLive } from "@/components/interactive/PlanBuilderLive";
import { HomeHero } from "./HomeHero";
import { EditorBand, LatestGuides } from "./shared";
import { SHELL } from "./shell";

// The homepage (v5, 14 Oct 2026). Andy kept the light "Buy or sell property
// with confidence" first screen with the guides as books, and asked for
// something people want to use. So after the promise, every band is a thing
// to do: run your numbers, get your next three steps, look inside the
// guides, find your agent. One switch in the hero (selling, buying, both)
// sets them all; each still works on its own.

export function Homepage({ guideCount }: { guideCount: number }) {
  return (
    <MoveProvider>
      <HomeHero />

      <section id="numbers" className="scroll-mt-20 bg-surface-warm py-16 sm:py-24">
        <div className={SHELL}>
          <SectionHeading title="Run your numbers" intro="Drag the sliders and the answer updates as you go. Nothing you enter leaves this page." />
          <div className="mt-10 sm:mt-12">
            <NumbersPanel from="home-numbers" />
          </div>
        </div>
      </section>

      <section id="plan" className="scroll-mt-20 py-16 sm:py-24">
        <div className={SHELL}>
          <SectionHeading title="Your next three steps" intro="Answer three questions and your plan rewrites itself. Open the full plan when it looks right." />
          <div className="mt-10 sm:mt-12">
            <PlanBuilderLive />
          </div>
        </div>
      </section>

      <section id="guides" className="scroll-mt-20 bg-surface-warm py-16 sm:py-24">
        <div className={SHELL}>
          <SectionHeading title="Read the whole thing, free" intro="Two complete guides, ten chapters each, with the costs and rules for your state." />
          <div className="mt-12 sm:mt-16">
            <GuideShelf />
          </div>
        </div>
      </section>

      <section id="agent" className="tone-dark scroll-mt-20 bg-surface-inverse py-16 sm:py-24">
        <div className={`${SHELL} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
          <div className="lg:col-span-7">
            <h2 className="max-w-2xl text-4xl leading-[1.05] tracking-[-0.03em] text-ink sm:text-5xl">When you’re ready, one proven local agent</h2>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
              We introduce you to one agent who covers your suburb, and only when you ask. Every agent we introduce has passed four checks.
            </p>
            <div className="mt-10">
              <AgentChecks />
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-2">
            <AgentFinder />
          </div>
        </div>
      </section>

      <EditorBand guideCount={guideCount} tone="light" />
      <LatestGuides />
    </MoveProvider>
  );
}
