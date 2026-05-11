/**
 * Scans every public-facing image column in the DB and flags any URL the
 * site can't actually render. A URL is considered renderable when it's
 * either a local /public path or its hostname is in the Next/Image
 * remotePatterns allowlist — Next/Image refuses everything else.
 *
 * Catches the class of bug where a seed script (or a manual edit) stores
 * a third-party host that hasn't been allowlisted in next.config.ts, e.g.
 * an agency uploading a logo URL pointing at their own website. Those
 * render as blank tiles in prod and are otherwise invisible.
 *
 * Run: `npx tsx scripts/audit-image-urls.ts`
 * Exits non-zero if any bad URL is found, so it can be wired into CI later.
 */
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

// Keep in sync with next.config.ts `images.remotePatterns`. Hardcoded
// here (rather than imported) because next.config.ts runs before the
// `@/` path alias resolves, so we can't share a constant file without
// adding more plumbing than the list is worth.
const ALLOWED_HOST_PATTERNS = [
  /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i,
  /^images\.unsplash\.com$/i,
  /^renet\.photos$/i,
];

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

type Finding = {
  model: string;
  field: string;
  id: string;
  identifier: string;
  url: string;
  reason: string;
};

function classify(url: string): { ok: true } | { ok: false; reason: string } {
  if (!url) return { ok: false, reason: "empty string" };
  if (url.startsWith("/")) return { ok: true }; // local /public path
  if (url.startsWith("data:")) return { ok: true }; // inline data URI
  let host: string;
  try {
    host = new URL(url).hostname;
  } catch {
    return { ok: false, reason: "not a valid URL" };
  }
  const allowed = ALLOWED_HOST_PATTERNS.some((p) => p.test(host));
  if (allowed) return { ok: true };
  return { ok: false, reason: `host "${host}" not in next.config.ts remotePatterns` };
}

function record(findings: Finding[], model: string, field: string, id: string, identifier: string, url: string | null) {
  if (url == null) return; // nullable columns — empty is allowed
  const result = classify(url);
  if (result.ok) return;
  findings.push({ model, field, id, identifier, url, reason: result.reason });
}

async function main() {
  const findings: Finding[] = [];

  const agencies = await db.agency.findMany({
    select: { id: true, slug: true, logo: true, heroBg: true, ogImage: true },
  });
  for (const a of agencies) {
    record(findings, "Agency", "logo",    a.id, a.slug, a.logo);
    record(findings, "Agency", "heroBg",  a.id, a.slug, a.heroBg);
    record(findings, "Agency", "ogImage", a.id, a.slug, a.ogImage);
  }

  const agents = await db.agent.findMany({
    select: { id: true, slug: true, image: true, ogImage: true },
  });
  for (const a of agents) {
    record(findings, "Agent", "image",   a.id, a.slug, a.image);
    record(findings, "Agent", "ogImage", a.id, a.slug, a.ogImage);
  }

  const suburbs = await db.suburb.findMany({
    select: { id: true, slug: true, heroImage: true },
  });
  for (const s of suburbs) {
    record(findings, "Suburb", "heroImage", s.id, s.slug, s.heroImage);
  }

  const posts = await db.blogPost.findMany({
    select: { id: true, slug: true, coverImage: true, authorImage: true },
  });
  for (const p of posts) {
    record(findings, "BlogPost", "coverImage",  p.id, p.slug, p.coverImage);
    record(findings, "BlogPost", "authorImage", p.id, p.slug, p.authorImage);
  }

  const packages = await db.houseAndLandPackage.findMany({
    select: { id: true, slug: true, floorPlanImage: true },
  });
  for (const pkg of packages) {
    record(findings, "HouseAndLandPackage", "floorPlanImage", pkg.id, pkg.slug, pkg.floorPlanImage);
  }

  if (findings.length === 0) {
    console.log("✅ All image URLs are local or in next.config.ts remotePatterns.");
    return;
  }

  console.error(`❌ Found ${findings.length} broken image URL${findings.length === 1 ? "" : "s"}:\n`);
  for (const f of findings) {
    console.error(`  ${f.model}.${f.field}  (${f.identifier})`);
    console.error(`    url:    ${f.url}`);
    console.error(`    reason: ${f.reason}\n`);
  }
  process.exitCode = 1;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
