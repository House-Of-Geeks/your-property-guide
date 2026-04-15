/**
 * Migrates property slugs to remove agency name and add state code.
 * Old format: {street}-{suburb}-{postcode}-{agency}
 * New format: {street}-{suburb}-{state}-{postcode}
 *
 * Outputs a redirect map to paste into next.config.ts.
 *
 * Run: npx tsx scripts/seed/migrate-property-slugs.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  const properties = await db.property.findMany({
    select: { id: true, slug: true, addressStreet: true, addressSuburb: true, addressState: true, addressPostcode: true },
  });

  const redirects: { source: string; destination: string }[] = [];
  let updated = 0;

  for (const prop of properties) {
    const { id, slug: oldSlug, addressStreet, addressSuburb, addressState, addressPostcode } = prop;

    // Build the canonical new slug
    const slugBase = addressStreet
      ? `${addressStreet}-${addressSuburb}-${addressState}-${addressPostcode}`
      : `${addressSuburb}-${addressState}-${addressPostcode}-${id.split("-").pop()}`;
    const newSlug = slugify(slugBase);

    if (newSlug === oldSlug) {
      console.log(`  ✓ unchanged: ${oldSlug}`);
      continue;
    }

    console.log(`  ${oldSlug}`);
    console.log(`  → ${newSlug}`);
    console.log();

    await db.property.update({ where: { id }, data: { slug: newSlug } });
    redirects.push({ source: `/buy/${oldSlug}`, destination: `/buy/${newSlug}` });
    updated++;
  }

  console.log(`\nUpdated: ${updated} slugs\n`);

  if (redirects.length > 0) {
    console.log("Add these redirects to next.config.ts:\n");
    for (const r of redirects) {
      console.log(`      {`);
      console.log(`        source: "${r.source}",`);
      console.log(`        destination: "${r.destination}",`);
      console.log(`        permanent: true,`);
      console.log(`      },`);
    }
  }

  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
