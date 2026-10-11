// Only a sales feed writes a suburb's sales figures or their provenance.
//
// statsSource is what the trust gate reads (src/lib/suburb-data-quality.ts).
// A rental feed that stamped it withheld every NSW median twice: on 1 Jul
// 2026 (fixed in be3def1, 3 Jul) and on 1 Oct 2026, when the label went back
// on all 5,275 NSW rows (scripts/sync/repair-stats-source.ts has the
// evidence). This test reads every script that can write a Suburb row, Prisma
// calls and raw SQL, and fails when a file that is not a sales feed writes a
// sales-side column.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** The columns that belong to the sales feeds. */
const SALES_COLUMNS = [
  "statsSource", "statsUpdatedAt", "salesUpdatedAt",
  "medianHousePrice", "medianUnitPrice", "salesCountHouse",
  "annualGrowthHouse", "annualGrowthUnit", "daysOnMarket",
] as const;

/** Files that may write them, and why. Everything else under scripts/ (and prisma/seed.ts) may not. */
const SALES_WRITERS: Record<string, string> = {
  "scripts/sync/sources/sales-nsw.ts": "NSW Valuer General feed",
  "scripts/sync/sources/sales-vic.ts": "Land Victoria feed",
  "scripts/sync/sources/sales-sa.ts": "SA Government feed",
  "scripts/sync/sources/sales-abs.ts": "ABS SA2 feed; never over a suburb-level feed (sales-abs-rules.ts)",
  "scripts/sync/sources/sales-qld.ts": "census-mortgage proxy, labelled sales-qld (distrusted); never over a trusted label (census-proxy-rules.ts)",
  "scripts/sync/sources/sales-wa.ts": "census-mortgage proxy, labelled sales-wa (distrusted); never over a trusted label (census-proxy-rules.ts)",
  "scripts/sync/repair-stats-source.ts": "the repair: statsSource only, decided from the sales feeds' own evidence (repair-stats-source-rules.ts)",
  "scripts/seed/seed-suburb-stats.ts": "April 2026 hand seed, labelled seed-apr-2026 (distrusted)",
  "scripts/seed/sync-suburb-stats-abs.ts": "retired census seed, labelled abs-census-2021 (distrusted); refuses to run without --allow-postcode-level",
  "prisma/seed.ts": "development seed of sample suburbs (prisma db seed); not for production",
};

/** Files that set the columns' starting values on rows they create, and nowhere else. */
const CREATORS: Record<string, string> = {
  "scripts/sync/sources/import-suburbs.ts": "suburb stubs: statsSource 'stub', prices 0",
  "scripts/sync/sources/import-suburbs-all.ts": "national localities: statsSource 'import-suburbs-all', prices 0",
};

interface Finding { op: string; column: string; at: number }

// ── A small reader for TypeScript source: balanced brackets, strings, comments ──

function stripComments(src: string): string {
  let out = "";
  for (let i = 0; i < src.length; i++) {
    const c = src[i], n = src[i + 1];
    if (c === "/" && n === "/") { while (i < src.length && src[i] !== "\n") { out += " "; i++; } out += "\n"; continue; }
    if (c === "/" && n === "*") { while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) { out += src[i] === "\n" ? "\n" : " "; i++; } out += "  "; i++; continue; }
    if (c === '"' || c === "'" || c === "`") {
      const q = c; out += c; i++;
      while (i < src.length && src[i] !== q) { if (src[i] === "\\") { out += src[i++]; } out += src[i++]; }
      out += q; continue;
    }
    out += c;
  }
  return out;
}

/** Index just past the bracket that closes the one at `open`, skipping strings. */
function closeOf(src: string, open: number): number {
  const pairs: Record<string, string> = { "(": ")", "{": "}", "[": "]" };
  const stack = [pairs[src[open]]];
  for (let i = open + 1; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") { const q = c; i++; while (i < src.length && src[i] !== q) { if (src[i] === "\\") i++; i++; } continue; }
    if (pairs[c]) stack.push(pairs[c]);
    else if (c === stack[stack.length - 1]) { stack.pop(); if (stack.length === 0) return i + 1; }
  }
  return src.length;
}

