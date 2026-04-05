import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { agencies } from "../src/lib/data/agencies";
import { agents } from "../src/lib/data/agents";
import { suburbs } from "../src/lib/data/suburbs";
import { properties } from "../src/lib/data/properties";
import { houseAndLandPackages } from "../src/lib/data/house-and-land";
import { blogPosts } from "../src/lib/data/blogs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// The data files use short slugs like "burpengary" but properties/packages
// reference compound slugs like "burpengary-qld-4505". Derive the compound
// slug so the FK constraints are satisfied.
function suburbCompoundSlug(name: string, state: string, postcode: string): string {
  return `${name.toLowerCase().replace(/\s+/g, "-")}-${state.toLowerCase()}-${postcode}`;
}

async function reset() {
  console.log("🧹 Clearing existing agents, agencies and their properties...");
  await prisma.houseAndLand_Image.deleteMany({});
  await prisma.houseAndLandPackage.deleteMany({});
  await prisma.property_Image.deleteMany({});
  await prisma.property.deleteMany({});
  await prisma.agent.deleteMany({});
  await prisma.agency.deleteMany({});
  console.log("  ✓ Cleared\n");
}

async function main() {
  console.log("🌱 Starting seed...\n");

  await reset();

  // ── 1. Agencies ────────────────────────────────────────────────────────────
  console.log("Seeding agencies...");
  for (const agency of agencies) {
    await prisma.agency.upsert({
      where: { slug: agency.slug },
      create: {
        id: agency.id,
        slug: agency.slug,
        name: agency.name,
        logo: agency.logo,
        description: agency.description,
        phone: agency.phone,
        email: agency.email,
        website: agency.website,
        addressStreet: agency.address.street,
        addressSuburb: agency.address.suburb,
        addressState: agency.address.state,
        addressPostcode: agency.address.postcode,
        addressFull: agency.address.full,
        suburbs: agency.suburbs,
        primaryColor: agency.primaryColor ?? null,
      },
      update: {
        name: agency.name,
        logo: agency.logo,
        description: agency.description,
        phone: agency.phone,
        email: agency.email,
        website: agency.website,
        addressStreet: agency.address.street,
        addressSuburb: agency.address.suburb,
        addressState: agency.address.state,
        addressPostcode: agency.address.postcode,
        addressFull: agency.address.full,
        suburbs: agency.suburbs,
        primaryColor: agency.primaryColor ?? null,
      },
    });
  }
  console.log(`  ✓ ${agencies.length} agencies seeded`);

  // ── 2. Suburbs (with Schools) ──────────────────────────────────────────────
  console.log("Seeding suburbs...");
  for (const suburb of suburbs) {
    const slug = suburbCompoundSlug(suburb.name, suburb.state, suburb.postcode);

    await prisma.suburb.upsert({
      where: { slug },
      create: {
        id: suburb.id,
        slug,
        name: suburb.name,
        postcode: suburb.postcode,
        state: suburb.state,
        region: suburb.region,
        description: suburb.description,
        heroImage: suburb.heroImage,
        medianHousePrice: suburb.stats.medianHousePrice,
        medianUnitPrice: suburb.stats.medianUnitPrice,
        medianRentHouse: suburb.stats.medianRentHouse,
        medianRentUnit: suburb.stats.medianRentUnit,
        annualGrowthHouse: suburb.stats.annualGrowthHouse,
        annualGrowthUnit: suburb.stats.annualGrowthUnit,
        daysOnMarket: suburb.stats.daysOnMarket,
        population: suburb.stats.population,
        medianAge: suburb.stats.medianAge,
        ownerOccupied: suburb.stats.ownerOccupied,
        renterOccupied: suburb.stats.renterOccupied,
        amenities: suburb.amenities,
        transportLinks: suburb.transportLinks,
        nearbySuburbs: suburb.nearbySuburbs,
        schools: {
          create: suburb.schools.map((school) => ({
            name: school.name,
            type: school.type,
            sector: school.sector,
            distance: school.distance,
          })),
        },
      },
      update: {
        name: suburb.name,
        postcode: suburb.postcode,
        state: suburb.state,
        region: suburb.region,
        description: suburb.description,
        heroImage: suburb.heroImage,
        medianHousePrice: suburb.stats.medianHousePrice,
        medianUnitPrice: suburb.stats.medianUnitPrice,
        medianRentHouse: suburb.stats.medianRentHouse,
        medianRentUnit: suburb.stats.medianRentUnit,
        annualGrowthHouse: suburb.stats.annualGrowthHouse,
        annualGrowthUnit: suburb.stats.annualGrowthUnit,
        daysOnMarket: suburb.stats.daysOnMarket,
        population: suburb.stats.population,
        medianAge: suburb.stats.medianAge,
        ownerOccupied: suburb.stats.ownerOccupied,
        renterOccupied: suburb.stats.renterOccupied,
        amenities: suburb.amenities,
        transportLinks: suburb.transportLinks,
        nearbySuburbs: suburb.nearbySuburbs,
      },
    });

    // Delete and recreate schools on update
    await prisma.school.deleteMany({ where: { suburbId: suburb.id } });
    await prisma.school.createMany({
      data: suburb.schools.map((school) => ({
        name: school.name,
        type: school.type,
        sector: school.sector,
        distance: school.distance,
        suburbId: suburb.id,
      })),
    });
  }
  console.log(`  ✓ ${suburbs.length} suburbs seeded`);

  // ── 3. Agents ──────────────────────────────────────────────────────────────
  console.log("Seeding agents...");
  for (const agent of agents) {
    await prisma.agent.upsert({
      where: { slug: agent.slug },
      create: {
        id: agent.id,
        slug: agent.slug,
        firstName: agent.firstName,
        lastName: agent.lastName,
        fullName: agent.fullName,
        title: agent.title,
        phone: agent.phone,
        email: agent.email,
        bio: agent.bio,
        image: agent.image,
        agencyId: agent.agencyId,
        suburbs: agent.suburbs,
        specialties: agent.specialties,
        yearsExperience: agent.yearsExperience,
        propertiesSold: agent.propertiesSold ?? 0,
        reviewCount: agent.reviewCount ?? 0,
        averageRating: agent.averageRating ?? 0,
        isFeatured: agent.isFeatured ?? false,
      },
      update: {
        firstName: agent.firstName,
        lastName: agent.lastName,
        fullName: agent.fullName,
        title: agent.title,
        phone: agent.phone,
        email: agent.email,
        bio: agent.bio,
        image: agent.image,
        agencyId: agent.agencyId,
        suburbs: agent.suburbs,
        specialties: agent.specialties,
        yearsExperience: agent.yearsExperience,
        propertiesSold: agent.propertiesSold ?? 0,
        reviewCount: agent.reviewCount ?? 0,
        averageRating: agent.averageRating ?? 0,
        isFeatured: agent.isFeatured ?? false,
      },
    });
  }
  console.log(`  ✓ ${agents.length} agents seeded`);

  // ── 4. Properties (with Images) ────────────────────────────────────────────
  console.log("Seeding properties...");
  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      create: {
        id: property.id,
        slug: property.slug,
        listingType: property.listingType,
        propertyType: property.propertyType,
        status: property.status,
        title: property.title,
        addressStreet: property.address.street,
        addressSuburb: property.address.suburb,
        addressState: property.address.state,
        addressPostcode: property.address.postcode,
        addressFull: property.address.full,
        priceDisplay: property.price.display,
        priceValue: property.price.value ?? null,
        priceIsRange: property.price.isRange ?? false,
        priceMin: property.price.min ?? null,
        priceMax: property.price.max ?? null,
        priceRentPerWeek: property.price.rentPerWeek ?? null,
        bedrooms: property.features.bedrooms,
        bathrooms: property.features.bathrooms,
        carSpaces: property.features.carSpaces,
        landSize: property.features.landSize ?? null,
        buildingSize: property.features.buildingSize ?? null,
        description: property.description,
        agentId: property.agentId,
        agencyId: property.agencyId,
        suburbSlug: property.suburbSlug,
        inspectionTimes: property.inspectionTimes ?? [],
        auctionDate: property.auctionDate ? new Date(property.auctionDate) : null,
        dateAdded: new Date(property.dateAdded),
        dateSold: property.dateSold ? new Date(property.dateSold) : null,
        soldPrice: property.soldPrice ?? null,
        isOffMarket: property.isOffMarket ?? false,
        isFeatured: property.isFeatured ?? false,
      },
      update: {
        listingType: property.listingType,
        propertyType: property.propertyType,
        status: property.status,
        title: property.title,
        addressStreet: property.address.street,
        addressSuburb: property.address.suburb,
        addressState: property.address.state,
        addressPostcode: property.address.postcode,
        addressFull: property.address.full,
        priceDisplay: property.price.display,
        priceValue: property.price.value ?? null,
        priceIsRange: property.price.isRange ?? false,
        priceMin: property.price.min ?? null,
        priceMax: property.price.max ?? null,
        priceRentPerWeek: property.price.rentPerWeek ?? null,
        bedrooms: property.features.bedrooms,
        bathrooms: property.features.bathrooms,
        carSpaces: property.features.carSpaces,
        landSize: property.features.landSize ?? null,
        buildingSize: property.features.buildingSize ?? null,
        description: property.description,
        agentId: property.agentId,
        agencyId: property.agencyId,
        suburbSlug: property.suburbSlug,
        inspectionTimes: property.inspectionTimes ?? [],
        auctionDate: property.auctionDate ? new Date(property.auctionDate) : null,
        dateAdded: new Date(property.dateAdded),
        dateSold: property.dateSold ? new Date(property.dateSold) : null,
        soldPrice: property.soldPrice ?? null,
        isOffMarket: property.isOffMarket ?? false,
        isFeatured: property.isFeatured ?? false,
      },
    });

    // Delete and recreate images
    await prisma.property_Image.deleteMany({ where: { propertyId: property.id } });
    if (property.images && property.images.length > 0) {
      await prisma.property_Image.createMany({
        data: property.images.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          width: img.width,
          height: img.height,
          sortOrder: index,
          propertyId: property.id,
        })),
      });
    }
  }
  console.log(`  ✓ ${properties.length} properties seeded`);

  // ── 5. House & Land Packages (with Images) ─────────────────────────────────
  console.log("Seeding house & land packages...");
  for (const pkg of houseAndLandPackages) {
    await prisma.houseAndLandPackage.upsert({
      where: { slug: pkg.slug },
      create: {
        id: pkg.id,
        slug: pkg.slug,
        title: pkg.title,
        builder: pkg.builder,
        estate: pkg.estate,
        suburb: pkg.suburb,
        suburbSlug: pkg.suburbSlug,
        priceDisplay: pkg.price.display,
        priceValue: pkg.price.value,
        bedrooms: pkg.features.bedrooms,
        bathrooms: pkg.features.bathrooms,
        carSpaces: pkg.features.carSpaces,
        landSize: pkg.features.landSize,
        buildingSize: pkg.features.buildingSize,
        description: pkg.description,
        floorPlanImage: pkg.floorPlanImage ?? null,
        agentId: pkg.agentId,
        agencyId: pkg.agencyId,
        inclusions: pkg.inclusions ?? [],
        isNew: pkg.isNew ?? false,
        dateAdded: new Date(pkg.dateAdded),
      },
      update: {
        title: pkg.title,
        builder: pkg.builder,
        estate: pkg.estate,
        suburb: pkg.suburb,
        suburbSlug: pkg.suburbSlug,
        priceDisplay: pkg.price.display,
        priceValue: pkg.price.value,
        bedrooms: pkg.features.bedrooms,
        bathrooms: pkg.features.bathrooms,
        carSpaces: pkg.features.carSpaces,
        landSize: pkg.features.landSize,
        buildingSize: pkg.features.buildingSize,
        description: pkg.description,
        floorPlanImage: pkg.floorPlanImage ?? null,
        agentId: pkg.agentId,
        agencyId: pkg.agencyId,
        inclusions: pkg.inclusions ?? [],
        isNew: pkg.isNew ?? false,
        dateAdded: new Date(pkg.dateAdded),
      },
    });

    // Delete and recreate images
    await prisma.houseAndLand_Image.deleteMany({ where: { packageId: pkg.id } });
    if (pkg.images && pkg.images.length > 0) {
      await prisma.houseAndLand_Image.createMany({
        data: pkg.images.map((img, index) => ({
          url: img.url,
          alt: img.alt,
          sortOrder: index,
          packageId: pkg.id,
        })),
      });
    }
  }
  console.log(`  ✓ ${houseAndLandPackages.length} house & land packages seeded`);

  // ── 6. Blog Posts ──────────────────────────────────────────────────────────
  console.log("Seeding blog posts...");
  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        authorName: post.author.name,
        authorImage: post.author.image,
        category: post.category,
        tags: post.tags,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        readingTime: post.readingTime,
      },
      update: {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        authorName: post.author.name,
        authorImage: post.author.image,
        category: post.category,
        tags: post.tags,
        publishedAt: new Date(post.publishedAt),
        updatedAt: post.updatedAt ? new Date(post.updatedAt) : null,
        readingTime: post.readingTime,
      },
    });
  }
  console.log(`  ✓ ${blogPosts.length} blog posts seeded`);

  // ── 7. Data Sources (sync registry) ───────────────────────────────────────
  console.log("Seeding data sources...");
  const dataSources = [
    { id: "import-suburbs", label: "Suburb Stub Importer",           category: "suburbs",      schedule: "quarterly", sourceUrl: "internal" },
    { id: "abs-census",    label: "ABS 2021 Census (SAL)",           category: "demographics", schedule: "annual",    sourceUrl: "https://www.abs.gov.au/census/find-census-data/datapacks" },
    { id: "acara-schools", label: "ACARA School Profiles",          category: "schools", schedule: "annual",    sourceUrl: "https://www.acara.edu.au/contact-us/acara-data-access" },
    { id: "rental-vic",    label: "VIC Rental Report (DFFH)",        category: "rental",  schedule: "quarterly", sourceUrl: "https://discover.data.vic.gov.au/dataset/rental-report" },
    { id: "rental-nsw",    label: "NSW Rent and Sales Report",        category: "rental",  schedule: "quarterly", sourceUrl: "https://data.nsw.gov.au/data/dataset/rent-and-sales-report" },
    { id: "rental-sa",     label: "SA Private Rent Report",           category: "rental",  schedule: "quarterly", sourceUrl: "https://data.sa.gov.au/data/dataset/private-rent-report" },
    { id: "crime-nsw",     label: "NSW Crime Stats (BOCSAR)",         category: "crime",   schedule: "quarterly", sourceUrl: "https://bocsar.nsw.gov.au/statistics-dashboards/open-datasets/criminal-offences-data.html" },
    { id: "crime-vic",     label: "VIC Crime Statistics Agency",      category: "crime",   schedule: "quarterly", sourceUrl: "https://www.crimestatistics.vic.gov.au/crime-statistics/latest-victorian-crime-data/download-data" },
    { id: "crime-qld",     label: "QLD Police Reported Offences",     category: "crime",   schedule: "quarterly", sourceUrl: "https://www.data.qld.gov.au/dataset/reported-offences-qld" },
    { id: "crime-sa",      label: "SA Police Crime Statistics",       category: "crime",   schedule: "quarterly", sourceUrl: "https://data.sa.gov.au/data/dataset/crime-statistics" },
    { id: "crime-wa",      label: "WA Police Crime Statistics",       category: "crime",   schedule: "annual",    sourceUrl: "https://www.police.wa.gov.au/Crime/CrimeStatistics" },
    { id: "sales-vic",          label: "VIC Property Sales Report",         category: "sales",   schedule: "quarterly", sourceUrl: "https://discover.data.vic.gov.au/dataset/victorian-property-sales-report-median-house-by-suburb" },
    { id: "sales-sa",           label: "SA Metro Median House Sales",       category: "sales",   schedule: "quarterly", sourceUrl: "https://data.sa.gov.au/data/dataset/0d447195-1158-4a3c-8cc7-0e333b87eb72" },
    { id: "import-suburbs-all", label: "National Suburb List (AU Postcodes)", category: "suburbs", schedule: "annual",    sourceUrl: "https://github.com/matthewproctor/australianpostcodes" },
  ];
  for (const ds of dataSources) {
    await prisma.dataSource.upsert({
      where: { id: ds.id },
      create: ds,
      update: { label: ds.label, sourceUrl: ds.sourceUrl },
    });
  }
  console.log(`  ✓ ${dataSources.length} data sources seeded`);

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log("\n✅ Seed complete!");
  console.log(`   Agencies:              ${agencies.length}`);
  console.log(`   Suburbs:               ${suburbs.length}`);
  console.log(`   Agents:                ${agents.length}`);
  console.log(`   Properties:            ${properties.length}`);
  console.log(`   House & Land packages: ${houseAndLandPackages.length}`);
  console.log(`   Blog posts:            ${blogPosts.length}`);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
