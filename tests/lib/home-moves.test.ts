import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CASE_CONTEXT, DESK, INTRO_PREVIEW, MOVES, QUESTIONS, STAGES, STAGE_ANSWERS, STARTS } from "@/lib/home-start";
import { planStartHref } from "@/lib/plans/start";
import { HAMILTON, dollars, expectedIncrease } from "@/lib/case-studies";
import { buildPlan } from "@/lib/plans/engine";
import { planPreview } from "@/lib/plans/preview";
import { answersFromParams, editPlanHref, stateOfSuburb, suburbSlugLabel, type PlanAnswers } from "@/lib/plans/questions";
import { AGREEMENT_CHECK } from "@/lib/service-model";
import { routeExists } from "../helpers/routes";

// The homepage's selling / buying / both switch (19 Oct 2026) and the plan's
// edit link: each move talks to the right reader, the preview is a real
// plan, and "Change my answers" keeps every answer.

// The homepage's planner and question desk (20 Oct 2026, "Clear decisions"):
// three starting points for every move and stage, four answers for every
// move, every link a real page, and the full plan reached with the stage
// already answered.
describe("homepage starting points and questions", () => {
  it("cover buying, selling and both, at every stage, with three real links each", () => {
    expect(MOVES.map((m) => m.id)).toEqual(["buying", "selling", "both"]);
    for (const m of MOVES) {
      for (const st of STAGES) {
        const points = STARTS[m.id][st.id];
        expect(points).toHaveLength(3);
        for (const p of points) expect(routeExists(p.href), p.href).toBe(true);
      }
    }
  });

  it("send the stage to the planner as an answer it understands", () => {
    for (const m of MOVES) {
      for (const st of STAGES) {
        const href = planStartHref({ journey: m.id === "both" ? "buying-and-selling" : m.id, answers: STAGE_ANSWERS[m.id][st.id] });
        const qs = new URLSearchParams(href.split("?")[1]);
        const a = answersFromParams((k) => qs.get(k));
        expect(a?.journey).toBe(m.id === "both" ? "buying-and-selling" : m.id);
        if (m.id === "buying") expect(a?.buyStage).not.toBeNull();
        if (m.id === "selling") expect(a?.sellStage).not.toBeNull();
      }
    }
  });

  it("answer every question for every move, with real links", () => {
    for (const m of MOVES) {
      for (const q of QUESTIONS) {
        const d = DESK[m.id][q.id];
        expect(d.heading.length, `${m.id}/${q.id}`).toBeGreaterThan(5);
        expect(d.points.length).toBeGreaterThanOrEqual(3);
        expect(d.links.length).toBeGreaterThanOrEqual(1);
        for (const l of d.links) expect(routeExists(l.href), l.href).toBe(true);
      }
    }
  });

  it("send the agreement check only to sellers and to people doing both", () => {
    const hrefs = (m: "buying" | "selling" | "both") =>
      Object.values(DESK[m]).flatMap((d) => d.links.map((l) => l.href)).concat(Object.values(STARTS[m]).flat().map((p) => p.href));
    expect(hrefs("buying")).not.toContain(AGREEMENT_CHECK.href);
    expect(hrefs("selling")).toContain(AGREEMENT_CHECK.href);
  });

  it("keep the old positioning out of the homepage's words", () => {
    const words = JSON.stringify({ STARTS, DESK, INTRO_PREVIEW, CASE_CONTEXT });
    expect(words).not.toMatch(/20 million|playbook|campaign that wins|not the market|top dollar/i);
  });

  it("build the plan the full-plan link opens", () => {
    for (const a of [
      { journey: "selling", state: null, timeframe: null, sellStage: "thinking" },
      { journey: "buying", state: null, timeframe: null, buyStage: "starting" },
      { journey: "buying-and-selling", state: null, timeframe: null, order: "undecided" },
    ] as PlanAnswers[]) {
      const plan = buildPlan(a);
      const preview = planPreview(a);
      expect(preview.steps.map((s) => s.title)).toEqual(plan.nextSteps.map((s) => s.title));
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