/** The text of `key: { ... }` objects inside a call's arguments (or the bare value when it is not a literal). */
function payloads(args: string, keys: string[]): { key: string; body: string; literal: boolean }[] {
  const out: { key: string; body: string; literal: boolean }[] = [];
  const re = new RegExp(`\\b(${keys.join("|")})\\s*:\\s*`, "g");
  for (let m = re.exec(args); m; m = re.exec(args)) {
    const start = m.index + m[0].length;
    if (args[start] === "{" || args[start] === "[") {
      const end = closeOf(args, start);
      out.push({ key: m[1], body: args.slice(start, end), literal: true });
      re.lastIndex = end;
    } else {
      out.push({ key: m[1], body: args.slice(start, start + 60).split(/[,}\n]/)[0], literal: false });
    }
  }
  return out;
}

/** Every write of a sales column to a Suburb row in this source: Prisma calls and raw SQL. */
function salesColumnWrites(source: string): Finding[] {
  const src = stripComments(source);
  const findings: Finding[] = [];
  const keyRe = (col: string) => new RegExp(`(^|[\\s{,])(?:"${col}"|'${col}'|${col})\\s*:`);

  // Prisma: <client>.suburb.update / updateMany / upsert / create / createMany ({ ... })
  const callRe = /\.suburb\.(update|updateMany|upsert|create|createMany)\s*\(/g;
  for (let m = callRe.exec(src); m; m = callRe.exec(src)) {
    const open = m.index + m[0].length - 1;
    const args = src.slice(open, closeOf(src, open));
    for (const p of payloads(args, ["data", "update", "create"])) {
      const op = m[1] === "upsert" ? (p.key === "create" ? "upsert.create" : "upsert.update") : m[1];
      if (!p.literal) { findings.push({ op, column: `(payload ${p.body.trim()} is not inline)`, at: m.index }); continue; }
      for (const col of SALES_COLUMNS) if (keyRe(col).test(p.body)) findings.push({ op, column: col, at: m.index });
    }
  }

  // Raw SQL: UPDATE "Suburb" ... SET <assignments> [FROM | WHERE | RETURNING | end of template]
  const updRe = /UPDATE\s+"Suburb"/g;
  for (let m = updRe.exec(src); m; m = updRe.exec(src)) {
    const rest = src.slice(m.index);
    const end = rest.indexOf("`");
    const stmt = end < 0 ? rest : rest.slice(0, end);
    const set = stmt.match(/\bSET\b([\s\S]*?)(?:\bFROM\b|\bWHERE\b|\bRETURNING\b|$)/i)?.[1] ?? "";
    for (const col of SALES_COLUMNS) if (new RegExp(`"${col}"\\s*=`).test(set)) findings.push({ op: "UPDATE \"Suburb\"", column: col, at: m.index });
  }
  // Raw SQL: INSERT INTO "Suburb" (columns)
  const insRe = /INSERT\s+INTO\s+"Suburb"\s*\(/g;
  for (let m = insRe.exec(src); m; m = insRe.exec(src)) {
    const open = m.index + m[0].length - 1;
    const cols = src.slice(open, closeOf(src, open));
    for (const col of SALES_COLUMNS) if (new RegExp(`"${col}"`).test(cols)) findings.push({ op: "INSERT INTO \"Suburb\"", column: col, at: m.index });
  }
  return findings;
}

function listTs(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return name === "node_modules" ? [] : listTs(p);
    return /\.(ts|mts|cts|js|mjs|cjs)$/.test(name) ? [p] : [];
  });
}

const FILES = [...listTs("scripts"), "prisma/seed.ts"];

