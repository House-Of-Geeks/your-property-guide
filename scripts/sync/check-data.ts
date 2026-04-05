import "dotenv/config";
import { prisma } from "./db";

async function main() {
  const [rentalCount, crimeCount] = await Promise.all([
    prisma.suburbRentalStat.count(),
    prisma.suburbCrimeStat.count(),
  ]);
  
  const latestRental = await prisma.suburbRentalStat.findMany({
    take: 5,
    orderBy: { periodDate: "desc" },
    select: { suburbName: true, state: true, period: true, medianRentHouse: true, suburbSlug: true },
  });
  
  const latestCrime = await prisma.suburbCrimeStat.findMany({
    take: 5,
    orderBy: { periodDate: "desc" },
    select: { suburbName: true, state: true, period: true, totalOffences: true },
  });

  // Check if synced rental data has been linked to actual suburb slugs
  const matched = await prisma.suburbRentalStat.findMany({
    where: { suburbSlug: { not: null } },
    take: 3,
    select: { suburbSlug: true, suburbName: true, state: true, medianRentHouse: true, period: true },
  });

  console.log("=== DB Stats ===");
  console.log("Rental stats:", rentalCount);
  console.log("Crime stats:", crimeCount);
  console.log("\n=== Latest Rental ===");
  latestRental.forEach(r => console.log(`  ${r.suburbName} (${r.state}) ${r.period}: $${r.medianRentHouse}/wk slug=${r.suburbSlug}`));
  console.log("\n=== Latest Crime ===");
  latestCrime.forEach(r => console.log(`  ${r.suburbName} (${r.state}) ${r.period}: ${r.totalOffences} offences`));
  console.log("\n=== Matched Rental (linked to suburb slugs) ===");
  matched.forEach(r => console.log(`  ${r.suburbName} (${r.state}) → ${r.suburbSlug}: $${r.medianRentHouse}/wk`));
  await prisma.$disconnect();
}
main().catch(console.error);
