// Commercial intent review, 10 Oct 2026 (new-homes F9): /data printed
// "0 · House & land packages · New build packages from participating
// builders · Builder partners" while the site held no package (and no
// builder partner is confirmed), plus "0 · Hazard records". The house and
// land row now follows hasHouseAndLandStock, the rule that keeps
// /house-and-land out of the index, and no count of zero is printed.
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const counts = vi.hoisted(() => ({
  suburb: 17_700,
  school: 9_693,
  property: 0,
  propertyAddress: 15_600_000,
  propertySale: 5_000_000,
  suburbHazard: 0,
  suburbClimate: 7_782,
  agent: 3,
  agency: 1,
  blogPost: 57,
  houseAndLandPackage: 0,
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/db", () => {
  const model = (key: keyof typeof counts) => ({ count: async () => counts[key] });
  return {
    db: {
      suburb: model("suburb"),
      school: model("school"),
      property: { count: async ({ where }: { where: { status: string } }) => (where.status === "active" ? 6 : 12) },
      propertyAddress: model("propertyAddress"),
      propertySale: model("propertySale"),
      suburbHazard: model("suburbHazard"),
      suburbClimate: model("suburbClimate"),
      agent: model("agent"),
      agency: model("agency"),
      blogPost: model("blogPost"),
      houseAndLandPackage: model("houseAndLandPackage"),
    },
  };
});

import DataPage from "@/app/(marketing)/data/page";
import { MIN_LIVE_PACKAGES } from "@/lib/house-and-land-indexability";

const render = async () => renderToStaticMarkup(await DataPage());
// The figure cells and stat tiles: the first cell of each table row and the
// big number in each hero tile.
const figures = (html: string) => [
  ...[...html.matchAll(/<td class="py-4 px-4 font-display[^"]*">([^<]*)<\/td>/g)].map((m) => m[1]),
  ...[...html.matchAll(/<p class="font-display text-5xl[^"]*">([^<]*)<\/p>/g)].map((m) => m[1]),
];

beforeEach(() => {
  counts.houseAndLandPackage = 0;
  counts.suburbHazard = 0;
  delete process.env.NEXT_PHASE;
});

describe("/data", () => {
  it("hides the house and land row while there is no stock", async () => {
    const html = await render();
    expect(html).not.toContain("House &amp; land packages");
    expect(html).not.toContain('href="/house-and-land"');
    expect(html).not.toMatch(/participating builders|Builder partners/);
  });

  it("shows it, without claiming builder partners, once a package is listed", async () => {
    counts.houseAndLandPackage = MIN_LIVE_PACKAGES;
    const html = await render();
    expect(html).toContain("House &amp; land packages");
    expect(html).toContain('href="/house-and-land"');
    expect(html).not.toMatch(/participating builders|Builder partners/);
  });

  it("never prints a zero as a figure", async () => {
    const html = await render();
    const shown = figures(html);
    expect(shown.length).toBeGreaterThan(5);
    expect(shown).not.toContain("0");
    expect(html).not.toContain("Hazard records");
    // Non-zero rows still print.
    expect(shown).toEqual(expect.arrayContaining(["17.7K+", "7,782", "57", "6", "12"]));
  });

  it("the build render (every count zero) prints no zero either", async () => {
    process.env.NEXT_PHASE = "phase-production-build";
    const html = await render();
    expect(figures(html)).not.toContain("0");
    expect(html).not.toContain("Suburbs profiled");
    // The hand-tracked editorial rows are never zero.
    expect(html).toContain("Glossary terms");
  });
});
