import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });
import { db } from '../src/lib/db';

async function main() {
  const slug = 'clifford-gardens-qld-4350';
  const [suburb, addressCount, sample] = await Promise.all([
    db.suburb.findUnique({ where: { slug }, select: { name: true, state: true } }),
    db.propertyAddress.count({ where: { suburbSlug: slug } }),
    db.propertyAddress.findFirst({
      where: { locality: { contains: 'CLIFFORD', mode: 'insensitive' }, state: 'QLD' },
      select: { locality: true, suburbSlug: true },
    }),
  ]);
  console.log('Suburb in DB:', suburb);
  console.log('Addresses linked to slug:', addressCount);
  console.log('Sample CLIFFORD row:', sample);
  await db.$disconnect();
}
main();
