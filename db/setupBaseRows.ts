import { db } from '.';
import { allowancesTable, categoriesTable } from './schema';
import { seedDb } from './seed';

export async function resetBaseRows() {
  // delete data
  await db.delete(categoriesTable);
  await db.delete(allowancesTable);

  // Re-seed
  await seedDb();

  // Get from db
  const categories = await db.select().from(categoriesTable);
  const allowances = await db.select().from(allowancesTable);

  // Return as data
  return { categories, allowances };
}
