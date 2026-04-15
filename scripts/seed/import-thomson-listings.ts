/**
 * Scrapes all active for-sale, sold, and rental listings from thomsonpropertygroup.com.au
 * and upserts them into the YPG database.
 *
 * Run: npx tsx scripts/seed/import-thomson-listings.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { put } from "@vercel/blob";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// ─── Known listing IDs ────────────────────────────────────────────────────────
const FOR_SALE_IDS = ["21599275", "21609732", "21613344", "21611295", "21613358"];
const SOLD_IDS     = ["21571804", "21560321", "21548139", "21452779", "21237083",
                      "21457773", "21124878", "21447560", "21390127", "21378959",
                      "21369936", "21049882"];

const ACCOUNT_ID = "10049013"; // ReNet account for Thomson
const BASE_URL   = "https://www.thomsonpropertygroup.com.au";

// ─── DB constants ─────────────────────────────────────────────────────────────
const AGENCY_ID   = "agency-1";
const AGENTS: Record<string, string> = {
  matthew: "agent-1",
  dylan:   "agent-2",
  hannah:  "agent-3",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function slugify(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function extractMeta(html: string, property: string): string {
  const m = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`, "i"))
         || html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`, "i"));
  return m?.[1]?.trim() ?? "";
}

function parseAddress(rawTitle: string) {
  // Decode HTML entities then split on ">" or "&gt;"
  const title = rawTitle.replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&#\d+;/g, "");
  // "4/18-20 Wyllie Street, Redcliffe > Thomson Property Group"
  const part = title.split(">")[0].trim();
  const commaIdx = part.lastIndexOf(",");
  if (commaIdx === -1) {
    // No comma — suburb only (e.g. "Newport > Thomson Property Group")
    return { street: "", suburb: part.trim() };
  }
  return { street: part.slice(0, commaIdx).trim(), suburb: part.slice(commaIdx + 1).trim() };
}

function extractImages(html: string): string[] {
  const seen = new Set<string>();
  const results: string[] = [];
  // Background images in style attrs
  for (const m of html.matchAll(/renet\.photos\/w\/\d+\/\d+\/images\/([^\s"'\\)]+)/g)) {
    const url = `https://renet.photos/w/1600/${ACCOUNT_ID}/images/${m[1].replace(/_original/, "_original")}`;
    if (!seen.has(url)) { seen.add(url); results.push(url); }
  }
  return results;
}

async function uploadImageToBlob(sourceUrl: string, pathname: string): Promise<string> {
  const res = await fetch(sourceUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`Failed to fetch image ${sourceUrl}: ${res.status}`);
  const buffer = await res.arrayBuffer();
  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const blob = await put(pathname, Buffer.from(buffer), {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return blob.url;
}

function extractDescription(text: string): string {
  // Body text arrives as innerText-style; description sits after the first heading line
  // and before "Exclusive Agent" or "Thomson the family name"
  const start = text.search(/\n\n[A-Z].{20,}/); // first paragraph after features
  const end   = text.search(/Exclusive [Aa]gent|Thomson the family/);
  if (start === -1 || end === -1 || end <= start) return text.slice(0, 1000).trim();
  return text.slice(start, end).trim().slice(0, 5000);
}

function parseFeatures(bodyText: string) {
  const num = (pattern: RegExp) => {
    const m = bodyText.match(pattern);
    return m ? parseInt(m[1] || m[2] || "0") : 0;
  };
  const bedrooms  = num(/Bedrooms\s*\n\s*(\d+)|BED\s*\n\s*(\d+)/i);
  const bathrooms = num(/Bathrooms\s*\n\s*(\d+)|BATH\s*\n\s*(\d+)/i);
  const carSpaces = num(/Garage\s*\n\s*(\d+)|CAR\s*\n\s*(\d+)/i);
  const landM = bodyText.match(/Land Size\s*\n\s*(\d[\d,]*)\s*sqm/i);
  const landSize  = landM ? parseInt(landM[1].replace(/,/g, "")) : null;
  const isUnit    = /Units In Complex/i.test(bodyText);
  return { bedrooms, bathrooms, carSpaces, landSize, isUnit };
}

function parseStatus(bodyText: string) {
  if (/\bSOLD\b/.test(bodyText))           return "SOLD";
  if (/UNDER CONTRACT/i.test(bodyText))    return "UNDER CONTRACT";
  if (/COMING SOON/i.test(bodyText))       return "COMING SOON";
  if (/OPEN TO OFFERS/i.test(bodyText))    return "OPEN TO OFFERS";
  return "FOR SALE";
}

function parsePrice(bodyText: string, statusText: string) {
  const m = bodyText.match(/\$\s*([\d,]+(?:\.\d+)?)/);
  if (m) {
    const val = parseInt(m[1].replace(/,/g, ""));
    // Sanity: must look like a property price (>= 100k)
    if (val >= 100_000) return { display: `$${m[1]}`, value: val };
  }
  if (statusText === "COMING SOON")  return { display: "Coming Soon",    value: null };
  if (statusText === "SOLD")         return { display: "Sold",           value: null };
  return { display: "Open To Offers", value: null };
}

function detectAgent(bodyText: string): string {
  if (/Hannah Thomson/i.test(bodyText))  return AGENTS.hannah;
  if (/Dylan Thomson/i.test(bodyText))   return AGENTS.dylan;
  return AGENTS.matthew; // default
}

async function findSuburb(name: string, state = "QLD") {
  const rows = await db.suburb.findMany({
    where: { name: { equals: name, mode: "insensitive" }, state },
    select: { slug: true, postcode: true },
    orderBy: { slug: "asc" },
  });
  // Prefer QLD match
  return rows[0] ?? null;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function importListing(id: string, defaultListingType: "buy" | "sold") {
  const url  = `${BASE_URL}/${id}`;
  const res  = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  const html = await res.text();

  // Strip HTML tags from body for text parsing
  const bodyText = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#\d+;/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const rawTitle   = titleMatch?.[1] ?? "";
  const addr       = parseAddress(rawTitle);
  if (!addr) {
    console.warn(`  ⚠  Could not parse address from title: "${rawTitle}" — skipping`);
    return;
  }

  // Suburb
  const suburb = await findSuburb(addr.suburb);
  if (!suburb) {
    console.warn(`  ⚠  Suburb not found in DB: "${addr.suburb}" — skipping ${id}`);
    return;
  }

  // Features
  const { bedrooms, bathrooms, carSpaces, landSize, isUnit } = parseFeatures(bodyText);

  // Status & listing type
  const statusText  = parseStatus(bodyText);
  const listingType = (statusText === "SOLD" || defaultListingType === "sold") ? "sold" : "buy";
  const dbStatus    = listingType === "sold" ? "sold"
                    : statusText === "UNDER CONTRACT" ? "under-contract"
                    : "active";

  // Price
  const price = parsePrice(bodyText, statusText);

  // Title & description
  const ogTitle   = extractMeta(html, "og:title");
  const ogDesc    = extractMeta(html, "og:description");
  const propTitle = ogTitle ? (ogDesc ? `${ogTitle} - ${ogDesc}` : ogTitle) : `${addr.street}, ${addr.suburb}`;
  const description = extractDescription(bodyText);

  // Images — download from renet.photos and upload to Vercel Blob
  const rawImageUrls = extractImages(html);
  const images: string[] = [];
  for (let i = 0; i < rawImageUrls.length; i++) {
    try {
      const ext = rawImageUrls[i].match(/\.(jpe?g|png|webp)(\?|$)/i)?.[1] ?? "jpg";
      const blobPath = `images/properties/thomson-${id}/${i}.${ext}`;
      const blobUrl = await uploadImageToBlob(rawImageUrls[i], blobPath);
      images.push(blobUrl);
    } catch (err) {
      console.warn(`    ⚠ Failed to upload image ${i} for ${id}, using source URL:`, err);
      images.push(rawImageUrls[i]);
    }
  }

  // Agent & property type
  const agentId      = detectAgent(bodyText);
  const propertyType = isUnit ? "unit" : "house";

  // Slug — use listing ID when no street so suburb-only entries don't collide
  const slugBase = addr.street
    ? `${addr.street}-${addr.suburb}-${suburb.postcode}`
    : `${addr.suburb}-${suburb.postcode}-${id}`;
  const slug = slugify(`${slugBase}-thomson`);
  const addressFull = addr.street
    ? `${addr.street}, ${addr.suburb} QLD ${suburb.postcode}`
    : `${addr.suburb} QLD ${suburb.postcode}`;

  console.log(`  → [${listingType}] ${addr.street}, ${addr.suburb} (${images.length} photos, ${bedrooms}bd ${bathrooms}ba)`);

  await db.property.upsert({
    where:  { id: `thomson-${id}` },
    update: {
      status:          dbStatus,
      priceDisplay:    price.display,
      priceValue:      price.value,
      bedrooms,
      bathrooms,
      carSpaces,
      landSize,
      description:     description || propTitle,
      inspectionTimes: [],
      agentId,
      images: {
        deleteMany: {},
        create: images.map((url, i) => ({
          url,
          alt:       `${addr.street}, ${addr.suburb} — photo ${i + 1}`,
          width:     1600,
          height:    1067,
          sortOrder: i,
        })),
      },
    },
    create: {
      id:              `thomson-${id}`,
      slug,
      listingType,
      propertyType,
      status:          dbStatus,
      title:           propTitle,
      addressStreet:   addr.street,
      addressSuburb:   addr.suburb,
      addressState:    "QLD",
      addressPostcode: suburb.postcode,
      addressFull,
      priceDisplay:    price.display,
      priceValue:      price.value,
      priceIsRange:    false,
      bedrooms,
      bathrooms,
      carSpaces,
      landSize,
      description:     description || propTitle,
      agentId,
      agencyId:        AGENCY_ID,
      suburbSlug:      suburb.slug,
      inspectionTimes: [],
      dateAdded:       new Date(),
      isFeatured:      false,
      images: {
        create: images.map((url, i) => ({
          url,
          alt:       `${addr.street}, ${addr.suburb} — photo ${i + 1}`,
          width:     1600,
          height:    1067,
          sortOrder: i,
        })),
      },
    },
  });
}

async function main() {
  console.log("Importing Thomson Property Group listings...\n");

  console.log(`For Sale (${FOR_SALE_IDS.length}):`);
  for (const id of FOR_SALE_IDS) {
    try { await importListing(id, "buy"); }
    catch (e) { console.error(`  ✗ ${id}:`, e); }
  }

  console.log(`\nSold (${SOLD_IDS.length}):`);
  for (const id of SOLD_IDS) {
    try { await importListing(id, "sold"); }
    catch (e) { console.error(`  ✗ ${id}:`, e); }
  }

  console.log("\n✅ Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
