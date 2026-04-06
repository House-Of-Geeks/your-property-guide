import "dotenv/config";
import { prisma } from "./db";
const slug = process.argv[2] ?? "gunning-nsw-2581";
prisma.suburb.findFirst({ where: { slug } }).then(s => {
  if (!s) { console.log("NOT FOUND"); } 
  else {
    const fields = [
      "medianHousePrice","medianUnitPrice","medianRentHouse","medianRentUnit",
      "annualGrowthHouse","annualGrowthUnit","salesCountHouse","daysOnMarket",
      "population","medianAge","ownerOccupied","renterOccupied",
      "householdsFamily","householdsLonePerson","statsSource"
    ];
    for (const f of fields) console.log(`${f}: ${(s as Record<string,unknown>)[f]}`);
  }
  prisma.$disconnect();
});
