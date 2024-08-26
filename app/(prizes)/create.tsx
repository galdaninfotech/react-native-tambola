import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
// import { useToast } from '@/components/ui/use-toast';
 
export default function Create() {
  const prizes = useQuery(api.prizes.getAllPrizes);
  const gamePrizes = useQuery(api.prizes.getAllGamePrizes);
  const addPrize = useMutation(api.prizes.addPrize);
  const setPrizes = useMutation(api.board.setPrizes);

  const [prizeId, setPrizeId] = useState('');
  const [amount, setAmount] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [active, setActive] = useState('yes');
  const [remarks, setRemarks] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
//   const { toast } = useToast();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Add Prizes</Text>
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Choose prize</Text>
          <Picker
            selectedValue={prizeId as Id<"prizes"> | undefined}
            onValueChange={(itemValue: Id<"prizes">) => setPrizeId(itemValue)}
            style={styles.input}
          >
            <Picker.Item label="Select a prize" value={undefined} />
            {prizes?.map((prize, index) => (
              <Picker.Item key={index} label={prize.name} value={prize._id} />
            ))}
          </Picker>
        </View>

        <View style={styles.row}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              value={String(amount)}
              onChangeText={(text) => setAmount(Number(text))}
              keyboardType="numeric"
              placeholder="Prize Amount"
              style={styles.input}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Quantity</Text>
            <TextInput
              value={String(quantity)}
              onChangeText={(text) => setQuantity(Number(text))}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Active</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={styles.radio}
              onPress={() => setActive('yes')}
            >
              <Text style={styles.radioLabel}>Yes</Text>
              <View style={active === 'yes' ? styles.radioSelected : styles.radioUnselected}></View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.radio}
              onPress={() => setActive('no')}
            >
              <Text style={styles.radioLabel}>No</Text>
              <View style={active === 'no' ? styles.radioSelected : styles.radioUnselected}></View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Remarks</Text>
          <TextInput
            value={remarks}
            onChangeText={(text) => setRemarks(text)}
            placeholder="Remarks"
            style={[styles.input, styles.textarea]}
            multiline
            numberOfLines={5}
          />
        </View>

        <Button
          title={isSubmitting ? 'Submitting...' : 'Add Prize'}
          disabled={isSubmitting}
          onPress={async () => {
            setIsSubmitting(true);
            try {
              const gamePrize = await addPrize({
                prizeId: prizeId as Id<'prizes'>,
                amount: amount as number,
                quantity: quantity as number,
                active: active === 'yes',
                remarks: remarks,
              });

            //   if (gamePrize) {
            //     toast({
            //       title: 'Prize added successfully!',
            //       description: 'Prize has been added successfully.',
            //       duration: 2000,
            //     });
            //   }
            } catch (error) {
            //   toast({
            //     variant: 'destructive',
            //     title: 'Error!',
            //     description: error instanceof Error ? error.message : String(error),
            //   });
            } finally {
              setIsSubmitting(false);
              setPrizeId('');
              setAmount(0);
              setQuantity(1);
              setActive('yes');
              setRemarks('');
            }
          }}
        />

        
      </View>

      <View style={styles.tableContainer}>
        <Text style={styles.subHeader}>Game Prizes</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>Prize</Text>
            <Text style={styles.tableHeaderCell}>Amount</Text>
            <Text style={styles.tableHeaderCell}>Quantity</Text>
            <Text style={styles.tableHeaderCell}>Active</Text>
          </View>
          {gamePrizes?.map((gamePrize, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.tableCell}>{gamePrize.prize_name}</Text>
              <Text style={styles.tableCell}>{gamePrize.prize_amount}</Text>
              <Text style={styles.tableCell}>{gamePrize.quantity}</Text>
              <Text style={styles.tableCell}>{gamePrize.active ? 'Yes' : 'No'}</Text>
            </View>
          ))}
        </View>
      </View>

      <Button
          title={isSubmitting ? 'Submitting...' : 'Set Prize in Winners table'}
          disabled={isSubmitting}
          onPress={async () => {
            setIsSubmitting(true);
            try {
              const winners = await setPrizes({});
            //   if (winners) {
            //     toast({
            //       title: 'Prizes set successfully!',
            //       description: 'Prizes has been set successfully.',
            //       duration: 2000,
            //     });
            //   }
            } catch (error) {
            //   toast({
            //     variant: 'destructive',
            //     title: 'Error!',
            //     description: error instanceof Error ? error.message : String(error),
            //   });
            } finally {
              setIsSubmitting(false);
            }
          }}
        />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  form: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 3,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioLabel: {
    marginRight: 10,
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#000',
  },
  radioUnselected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#000',
  },
  textarea: {
    height: 100,
    textAlignVertical: 'top',
  },
  tableContainer: {
    marginTop: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  tableHeaderCell: {
    flex: 1,
    padding: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    padding: 10,
  },
});
