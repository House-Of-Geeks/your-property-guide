import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { HOME_MOVES, MOVE_ORDER } from "@/components/campaign/moves";
import { HAMILTON, dollars, expectedIncrease } from "@/lib/case-studies";
import { buildPlan } from "@/lib/plans/engine";
import { planPreview } from "@/lib/plans/preview";
import { answersFromParams, editPlanHref, stateOfSuburb, suburbSlugLabel, type PlanAnswers } from "@/lib/plans/questions";
import { AGREEMENT_CHECK } from "@/lib/service-model";
import { routeExists } from "../helpers/routes";

// The homepage's selling / buying / both switch (19 Oct 2026) and the plan's
// edit link: each move talks to the right reader, the preview is a real
// plan, and "Change my answers" keeps every answer.

describe("homepage moves", () => {
  it("cover selling, buying and both, each pointing at its own plan", () => {
    expect(MOVE_ORDER).toEqual(["selling", "buying", "both"]);
    expect(HOME_MOVES.selling.sample.journey).toBe("selling");
    expect(HOME_MOVES.buying.sample.journey).toBe("buying");
    expect(HOME_MOVES.both.sample.journey).toBe("buying-and-selling");
  });

  it("give buyers buying tools and sellers the selling-cost calculator, worksheet and agreement check", () => {
    expect(HOME_MOVES.buying.tools).not.toContain("sell");
    expect(HOME_MOVES.selling.tools).toContain("sell");
    const selling = HOME_MOVES.selling.decide.map((d) => d.href.split("?")[0]);
    expect(selling).toEqual(["/selling-costs-calculator", "/tools/agent-proposal-worksheet", AGREEMENT_CHECK.href]);
    expect(HOME_MOVES.buying.decide.some((d) => d.href.startsWith(AGREEMENT_CHECK.href))).toBe(false);
    expect(HOME_MOVES.both.decide.map((d) => d.href)).toContain("/guides/sell-first-or-buy-first");
  });

  it("keep the agreement check's general-information wording", () => {
    const check = HOME_MOVES.selling.decide.find((d) => d.kind === "call");
    expect(check?.note).toBe(AGREEMENT_CHECK.notAdvice);
  });

  it("say what each tool helps you decide, and link only to real pages", () => {
    for (const id of MOVE_ORDER) {
      for (const d of HOME_MOVES[id].decide) {
        expect(d.decides.length, d.title).toBeGreaterThan(10);
        expect(routeExists(d.href), d.href).toBe(true);
      }
    }
  });

  it("preview the same steps, tools and checklist the plan gives", () => {
    for (const id of MOVE_ORDER) {
      const a = HOME_MOVES[id].sample;
      const plan = buildPlan(a);
      const preview = planPreview(a);
      expect(preview.steps.map((s) => s.title)).toEqual(plan.nextSteps.map((s) => s.title));
      expect(preview.tools.map((t) => t.href)).toEqual(plan.tools.slice(0, 3).map((t) => t.href));
      expect(preview.checklist.title).toBe(plan.checklist.title);
      expect(preview.focus).not.toMatch(/^Your next-step plan/);
    }
  });
});

describe("changing a plan", () => {
  it("reopens every answer, not just the move", () => {
    const a: PlanAnswers = { journey: "buying", state: "QLD", timeframe: "3-6-months", buyStage: "searching", buyerType: "first-home", help: "self", suburb: "hamilton-qld-4007" };
    const href = editPlanHref(a);
    expect(href.startsWith("/plan?")).toBe(true);
    const qs = new URLSearchParams(href.split("?")[1]);
    expect(qs.get("edit")).toBe("1");
    expect(answersFromParams((k) => qs.get(k))).toMatchObject(a);
    expect(new URLSearchParams(editPlanHref(a, "state").split("?")[1]).get("q")).toBe("state");
  });

  it("names a suburb and its state from the slug", () => {
    expect(suburbSlugLabel("hamilton-qld-4007")).toBe("Hamilton, QLD 4007");
    expect(suburbSlugLabel("north-lakes-qld-4509")).toBe("North Lakes, QLD 4509");
    expect(stateOfSuburb("paddington-nsw-2021")).toBe("NSW");
    expect(stateOfSuburb("nowhere")).toBeNull();
  });
});

describe("the Hamilton case study", () => {
  it("uses only the supplied figures", () => {
    expect(HAMILTON.expectedBefore).toBe(490_000);
    expect(HAMILTON.spend).toBe(38_000);
    expect(HAMILTON.expectedAfter).toBe(820_000);
    expect(HAMILTON.place).toBe("Hamilton, Queensland");
    expect(dollars(HAMILTON.expectedBefore)).toBe("$490,000");
    expect(dollars(HAMILTON.spend)).toBe("$38,000");
    expect(dollars(HAMILTON.expectedAfter)).toBe("$820,000");
  });

  it("calls the difference an increase in expected sale price", () => {
    expect(expectedIncrease(HAMILTON)).toBe(330_000);
  });

  it("shows only illustrations, said so in the alt text, and never as the apartment itself", () => {
    expect(HAMILTON.illustrations.length).toBeGreaterThan(0);
    for (const im of HAMILTON.illustrations) {
      expect(im.src).toMatch(/illustration\.jpg$/);
      expect(existsSync(join(process.cwd(), "public", im.src))).toBe(true);
      expect(im.alt.startsWith("Illustration of")).toBe(true);
      expect(im.caption).not.toMatch(/Hamilton|this apartment|the apartment/i);
    }
  });
});

describe("starting a plan", () => {
  // Every plan button (hero, closing band, header, phone menu, phone bar) builds its link here.
  it("carries the move, the state and the suburb, or only the move when no suburb is picked", async () => {
    const { planStartHref } = await import("@/lib/plans/start");
    const hamilton = { slug: "hamilton-qld-4007", state: "QLD" };
    for (const journey of ["selling", "buying", "buying-and-selling"] as const) {
      const withPlace = new URLSearchParams(planStartHref({ journey, place: hamilton, from: "bar-home" }).split("?")[1]);
      expect(Object.fromEntries(withPlace)).toEqual({ j: journey, s: "qld", sub: "hamilton-qld-4007", from: "bar-home" });
      const noPlace = new URLSearchParams(planStartHref({ journey, place: null }).split("?")[1]);
      expect(Object.fromEntries(noPlace)).toEqual({ j: journey });
    }
    expect(planStartHref({ journey: null })).toBe("/plan");
  });

  it("gives the planner what it needs to skip the move and state questions", async () => {
    const { planStartHref } = await import("@/lib/plans/start");
    const qs = new URLSearchParams(planStartHref({ journey: "buying", place: { slug: "hamilton-qld-4007", state: "QLD" } }).split("?")[1]);
    const a = answersFromParams((k) => qs.get(k));
    expect(a).toMatchObject({ journey: "buying", state: "QLD", suburb: "hamilton-qld-4007" });
  });
});
