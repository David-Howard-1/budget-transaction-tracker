import { getCurrentTimestampString } from '@/util/getCurrentTimestampString';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const categoriesTable = sqliteTable('categories', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  monthlyBudget: int(),
});

// export const usersTable = sqliteTable('users', {
//   id: int().primaryKey({ autoIncrement: true }),
//   name: text({ length: 256 }).notNull(),
// });

export const allowancesTable = sqliteTable('allowances', {
  id: int().primaryKey({ autoIncrement: true }),
  // userId: int().references(() => usersTable.id),
  // categoryId: int().references(() => categoriesTable.id),
  person: text({ enum: ['David', 'Kayla', 'Joint'] }).notNull(),
  monthlyLimit: int(),
});

export const transactionsTable = sqliteTable('transactions', {
  id: int().primaryKey({ autoIncrement: true }),
  categoryId: int()
    .references(() => categoriesTable.id)
    .notNull(),
  createdAt: text().default(getCurrentTimestampString()),
  updatedAt: text()
    .default(getCurrentTimestampString())
    .$onUpdate(() => getCurrentTimestampString()),
  date: text().notNull(),
  description: text(),
  person: text().notNull().default('Joint'),
  paymentMethod: text().notNull(),
  amount: int().notNull(),
});
