/**
 * Migrates all existing property images from renet.photos to Vercel Blob.
 * Updates the Property_Image.url column in place.
 *
 * Run: npx tsx scripts/seed/migrate-images-to-blob.ts
 *
 * Requires BLOB_READ_WRITE_TOKEN env var (from Vercel dashboard → Storage → Blob).
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { put } from "@vercel/blob";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function uploadImageToBlob(sourceUrl: string, pathname: string): Promise<string> {
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const blob = await put(pathname, Buffer.from(buffer), {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return blob.url;
}

async function main() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error("❌ BLOB_READ_WRITE_TOKEN not set. Get it from Vercel dashboard → Storage → Blob → your store → .env.local");
    process.exit(1);
  }

  const images = await db.property_Image.findMany({
    where: { url: { contains: "renet.photos" } },
    select: { id: true, url: true, propertyId: true, sortOrder: true },
    orderBy: [{ propertyId: "asc" }, { sortOrder: "asc" }],
  });

  console.log(`Found ${images.length} images to migrate`);

  let migrated = 0;
  let failed = 0;

  for (const img of images) {
    try {
      const ext = img.url.match(/\.(jpe?g|png|webp)(\?|$)/i)?.[1] ?? "jpg";
      const blobPath = `images/properties/${img.propertyId}/${img.sortOrder}.${ext}`;
      const blobUrl = await uploadImageToBlob(img.url, blobPath);
      await db.property_Image.update({
        where: { id: img.id },
        data: { url: blobUrl },
      });
      migrated++;
      if (migrated % 10 === 0) console.log(`  ✅ ${migrated}/${images.length} migrated`);
    } catch (err) {
      console.warn(`  ⚠ Failed ${img.id} (${img.url.slice(0, 60)}): ${err}`);
      failed++;
    }
  }

  console.log(`\nDone. Migrated: ${migrated}, Failed: ${failed}`);
  await db.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
