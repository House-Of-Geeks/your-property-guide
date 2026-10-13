import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";

// Next 16's SWC drops the leading space of a JSX text that runs over more
// than one line and holds an HTML entity, so
//   <strong>flat percentage</strong> of the sale price. It&rsquo;s
//   simple ...
// rendered as "flat percentageof the sale price" on every guide that had
// one (found 13 Oct 2026). Write the space out instead:
//   <strong>flat percentage</strong>{" "}of the sale price. It&rsquo;s

const SRC = join(__dirname, "../../src");
const ENTITY = /&(#\d+|#x[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/;

function tsxFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "generated" ? [] : tsxFiles(path);
    return path.endsWith(".tsx") ? [path] : [];
  });
}

function droppedSpaces(path: string): string[] {
  const src = readFileSync(path, "utf8");
  const sf = ts.createSourceFile(path, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const hits: string[] = [];
  const visit = (node: ts.Node) => {
    if (node.kind === ts.SyntaxKind.JsxText) {
      const raw = src.slice(node.pos, node.end);
      const prev = src[node.pos - 1];
      if (/^[ \t]+\S/.test(raw) && raw.includes("\n") && ENTITY.test(raw) && (prev === ">" || prev === "}")) {
        const line = sf.getLineAndCharacterOfPosition(node.pos).line + 1;
        hits.push(`${relative(SRC, path)}:${line} ${JSON.stringify(raw.split("\n")[0].trim())}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return hits;
}

describe("JSX text keeps its space after an element", () => {
  it("has no multi-line JSX text with an entity that starts with a bare space", () => {
    const hits = tsxFiles(SRC).flatMap(droppedSpaces);
    expect(hits).toEqual([]);
  });
});
