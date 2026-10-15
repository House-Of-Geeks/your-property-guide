import Link from "next/link";
import { ArrowRight, ClipboardList, Landmark, MapPinned, Wallet } from "lucide-react";
import type { ComponentType } from "react";
import { NumbersPanel } from "@/components/interactive/NumbersPanel";
import { TOOLS, TOOL_GROUPS } from "@/lib/tools";
import { BandLead, BandTitle, Eyebrow } from "./parts";
import { SHELL } from "./shell";

// The tools band (v6): the live selling-costs calculator, featured large,
// then the tools that answer the next questions. Titles and descriptions come
// from src/lib/tools.ts, the same list the /tools page shows.

const MORE: { href: string; icon: ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" }> }[] = [
  { href: "/stamp-duty-calculator", icon: Landmark },
  { href: "/borrowing-power-calculator", icon: Wallet },
  { href: "/tools/agent-proposal-worksheet", icon: ClipboardList },
  { href: "/suburbs", icon: MapPinned },
];

export function CampaignTools() {
  const cards = MORE.map(({ href, icon }) => {
    const tool = TOOL_GROUPS.flatMap((g) => g.tools).find((t) => t.href === href);
    if (!tool) throw new Error(`${href} is not in src/lib/tools.ts`);
    // The hub lists them in title case; sentence case here.
    const title = tool.title.charAt(0) + tool.title.slice(1).toLowerCase();
    return { href, icon, title, description: tool.description };
  });

  return (
    <section aria-labelledby="campaign-tools-title" className="bg-cream py-20 sm:py-28">
      <div className={SHELL}>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-16">
          <div className="lg:col-span-7">
            <Eyebrow>Free tools, no sign-up</Eyebrow>
            <BandTitle className="mt-5">
              <span id="campaign-tools-title">Know your number before anyone quotes you.</span>
            </BandTitle>
          </div>
          <BandLead className="lg:col-span-5">
            Start with what selling really costs in your state. Drag the sliders and the answer updates as you go. Nothing you enter leaves this page.
          </BandLead>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <NumbersPanel tools={["sell"]} from="home-tools" />
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            {cards.map((c) => (
              <li key={c.href}>
                <Link href={c.href} className="group flex h-full items-start gap-4 rounded-3xl border border-line bg-white p-5 transition-shadow hover:shadow-card-hover">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sand text-eucalyptus">
                    <c.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-semibold text-ink">
                      {c.title}
                      <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                    <span className="mt-1 block text-sm leading-snug text-ink-muted">{c.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <Link href="/tools" className="mt-8 inline-flex items-center gap-1.5 text-base font-semibold text-ink underline decoration-line-strong underline-offset-4 hover:decoration-ink">
          See all {TOOLS.length} tools <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
