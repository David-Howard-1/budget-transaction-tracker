import { db } from '@/db';
import { categoriesTable, transactionsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [category, setCategory] =
    useState<typeof categoriesTable.$inferSelect>();
  const [person, setPerson] = useState<'David' | 'Kayla' | 'Joint'>('David');
  const [paymentMethod, setPaymentMethod] = useState<
    'Credit - WF' | 'Credit - Chase' | 'Debit'
  >('Credit - WF');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState<
    (typeof categoriesTable.$inferSelect)[]
  >([]);

  useEffect(() => {
    (async () => {
      const rows = await db.select().from(categoriesTable);
      setCategories(rows);
      setCategory(rows[0]);
    })();
  }, []);

  async function handleSave() {
    if (!amount || !category) return;

    const inserted = await db.insert(transactionsTable).values({
      categoryId: category.id,
      date: new Date().toISOString(),
      amount: Math.round(Number(amount) * 100), // cents
      person,
      description: description || null,
      paymentMethod,
    });

    const insertedTransaction = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.id, inserted.lastInsertRowId));

    console.log(JSON.stringify(insertedTransaction, null, 4));

    // router.back();
  }

  return (
    <ScrollView style={{ padding: 16, paddingTop: 100, gap: 12 }}>
      <Text>Add Transaction</Text>

      <TextInput
        placeholder="Amount (e.g. 12.34)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
        style={styles.textInput}
      />

      <TextInput
        placeholder="Description (optional)"
        value={description}
        onChangeText={setDescription}
        style={styles.textInput}
      />

      <Text>Category</Text>
      {categories.map((c) => (
        <Button
          key={c.id}
          title={c.name}
          onPress={() => setCategory(c)}
          color={category?.id === c.id ? 'green' : undefined}
        />
      ))}

      <Text>Payment Method</Text>
      {(['Credit - WF', 'Credit - Chase', 'Debit'] as const).map((pm) => (
        <Button
          key={pm}
          title={pm}
          onPress={() => setPaymentMethod(pm)}
          color={paymentMethod === pm ? 'green' : undefined}
        />
      ))}

      <Text>Person</Text>
      {(['David', 'Kayla', 'Joint'] as const).map((p) => (
        <Button
          key={p}
          title={p}
          onPress={() => setPerson(p)}
          color={person === p ? 'green' : undefined}
        />
      ))}

      <Button title="Save Transaction" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  textInput: {
    marginBottom: 20,
    color: 'white',
  },
});
