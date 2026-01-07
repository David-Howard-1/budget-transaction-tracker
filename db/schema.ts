import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable('categories', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  monthlyBudget: int(),
});

export const allowancesTable = sqliteTable('allowances', {
  id: int().primaryKey({ autoIncrement: true }),
  person: text().notNull(),
  monthlyLimit: int(),
});

export const transactionsTable = sqliteTable('transactions', {
  id: int().primaryKey({ autoIncrement: true }),
  catogoryId: int()
    .references(() => categoriesTable.id)
    .notNull(),
  date: text().notNull(),
  description: text(),
  person: text().notNull().default('Joint'),
  paymentMethod: text().notNull(),
  amount: int().notNull(),
});
