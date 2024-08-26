import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrizesAndWinners = () => {
    const allPrizesAndWinners = useQuery(api.prizes.getAllPrizesAndWinners, {});
  return (
    <ScrollView>
      <View style={styles.table}>
        <Text style={styles.tableCaption}>List of all prizes and winners.</Text>
        <View style={styles.tableHeader}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHead}>Prize</Text>
            <Text style={styles.tableHead}>Amount</Text>
            <Text style={styles.tableHead}>Winner</Text>
          </View>
        </View>
        <View style={styles.tableBody}>
          {allPrizesAndWinners?.map((prizesAndWinner) => (
            <View key={prizesAndWinner._id} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.fontMedium]}>{prizesAndWinner.prize_name}</Text>
              <Text style={styles.tableCell}>{prizesAndWinner.prize_amount}</Text>
              <Text style={[styles.tableCell, styles.textRight]}>{prizesAndWinner.user_name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    flex: 1,
    padding: 10,
  },
  tableCaption: {
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableHead: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'left',
  },
  tableBody: {
    backgroundColor: '#fff',
  },
  tableCell: {
    flex: 1,
    textAlign: 'left',
  },
  fontMedium: {
    fontWeight: '500',
  },
  textRight: {
    textAlign: 'right',
  },
});

export default PrizesAndWinners;