describe("the reader", () => {
  it("catches the writes that withheld the NSW medians", () => {
    // rental-nsw.ts before be3def1 (3 Jul 2026): every NSW row, every run
    expect(salesColumnWrites(`await prisma.suburb.updateMany({
      where: { state: "NSW" },
      data:  { statsUpdatedAt: new Date(), statsSource: SOURCE_ID, rentalUpdatedAt: new Date() },
    });`).map((f) => f.column)).toEqual(["statsSource", "statsUpdatedAt"]);
    // rental-qld.ts before be3def1: raw SQL, per row
    expect(salesColumnWrites("await prisma.$executeRaw`\n UPDATE \"Suburb\" AS s\n SET\n \"medianRentHouse\" = u.rent_house,\n \"statsUpdatedAt\"  = NOW(),\n \"rentalUpdatedAt\" = NOW(),\n \"statsSource\"     = ${SOURCE_ID}\n FROM UNNEST(${ids}::text[]) AS u(id)\n WHERE s.id = u.id\n`;").map((f) => f.column)).toEqual(["statsSource", "statsUpdatedAt"]);
    // upsert update path, spread payloads, quoted keys
    expect(salesColumnWrites(`await db.suburb.upsert({ where: { slug }, create: { slug }, update: { ...(h ? { "medianHousePrice": h } : {}) } });`).map(({ op, column }) => ({ op, column }))).toEqual([{ op: "upsert.update", column: "medianHousePrice" }]);
    // a payload built elsewhere cannot be read, so it counts as a write
    expect(salesColumnWrites("await prisma.suburb.updateMany({ where: { state }, data: patch });")[0].column).toContain("not inline");
  });
  it("does not count reads: where, select, SQL WHERE, comments", () => {
    expect(salesColumnWrites(`// statsSource: SOURCE_ID
      const rows = await prisma.suburb.findMany({ where: { statsSource: "rental-nsw" }, select: { statsSource: true } });
      await prisma.suburb.updateMany({ where: { slug, statsSource: { notIn: ["sales-nsw"] } }, data: { region } });
      await prisma.$executeRaw\`UPDATE "Suburb" SET "region" = 'x' WHERE "statsSource" = 'seed'\`;`)).toEqual([]);
  });
});

describe("sales provenance writers", () => {
  it("scans the sync feeds, the runner, the cron helpers and the seeds", () => {
    for (const f of ["scripts/sync/run.ts", "scripts/sync/lib/runner.ts", "scripts/sync/sources/rental-nsw.ts", "scripts/sync/sources/rental-vic.ts", "scripts/sync/sources/rental-qld.ts", "scripts/sync/sources/rental-sa.ts", "scripts/sync/sources/rental-wa.ts", "scripts/sync/sources/nearby-suburbs.ts", "scripts/sync/sources/import-suburbs.ts"]) {
      expect(FILES, f).toContain(f);
    }
    for (const f of [...Object.keys(SALES_WRITERS), ...Object.keys(CREATORS)]) expect(FILES, `allowlisted file missing: ${f}`).toContain(f);
  });

  it("no rental, crime or other non-sales script writes a sales column to a Suburb row", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      if (SALES_WRITERS[file]) continue;
      const found = salesColumnWrites(readFileSync(file, "utf8"))
        .filter((f) => !(CREATORS[file] && f.op === "createMany"));
      for (const f of found) offenders.push(`${file}: ${f.op} writes ${f.column}`);
    }
    expect(offenders).toEqual([]);
  });

  it("the rental feeds never name the sales label at all", () => {
    for (const file of FILES.filter((f) => /scripts\/sync\/sources\/rental-[a-z]+\.ts$/.test(f))) {
      const code = stripComments(readFileSync(file, "utf8"));
      expect(code, file).not.toMatch(/\bstatsSource\s*:(?!\s*true\b)/);
      expect(code, file).not.toMatch(/"statsSource"\s*=/);
      expect(code, file).not.toMatch(/"statsUpdatedAt"\s*=|\bstatsUpdatedAt\s*:(?!\s*true\b)/);
    }
  });

  it("every allowlisted creator writes the columns only on rows it creates", () => {
    for (const file of Object.keys(CREATORS)) {
      const src = readFileSync(file, "utf8");
      expect(src, file).toMatch(/createMany\(\{\s*data:\s*chunk,\s*skipDuplicates:\s*true\s*\}\)/);
      expect(salesColumnWrites(src).filter((f) => f.op !== "createMany"), file).toEqual([]);
    }
  });
});
