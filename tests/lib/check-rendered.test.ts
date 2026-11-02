import { describe, expect, it } from "vitest";
import {
  countViolations,
  decodeEntities,
  exceedsBaseline,
  extractAttributeValues,
  extractJsonLd,
  extractVisibleText,
  parsePaths,
  scanUrls,
} from "../../scripts/check-rendered.mjs";

const EM = "\u2014";
const EN = "\u2013";
const page = (body: string, head = "") => `<!DOCTYPE html><html><head>${head}</head><body>${body}</body></html>`;

describe("extraction", () => {
  it("reads visible text without tags, scripts, styles or comments", () => {
    const html = page('<h1>Flinders View, QLD</h1><!-- hidden --><style>.a{color:red}</style><script>var x = "TODO";</script><p>Ipswich&nbsp;City</p>');
    const text = extractVisibleText(html);
    expect(text).toContain("Flinders View, QLD");
    expect(text).toContain("Ipswich City");
    expect(text).not.toContain("TODO");
    expect(text).not.toContain("color:red");
    expect(text).not.toContain("hidden");
  });
  it("keeps JSON-LD out of the visible text and reads it separately", () => {
    const html = page('<script type="application/ld+json">{"name":"A TBD thing","nested":["x",{"y":"z"}]}</script><p>ok</p>');
    expect(extractVisibleText(html)).toBe("ok");
    expect(extractJsonLd(html)).toEqual(["A TBD thing", "x", "z"]);
  });
  it("falls back to the raw body when JSON-LD is not valid JSON", () => {
    expect(extractJsonLd(page('<script type="application/ld+json">{ FIXME </script>'))).toEqual(["{ FIXME"]);
  });
  it("reads content, alt, title, aria-label and placeholder values", () => {
    const html = page(
      '<img alt="a pic" src="x.png"><a title="t1" aria-label="l1">x</a><input placeholder="p1">',
      '<meta name="description" content="Fish &amp; chips"><meta content=\'single\'>',
    );
    expect(extractAttributeValues(html).sort()).toEqual(["Fish & chips", "a pic", "l1", "p1", "single", "t1"].sort());
  });
  it("decodes named, decimal and hex entities, including the dash ones", () => {
    expect(decodeEntities("&mdash;&ndash;&#8212;&#x2013;&amp;&unknown;")).toBe(`${EM}${EN}${EM}${EN}&&unknown;`);
  });
});

describe("violations", () => {
  const count = (body: string, head = "") => countViolations(page(body, head));

  it("is clean for ordinary copy", () => {
    expect(Object.values(count("<p>Flinders View, QLD 4305. To-do lists, a to-be-decided day, and tbc in lowercase.</p>")).every((n) => n === 0)).toBe(true);
  });
  it("finds an em dash and an en dash, literal or as an entity", () => {
    expect(count(`<p>a ${EM} b</p>`).emDash).toBe(1);
    expect(count(`<p>a ${EN} b</p>`).enDash).toBe(1);
    expect(count("<p>a &mdash; b &ndash; c</p>")).toMatchObject({ emDash: 1, enDash: 1 });
  });
  it("finds each marker as a whole word only", () => {
    expect(count("<p>TODO</p>").todo).toBe(1);
    expect(count("<p>TBC</p>").tbc).toBe(1);
    expect(count("<p>TBD</p>").tbd).toBe(1);
    expect(count("<p>FIXME</p>").fixme).toBe(1);
    expect(count("<p>TODOS and TBCD</p>")).toMatchObject({ todo: 0, tbc: 0 });
  });
  it("finds [needs ...], lorem ipsum and [placeholder, case-insensitively", () => {
    expect(count("<p>[Needs source]</p>").needs).toBe(1);
    expect(count("<p>Lorem Ipsum dolor</p>").loremIpsum).toBe(1);
    expect(count("<p>[placeholder text]</p>").placeholder).toBe(1);
  });
  it("finds violations in attributes and in JSON-LD", () => {
    const html = page(
      `<img alt="a ${EM} b"><a aria-label="TBC">x</a>`,
      `<meta content="x ${EN} y"><script type="application/ld+json">{"name":"a ${EM} b"}</script>`,
    );
    expect(countViolations(html)).toMatchObject({ emDash: 2, enDash: 1, tbc: 1 });
  });
  it("ignores a marker inside a non-JSON-LD script", () => {
    expect(count('<script>self.__next_f.push(["TODO \u2014"])</script><p>fine</p>')).toMatchObject({ todo: 0, emDash: 0 });
  });
});

describe("baseline ratchet", () => {
  it("fails a kind above its baseline and passes at or below it", () => {
    const counts = { ...countViolations(page("<p>x</p>")), enDash: 3, tbd: 1 };
    expect(exceedsBaseline(counts, { enDash: 3 })).toEqual(["tbd"]);
    expect(exceedsBaseline(counts, { enDash: 2, tbd: 1 })).toEqual(["enDash"]);
    expect(exceedsBaseline(counts, { enDash: 5, tbd: 1 })).toEqual([]);
    expect(exceedsBaseline(counts, undefined)).toEqual(["enDash", "tbd"]);
  });
});

describe("live mode", () => {
  it("parses a comma list and an @file, skipping blanks and comments", () => {
    expect(parsePaths("/a, /b ,,/c")).toEqual(["/a", "/b", "/c"]);
    expect(parsePaths("@paths.txt", () => "/a\n\n# note\n/b\r\n")).toEqual(["/a", "/b"]);
  });
  it("fails a non-200 and any violation with zero tolerance", async () => {
    const pages: Record<string, { status: number; body: string }> = {
      "http://x/ok": { status: 200, body: page("<p>fine</p>") },
      "http://x/dash": { status: 200, body: page(`<p>a ${EN} b</p>`) },
      "http://x/gone": { status: 404, body: "" },
    };
    const fake = async (url: string) => {
      const p = pages[url];
      return { status: p.status, text: async () => p.body } as Response;
    };
    const results = await scanUrls("http://x", ["/ok", "/dash", "/gone"], fake as unknown as typeof fetch);
    expect(results.map((r) => [r.page, r.failed])).toEqual([
      ["/ok", []],
      ["/dash", ["enDash"]],
      ["/gone", ["status"]],
    ]);
  });
});
