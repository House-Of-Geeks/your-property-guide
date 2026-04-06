import { PrismaClient } from "../../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const agents = await db.agent.findMany({ select: { id: true, fullName: true, agencyId: true }, take: 5 });
  const suburbs = await db.suburb.findMany({ select: { id: true, slug: true, name: true, state: true, postcode: true }, take: 5 });
  console.log("AGENTS:", JSON.stringify(agents, null, 2));
  console.log("SUBURBS:", JSON.stringify(suburbs, null, 2));
}
main().catch(console.error).finally(() => db.$disconnect());
