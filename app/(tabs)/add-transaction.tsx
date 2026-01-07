import { db } from '@/db';
import { categoriesTable, transactionsTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput } from 'react-native';

export default function AddTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<
    (typeof categoriesTable.$inferSelect)['id'] | null
  >(null);
  const [person, setPerson] = useState<'David' | 'Kayla' | 'Joint'>('David');
  const [paymentMethod, setPaymentMethod] = useState<
    'Credit - WF' | 'Credit - Chase' | 'Debit'
  >('Credit - WF');
  const [description, setDescription] = useState('');
  const { data: categories } = useLiveQuery(db.select().from(categoriesTable));

  async function handleSave() {
    if (!amount || !categoryId) return;

    const inserted = await db.insert(transactionsTable).values({
      categoryId: categoryId,
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
          onPress={() => setCategoryId(c.id)}
          color={categoryId === c.id ? 'green' : undefined}
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
