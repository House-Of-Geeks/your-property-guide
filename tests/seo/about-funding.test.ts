// Commercial intent review, 10 Oct 2026 (new-homes F9b, report 0.3 item 8):
// /about said "100% of our revenue comes from introduction fees paid by
// partner agents, brokers, conveyancers, accountants and builders". No
// builder partner is confirmed, so builders come off the list until one pays.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const about = readFileSync("src/app/(marketing)/about/page.tsx", "utf8").replace(/\s+/g, " ");
const funding = about.slice(about.indexOf('id="ownership-funding"'), about.indexOf('id="coverage"'));

describe("/about ownership and funding", () => {
  it("names only the partner types that pay us", () => {
    expect(funding).toContain(
      "100% of our revenue comes from introduction fees paid by partner agents, brokers, conveyancers and accountants.",
    );
    expect(funding).not.toMatch(/builder/i);
  });
});
