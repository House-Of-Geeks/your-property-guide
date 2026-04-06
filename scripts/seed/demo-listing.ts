/**
 * Seeds a demo "for sale" listing in North Lakes QLD.
 * Run: npx tsx scripts/seed/demo-listing.ts
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  // Upsert so re-running is safe
  await db.property.upsert({
    where: { slug: "12-lakeview-crescent-north-lakes-qld-4509" },
    update: {},
    create: {
      id:              "demo-property-1",
      slug:            "12-lakeview-crescent-north-lakes-qld-4509",
      listingType:     "buy",
      propertyType:    "house",
      status:          "active",
      title:           "Modern Family Home with Pool in the Heart of North Lakes",
      addressStreet:   "12 Lakeview Crescent",
      addressSuburb:   "North Lakes",
      addressState:    "QLD",
      addressPostcode: "4509",
      addressFull:     "12 Lakeview Crescent, North Lakes QLD 4509",
      priceDisplay:    "$849,000",
      priceValue:      849000,
      priceIsRange:    false,
      bedrooms:        4,
      bathrooms:       2,
      carSpaces:       2,
      landSize:        540,
      buildingSize:    248,
      description:     `Welcome to 12 Lakeview Crescent — a beautifully presented family home nestled in one of North Lakes' most sought-after streets.

From the moment you arrive, you'll be impressed by the rendered facade, manicured gardens and double garage. Step inside to discover a spacious open-plan living and dining area that seamlessly flows to a covered alfresco entertaining space and sparkling in-ground pool — the perfect setup for year-round entertaining.

The gourmet kitchen is a chef's delight, featuring stone benchtops, 900mm freestanding oven, walk-in pantry and island bench with breakfast bar. The master suite is a true retreat with a walk-in robe and luxurious ensuite. Three additional bedrooms are serviced by the main bathroom and there is a dedicated home office or study.

Additional features include:
- Ducted air-conditioning throughout
- Solar panels (6.6kW system)
- Separate laundry with external access
- Fully fenced yard with side gate access
- Garden shed
- 540m² block

Positioned within walking distance to North Lakes State College, Westfield North Lakes shopping centre, parks, and public transport. Easy access to the Bruce Highway makes the CBD or Sunshine Coast a simple commute.

Properties of this calibre in this location are tightly held — don't miss your opportunity to secure this exceptional family home.`,
      agentId:         "agent-1",
      agencyId:        "agency-1",
      suburbSlug:      "north-lakes-qld-4509",
      inspectionTimes: ["Saturday 26 Apr 10:00am – 10:30am", "Wednesday 30 Apr 5:00pm – 5:30pm"],
      dateAdded:       new Date("2026-04-01"),
      isFeatured:      true,
      images: {
        create: [
          {
            url:       "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=800&fit=crop",
            alt:       "Modern family home exterior with landscaped gardens",
            width:     1200,
            height:    800,
            sortOrder: 0,
          },
          {
            url:       "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=1200&h=800&fit=crop",
            alt:       "Open plan kitchen and living area",
            width:     1200,
            height:    800,
            sortOrder: 1,
          },
          {
            url:       "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&h=800&fit=crop",
            alt:       "Alfresco entertaining area and pool",
            width:     1200,
            height:    800,
            sortOrder: 2,
          },
          {
            url:       "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&h=800&fit=crop",
            alt:       "Master bedroom with walk-in robe",
            width:     1200,
            height:    800,
            sortOrder: 3,
          },
          {
            url:       "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&h=800&fit=crop",
            alt:       "Modern bathroom with stone benchtop",
            width:     1200,
            height:    800,
            sortOrder: 4,
          },
        ],
      },
    },
  });

  console.log("✅ Demo listing seeded: 12 Lakeview Crescent, North Lakes QLD 4509");
  console.log("   → /buy/12-lakeview-crescent-north-lakes-qld-4509");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => db.$disconnect());
