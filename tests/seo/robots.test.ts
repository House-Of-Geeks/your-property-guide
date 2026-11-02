// A named user-agent group replaces the * group for that bot, so every allow
// group must repeat the private-path disallows or the bot may crawl them.
import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

type Rule = { userAgent?: string | string[]; allow?: string | string[]; disallow?: string | string[] };

const rules = robots().rules as Rule[];
const asList = (v: string | string[] | undefined) => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
const agent = (name: string) => rules.find((r) => r.userAgent === name);

const PRIVATE = ["/api/", "/dashboard/", "/downloads/", "/print/"];

describe("robots.txt", () => {
  it("keeps the * group out of the private paths", () => {
    expect(asList(agent("*")?.disallow)).toEqual(expect.arrayContaining(PRIVATE));
  });

  it("repeats the private-path disallows in every named allow group", () => {
    const allowGroups = rules.filter((r) => r.userAgent !== "*" && asList(r.allow).includes("/"));
    expect(allowGroups.length).toBeGreaterThan(10);
    for (const r of allowGroups) {
      expect(asList(r.disallow), String(r.userAgent)).toEqual(expect.arrayContaining(PRIVATE));
      expect(asList(r.disallow), String(r.userAgent)).not.toContain("/");
    }
  });

  it("still allows the search and AI answer crawlers", () => {
    for (const name of [
      "GPTBot", "OAI-SearchBot", "ChatGPT-User", "ClaudeBot", "Claude-SearchBot",
      "PerplexityBot", "Google-Extended", "bingbot",
    ]) {
      expect(asList(agent(name)?.allow), name).toContain("/");
    }
  });

  it("blocks the scrapers entirely", () => {
    for (const name of ["AionBot", "AwarioBot", "Reflectionbot", "ExaSearchBot"]) {
      expect(asList(agent(name)?.disallow), name).toEqual(["/"]);
    }
  });
});
