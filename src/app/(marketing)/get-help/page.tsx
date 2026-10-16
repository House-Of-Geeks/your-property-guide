import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import { PhotoHero, HeroTitle, HeroLead } from "@/components/premium";
import { IntroductionForm, type ServiceChoice } from "@/components/journeys/IntroductionForm";
import { HowIntroductionsWork, HowWeChooseAgents } from "@/components/journeys/ServiceSections";
import { SITE_URL } from "@/lib/constants";
import { RESPONSE_WINDOW } from "@/lib/service-model";
import type { AustralianState } from "@/lib/utils/stamp-duty";
import type { Timeframe } from "@/lib/introductions/rules";

// /get-help: the introduction path (Oct 2026). One form for asking to be
// introduced to a selling agent, a buyer's agent, or one of each, with a
// separate permission for each. Pre-filled from plans and guides by query
// string (service, state, timeframe, suburb); nothing personal in the URL.

export const metadata: Metadata = {
  title: "Get personal help: an introduction to a local agent",
  description:
    "Ask to be introduced to one participating selling agent or buyer’s agent. We say who you’d meet and why, show whether we cover your area before you send anything, and only introduce you with your permission.",
  alternates: { canonical: `${SITE_URL}/get-help` },
};

const SERVICES = new Set(["selling-agent", "buyers-agent", "both"]);
const STATES = new Set(["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"]);
const TIMEFRAMES = new Set(["0-3-months", "3-6-months", "6-12-months", "12-plus-months", "researching"]);

export default async function GetHelpPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const service = one("service");
  const state = one("state")?.toUpperCase();
  const timeframe = one("timeframe");
  const suburb = one("suburb");
  const from = one("from");

  return (
    <>
      <PhotoHero
        photo="kitchen"
        breadcrumbs={[{ label: "Get personal help" }]}
        aside={
          <Suspense fallback={null}>
            <IntroductionForm
              defaultService={service && SERVICES.has(service) ? (service as ServiceChoice) : null}
              defaultState={state && STATES.has(state) ? (state as AustralianState) : null}
              defaultTimeframe={timeframe && TIMEFRAMES.has(timeframe) ? (timeframe as Timeframe) : null}
              defaultSuburb={suburb && /^[a-z0-9-]+-[a-z]{2,3}-\d{4}$/.test(suburb) ? suburb : null}
              source={from ? `get-help-${from}`.slice(0, 100) : "get-help"}
            />
          </Suspense>
        }
      >
        <HeroTitle>Get personal help with your move</HeroTitle>
        <HeroLead className="max-sm:mt-4 max-sm:text-base">
          {`Tell us what you need and we’ll introduce you to one participating local agent: a selling agent for an appraisal, or a buyer’s agent who acts for you. Only with your permission, and we tell you before you send anything if we can’t cover your area.`}
        </HeroLead>
        <ul className="mt-8 hidden lg:grid gap-3 text-base sm:text-lg text-ink">
          <li className="border-t border-line pt-3">{`One agent per service, never a list, and never sold to anyone else`}</li>
          <li className="border-t border-line pt-3">{`They contact you the way you choose, normally ${RESPONSE_WINDOW}`}</li>
          <li className="border-t border-line pt-3">{`Free for you. The agent pays us a flat fee for the introduction, whether or not you go ahead, and never a share of their commission`}</li>
        </ul>
        <div className="mt-10 hidden lg:flex items-center gap-4 border-t border-line pt-6 max-w-xl">
          <Image src="/images/agents/andy-mcmaster.jpg" alt="Andy McMaster" width={56} height={56} className="w-14 h-14 rounded-full object-cover object-top shrink-0 ring-2 ring-line" />
          <p className="text-[15px] text-ink-muted leading-snug">
            <span className="font-semibold text-ink">Andy McMaster, founder.</span>{" "}
            {`Our team reads the requests we can’t match straight away, and replies to every one.`}
          </p>
        </div>
      </PhotoHero>
      <HowIntroductionsWork tone="dark" />
      <HowWeChooseAgents tone="light" />
    </>
  );
}
