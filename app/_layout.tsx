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
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Text, View } from 'react-native';
import migrations from '../drizzle/migrations';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const colorScheme = useColorScheme();

  const { data: categories } = useLiveQuery(db.select().from(categoriesTable));
  const { data: allowances } = useLiveQuery(db.select().from(allowancesTable));

  if (error) {
    return (
      <View style={{ padding: 40, paddingTop: 100 }}>
        <Text style={{ color: 'white' }}>Migration error: {error.message}</Text>
      </View>
    );
  }

  console.log(
    'Categories: ' + JSON.stringify(categories, null, 4),
    '\n\n',
    'Allowances: ' + JSON.stringify(allowances, null, 4)
  );

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
