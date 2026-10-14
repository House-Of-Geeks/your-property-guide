import { describe, expect, it } from "vitest";
import { buildPlan, helpHref, planHref, PLAN_DISCLAIMER } from "@/lib/plans/engine";
import {
  BUY_STAGES,
  BUYER_TYPES,
  HELP_PREFERENCES,
  MOVE_ORDERS,
  SELL_STAGES,
  STATE_OPTIONS,
  TIMEFRAMES,
  answersFromParams,
  answersToParams,
  type PlanAnswers,
} from "@/lib/plans/questions";
import { NEXT_STEP_SLUGS, nextStepFor } from "@/lib/next-steps";
import { routeExists } from "../helpers/routes";

// Every combination of answers the plan builder can produce.
function allAnswers(): PlanAnswers[] {
  const out: PlanAnswers[] = [];
  const states = [null, ...STATE_OPTIONS.map((s) => s.id)];
  for (const state of states) {
    for (const t of TIMEFRAMES) {
      for (const ss of SELL_STAGES) out.push({ journey: "selling", state, timeframe: t.id, sellStage: ss.id });
      for (const bs of BUY_STAGES)
        for (const bt of BUYER_TYPES)
          for (const h of HELP_PREFERENCES) out.push({ journey: "buying", state, timeframe: t.id, buyStage: bs.id, buyerType: bt.id, help: h.id });
      for (const o of MOVE_ORDERS) out.push({ journey: "buying-and-selling", state, timeframe: t.id, order: o.id });
    }
  }
  return out;
}

describe("next-step plans", () => {
  const all = allAnswers();

  it("always has three next steps, tools, guides, a checklist and questions", () => {
    for (const a of all) {
      const p = buildPlan(a);
      expect(p.nextSteps, JSON.stringify(a)).toHaveLength(3);
      expect(p.tools.length).toBeGreaterThan(0);
      expect(p.guides.length).toBeGreaterThan(0);
      expect(p.checklist.groups.length).toBeGreaterThan(0);
      expect(p.questions.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("links only to pages that exist", () => {
    const hrefs = new Set<string>();
    for (const a of all) {
      const p = buildPlan(a);
      p.nextSteps.forEach((s) => s.link && hrefs.add(s.link.href));
      p.tools.forEach((t) => hrefs.add(t.href));
      p.guides.forEach((g) => hrefs.add(g.href));
      if (p.help.cta) hrefs.add(p.help.cta.href);
    }
    const missing = [...hrefs].filter((h) => !routeExists(h));
    expect(missing).toEqual([]);
  });

  it("never offers an introduction to a seller who has signed with an agent", () => {
    const p = buildPlan({ journey: "selling", state: "QLD", timeframe: "0-3-months", sellStage: "listed" });
    expect(p.help.level).toBe("none");
    expect(p.help.services).toEqual([]);
  });

  it("offers a buyer's agent only to buyers who asked to consider one, and says availability is limited", () => {
    const yes = buildPlan({ journey: "buying", state: "NSW", timeframe: "3-6-months", buyStage: "searching", buyerType: "next-home", help: "buyers-agent" });
    expect(yes.help.level).toBe("offer");
    expect(yes.help.services).toEqual(["buyers-agent"]);
    expect(yes.help.body).toContain("still building our network");
    const self = buildPlan({ journey: "buying", state: "NSW", timeframe: "3-6-months", buyStage: "searching", buyerType: "next-home", help: "self" });
    expect(self.help.level).toBe("available");
    expect(self.help.cta?.href).toBe("/buyers-agents");
  });

  it("gives an early seller a preparation checklist and selling-cost tools, and a seller choosing an agent the interview checklist and worksheet", () => {
    const early = buildPlan({ journey: "selling", state: "VIC", timeframe: "12-plus-months", sellStage: "thinking" });
    expect(early.checklist.title).toBe("Preparation checklist");
    expect(early.tools.map((t) => t.href)).toContain("/selling-costs-calculator");
    expect(early.help.level).toBe("available");
    const choosing = buildPlan({ journey: "selling", state: "VIC", timeframe: "0-3-months", sellStage: "choosing-agent" });
    expect(choosing.checklist.title).toBe("Agent interview checklist");
    expect(choosing.tools.map((t) => t.href)).toContain("/tools/agent-proposal-worksheet");
  });

  it("gives a first home buyer their state's rules", () => {
    const p = buildPlan({ journey: "buying", state: "WA", timeframe: "6-12-months", buyStage: "starting", buyerType: "first-home", help: "self" });
    expect(p.guides.map((g) => g.href)).toContain("/guides/first-home-buyer-wa");
  });

  it("asks for separate introductions for a combined move", () => {
    const p = buildPlan({ journey: "buying-and-selling", state: "SA", timeframe: "0-3-months", order: "undecided" });
    expect(p.help.services).toEqual(["selling-agent", "buyers-agent"]);
    expect(p.help.body).toContain("each needs its own yes");
    expect(p.checklist.title).toBe("A coordinated moving timeline");
    expect(helpHref(["selling-agent", "buyers-agent"], { journey: "buying-and-selling", state: "SA", timeframe: "0-3-months" })).toContain("service=both");
  });

  it("round-trips answers through the result URL, which carries nothing personal", () => {
    const a: PlanAnswers = { journey: "buying", state: "QLD", timeframe: "0-3-months", buyStage: "offer", buyerType: "first-home", help: "unsure" };
    const qs = answersToParams(a);
    expect(answersFromParams((k) => qs.get(k))).toMatchObject(a);
    expect(planHref(a)).toMatch(/^\/plan\/result\?j=buying&s=qld/);
    expect(answersFromParams(() => null)).toBeNull();
    expect(answersFromParams((k) => ({ j: "selling", s: "XX", ss: "nonsense" })[k] ?? null)).toMatchObject({ state: null, sellStage: null });
  });

  it("says it isn't advice or a valuation", () => {
    expect(PLAN_DISCLAIMER).toContain("isn’t personal financial, legal or real estate advice");
    expect(PLAN_DISCLAIMER).toContain("isn’t a valuation");
  });
});

describe("contextual next steps on priority guides and calculators", () => {
  it("exist for the priority pages and link only to real pages", () => {
    for (const slug of ["how-to-choose-a-selling-agent", "selling-costs-calculator", "buyers-agent-cost-australia", "sell-first-or-buy-first"]) {
      expect(nextStepFor(slug), slug).not.toBeNull();
    }
    const missing: string[] = [];
    for (const slug of NEXT_STEP_SLUGS) {
      const s = nextStepFor(slug)!;
      for (const href of [s.primary.href, ...s.secondary.map((x) => x.href), ...(s.help ? [s.help.href] : [])]) {
        if (!routeExists(href)) missing.push(`${slug} -> ${href}`);
      }
    }
    expect(missing).toEqual([]);
  });

  it("keeps personal help optional: the primary action is never the introduction form", () => {
    for (const slug of NEXT_STEP_SLUGS) {
      expect(nextStepFor(slug)!.primary.href.startsWith("/get-help")).toBe(false);
    }
  });
});
