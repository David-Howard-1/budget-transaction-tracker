import { db } from '.';
import { allowancesTable, categoriesTable } from './schema';

export async function seedDb() {
  await db.insert(categoriesTable).values([
    {
      name: 'Tithe',
      monthlyBudget: 988.34,
    },
    {
      name: 'Mortgage',
      monthlyBudget: 1717.99,
    },
    {
      name: 'Internet',
      monthlyBudget: 80,
    },
    {
      name: 'Power',
      monthlyBudget: 180,
    },
    {
      name: 'Personal',
      monthlyBudget: 150,
    },
  ]);

  await db.insert(allowancesTable).values([
    {
      person: 'David',
      monthlyLimit: 50,
    },
    {
      person: 'Kayla',
      monthlyLimit: 50,
    },
    {
      person: 'Joint',
      monthlyLimit: 50,
    },
  ]);
}
