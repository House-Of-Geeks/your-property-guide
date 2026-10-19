// The short preview of a next-step plan (19 Oct 2026): the homepage shows one
// beside its plan button, so people can see what they'll get before they
// answer anything. It's cut from a real plan (buildPlan), so the preview and
// the result always use the same steps, tools and checklist.

import { buildPlan } from "./engine";
import type { PlanAnswers } from "./questions";

export interface PlanPreview {
  /** What the plan is about ("getting ready to sell"), without the "Your next-step plan:" prefix. */
  focus: string;
  steps: { title: string; href?: string }[];
  tools: { label: string; href: string }[];
  checklist: { title: string; items: string[]; more: number };
}

const PREFIX = /^Your next-step plan:\s*/;

export function planPreview(a: PlanAnswers, { tools = 3, items = 3 } = {}): PlanPreview {
  const plan = buildPlan(a);
  const all = plan.checklist.groups.flatMap((g) => g.items);
  return {
    focus: plan.title.replace(PREFIX, ""),
    steps: plan.nextSteps.map((s) => ({ title: s.title, href: s.link?.href })),
    tools: plan.tools.slice(0, tools).map((t) => ({ label: t.label, href: t.href })),
    checklist: { title: plan.checklist.title, items: all.slice(0, items), more: Math.max(0, all.length - items) },
  };
}
