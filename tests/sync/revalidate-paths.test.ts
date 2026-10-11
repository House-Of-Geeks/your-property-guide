// A sync that changes a suburb's figures purges every cached page that prints them, the agents page included.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("revalidate-paths", () => {
  it("purges the profile and its rental-market, schools and agents pages", () => {
    const src = readFileSync("scripts/sync/revalidate-paths.ts", "utf8");
    for (const sub of ["", "/rental-market", "/schools", "/agents"]) expect(src).toContain(`\`/suburbs/\${s.slug}${sub}\``);
  });
});
