import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const url = vi.hoisted(() => ({ params: null as URLSearchParams | null }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
  useSearchParams: () => {
    if (!url.params) throw new Error("the prerendered form must not read the query string");
    return url.params;
  },
}));

import { IntroductionFormCore } from "@/components/journeys/IntroductionForm";
import { FindAnExpertForm, GetHelpForm } from "@/components/journeys/IntroductionFormFromUrl";

const read = (path: string) => readFileSync(join(process.cwd(), path), "utf8");

const sourceFiles = (dir: string): string[] =>
  readdirSync(join(process.cwd(), dir), { withFileTypes: true }).flatMap((e) => {
    const path = `${dir}/${e.name}`;
    if (e.isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(e.name) ? [path] : [];
  });

describe("/get-help and /find-an-expert are static with the form in the HTML", () => {
  it.each(["src/app/(marketing)/get-help/page.tsx", "src/app/(marketing)/find-an-expert/page.tsx"])("%s", (page) => {
    const src = read(page);
    // Reading searchParams on the server makes the route dynamic again.
    expect(src).not.toMatch(/searchParams/);
    // The fallback is what prerenders: the form itself, not a blank.
    expect(src).toMatch(/<Suspense fallback=\{<IntroductionFormCore\b/);
  });

  it("renders the form on the server without touching the query string", () => {
    const html = renderToStaticMarkup(createElement(IntroductionFormCore));
    expect(html).toContain("Who would you like to be introduced to?");
    expect(html).toContain("A selling agent");
  });

  it("opens at step two when a service is pre-filled", () => {
    const html = renderToStaticMarkup(createElement(IntroductionFormCore, { defaultService: "selling-agent" }));
    expect(html).toContain("Have you signed with a selling agent?");
  });

  it("takes the pre-fill from the URL in the browser", () => {
    url.params = new URLSearchParams("service=buyers-agent&state=qld");
    const html = renderToStaticMarkup(createElement(GetHelpForm));
    expect(html).toContain("Are you working with a buyer’s agent already?");
    expect(html).toMatch(/ in QLD<\/strong>/);

    url.params = new URLSearchParams("intent=selling");
    expect(renderToStaticMarkup(createElement(FindAnExpertForm))).toContain("Have you signed with a selling agent?");

    url.params = new URLSearchParams("service=broker");
    expect(renderToStaticMarkup(createElement(GetHelpForm))).toContain("Who would you like to be introduced to?");
    url.params = null;
  });
});

describe("the session is not fetched on public pages", () => {
  it("has no SessionProvider in the root providers", () => {
    const src = read("src/components/analytics/Providers.tsx");
    expect(src).not.toMatch(/from "next-auth\/react"/);
    expect(src).toContain("<QuantcastUser />");
    expect(src).toContain("<AttributionCapture />");
  });

  it("has no client code that would need one", () => {
    const users = sourceFiles("src").filter((f) => /useSession|<SessionProvider/.test(read(f)));
    expect(users.filter((f) => f !== "src/components/analytics/Providers.tsx")).toEqual([]);
  });
});

describe("caches read while rendering sync-fed pages", () => {
  // An unstable_cache window lowers the window of the page reading it, so
  // these must not drop below the pages' 30 days.
  it.each([
    "src/lib/compare-pairs.ts",
    "src/lib/services/city-rankings-service.ts",
  ])("%s keeps the pages' window", (file) => {
    const src = read(file);
    expect(src).toContain("revalidate: SYNC_FED_REVALIDATE_SECONDS");
    expect(src).not.toMatch(/revalidate: \d/);
  });

  it("the suburb page and its OG image share one window", () => {
    expect(read("src/app/(marketing)/suburbs/[slug]/page.tsx")).toMatch(/export const revalidate = 2592000;/);
    expect(read("src/app/api/og/suburb/[slug]/route.tsx")).toMatch(/export const revalidate = 2592000;/);
  });
});
