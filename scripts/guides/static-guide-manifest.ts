// Regenerate src/lib/data/static-guides.json: the title, description and
// dates of every static guide, read from the FRONTMATTER in its page.tsx.
// The guide registry (src/lib/guides/registry.ts) reads the JSON, so the
// guides sitemap's lastmod, /guides, the category pages, the hub lists and
// the glossary links all carry the guide's own title and date.
//
//   npx tsx scripts/guides/static-guide-manifest.ts          write the file
//   npx tsx scripts/guides/static-guide-manifest.ts --check  exit 1 if it is stale
//   (npm run guides:manifest is the first form)
//
// Run it after adding a guide or changing a guide's title, description or
// dates, and commit the diff. tests/seo/guide-registry.test.ts fails while
// the committed file differs from the page sources.
//
// The eight cost-of-selling and eight stamp duty state guides have no
// FRONTMATTER in their page: their frontmatter is built from data
// (src/lib/guides/cost-of-selling-frontmatter.ts, stamp-duty-frontmatter.ts)
// and the registry calls those directly.
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

export interface StaticGuideRecord {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes?: number;
  persona?: string;
}

export interface StaticGuideScan {
  /** Guides whose page declares `const FRONTMATTER = { ... }`, sorted by slug. */
  records: StaticGuideRecord[];
  /** Guide directories whose frontmatter is computed (costOfSellingMetadata, stampDutyMetadata). */
  computed: string[];
}

const ROOT = path.resolve(__dirname, "../..");
export const GUIDES_DIR = path.join(ROOT, "src/app/(marketing)/guides");
export const MANIFEST_FILE = path.join(ROOT, "src/lib/data/static-guides.json");

// Route folders under /guides that are not static guide pages.
const NON_GUIDE_DIRS = new Set(["[slug]", "category"]);
const FIELDS = ["slug", "title", "description", "publishedAt", "updatedAt", "readingTimeMinutes", "persona"] as const;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function literalValue(node: ts.Expression, where: string): string | number {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  throw new Error(`${where}: expected a plain string or number literal, found \`${node.getText()}\``);
}

function unwrap(node: ts.Expression): ts.Expression {
  // `{ ... } as const` or `{ ... } satisfies GuideFrontmatter`
  if (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node)) {
    return unwrap(node.expression);
  }
  return node;
}

/** Reads one page's FRONTMATTER object, or returns null when the page declares none. */
export function readFrontmatter(file: string): StaticGuideRecord | null {
  const src = fs.readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  let found: ts.ObjectLiteralExpression | null = null;
  sf.forEachChild(function visit(node) {
    if (found) return;
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === "FRONTMATTER" && node.initializer) {
      const init = unwrap(node.initializer);
      if (ts.isObjectLiteralExpression(init)) found = init;
      return;
    }
    node.forEachChild(visit);
  });
  if (!found) return null;

  const rel = path.relative(ROOT, file);
  const out: Record<string, string | number> = {};
  for (const prop of (found as ts.ObjectLiteralExpression).properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = prop.name.getText(sf).replace(/^["']|["']$/g, "");
    if (!(FIELDS as readonly string[]).includes(key)) continue;
    out[key] = literalValue(prop.initializer, `${rel} FRONTMATTER.${key}`);
  }
  for (const key of ["slug", "title", "description", "publishedAt"] as const) {
    if (typeof out[key] !== "string" || out[key] === "") throw new Error(`${rel}: FRONTMATTER.${key} is missing`);
  }
  for (const key of ["publishedAt", "updatedAt"] as const) {
    if (out[key] !== undefined && !ISO_DATE.test(String(out[key]))) {
      throw new Error(`${rel}: FRONTMATTER.${key} "${out[key]}" is not a YYYY-MM-DD date`);
    }
  }
  const record: StaticGuideRecord = {
    slug: String(out.slug),
    title: String(out.title),
    description: String(out.description),
    publishedAt: String(out.publishedAt),
  };
  if (out.updatedAt !== undefined) record.updatedAt = String(out.updatedAt);
  if (out.readingTimeMinutes !== undefined) record.readingTimeMinutes = Number(out.readingTimeMinutes);
  if (out.persona !== undefined) record.persona = String(out.persona);
  return record;
}

/** Scans every static guide directory. Throws on a page it cannot read. */
export function scanStaticGuides(dir: string = GUIDES_DIR): StaticGuideScan {
  const records: StaticGuideRecord[] = [];
  const computed: string[] = [];
  for (const name of fs.readdirSync(dir).sort()) {
    if (NON_GUIDE_DIRS.has(name)) continue;
    const file = path.join(dir, name, "page.tsx");
    if (!fs.existsSync(file)) continue;
    const record = readFrontmatter(file);
    if (record) {
      if (record.slug !== name) {
        throw new Error(`${path.relative(ROOT, file)}: FRONTMATTER.slug "${record.slug}" does not match its folder "${name}"`);
      }
      records.push(record);
    } else if (/(costOfSellingMetadata|stampDutyMetadata)\(/.test(fs.readFileSync(file, "utf8"))) {
      computed.push(name);
    } else {
      throw new Error(`${path.relative(ROOT, file)}: no FRONTMATTER object and not a cost-of-selling or stamp duty state page`);
    }
  }
  return { records, computed };
}

export function manifestJson(scan: StaticGuideScan = scanStaticGuides()): string {
  const body = {
    _generated: "by scripts/guides/static-guide-manifest.ts from each guide's FRONTMATTER; do not edit, run npm run guides:manifest",
    guides: scan.records,
  };
  return JSON.stringify(body, null, 2) + "\n";
}

const isMain = process.argv[1] && /static-guide-manifest\.ts$/.test(process.argv[1]);
if (isMain) {
  const next = manifestJson();
  const current = fs.existsSync(MANIFEST_FILE) ? fs.readFileSync(MANIFEST_FILE, "utf8") : "";
  const count = (JSON.parse(next) as { guides: unknown[] }).guides.length;
  if (process.argv.includes("--check")) {
    if (next !== current) {
      console.error(`${path.relative(ROOT, MANIFEST_FILE)} is out of date: run npm run guides:manifest`);
      process.exit(1);
    }
    console.log(`${path.relative(ROOT, MANIFEST_FILE)} is current (${count} guides)`);
  } else {
    fs.writeFileSync(MANIFEST_FILE, next);
    console.log(`wrote ${path.relative(ROOT, MANIFEST_FILE)} (${count} guides)${next === current ? ", unchanged" : ""}`);
  }
}
