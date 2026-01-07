import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { db } from '@/db';
import { allowancesTable, categoriesTable } from '@/db/schema';
import { seedDb } from '@/db/seed';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { useEffect, useState } from 'react';
import migrations from '../drizzle/migrations';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const [categories, setCategories] =
    useState<(typeof categoriesTable.$inferSelect)[]>();
  const [allowances, setAllowances] =
    useState<(typeof allowancesTable.$inferSelect)[]>();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!success) return;

    (async () => {
      // delete categories and allowances
      await db.delete(categoriesTable);
      await db.delete(allowancesTable);

      // Re-seed categories and allowances
      await seedDb();

      // Get from db
      const categoriesRows = await db.select().from(categoriesTable);
      const allowancesRows = await db.select().from(allowancesTable);

      // Set rows in state
      setCategories(categoriesRows);
      setAllowances(allowancesRows);
    })();
  }, [success]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
