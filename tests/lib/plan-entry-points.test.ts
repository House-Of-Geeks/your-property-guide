import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Regression guard for the suburb handoff (20 Oct 2026). On phones, picking
// Hamilton in the homepage field and then tapping "Next-step plan" in the
// sticky bar used to open the planner without the suburb, because the bar
// built its own /plan link from the move alone. Every plan entry point must
// now build its link with planStartHref from the move and suburb the hero
// shares, so this checks the wiring in each one. (There's no DOM test setup
// in this repo; tests/lib/home-moves.test.ts covers planStartHref itself.)

const read = (p: string) => readFileSync(join(process.cwd(), p), "utf8");

// The homepage's own planner (20 Oct 2026, "Clear decisions") has no suburb
// field; it sends the move and the stage. The header and the phone bar still
// pass on any suburb a page publishes.
const ENTRY_POINTS = [
  { file: "src/components/layout/Header.tsx", readsPlace: /usePublishedPlace\(\)/ },
  { file: "src/components/layout/MobileBottomNav.tsx", readsPlace: /usePublishedPlace\(\)/ },
];

describe("plan entry points share the suburb", () => {
  for (const { file, readsPlace } of ENTRY_POINTS) {
    it(`${file} builds its plan link with planStartHref and the shared suburb`, () => {
      const src = read(file);
      expect(src).toMatch(/import \{ planStartHref \} from "@\/lib\/plans\/start"/);
      expect(src).toMatch(/planStartHref\(\{[^}]*place/);
      expect(src).toMatch(readsPlace);
      // No hand-built plan links: that's how the phone bar lost the suburb.
      expect(src).not.toMatch(/[`"']\/plan\?j=/);
      expect(src).not.toMatch(/`\/plan\?\$\{/);
    });
  }

  it("the homepage planner builds its full-plan link with planStartHref and the stage's answers", () => {
    const src = read("src/components/homepage/StartPlanner.tsx");
    expect(src).toMatch(/import \{ planStartHref \} from "@\/lib\/plans\/start"/);
    expect(src).toMatch(/planStartHref\(\{[^}]*answers: STAGE_ANSWERS/);
    expect(src).not.toMatch(/[`"']\/plan\?j=/);
    const store = read("src/components/interactive/move-context.tsx");
    expect(store).toMatch(/export function usePublishedPlace/);
    expect(store).toMatch(/publishedPlace = place/);
  });
});
