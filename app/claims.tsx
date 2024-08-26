import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Button } from 'tamagui'; // Ensure the Tamagui Button is properly configured
import { Id } from '@/convex/_generated/dataModel';
import { useNotification } from '@/providers/WinnerProvider';

// Define a TypeScript interface for the Claim
interface Claim {
  _id: Id<'claims'>;
  ticket_id: Id<'tickets'>;
  prize_name?: string; // Allow this to be undefined
  status: string;
  user_name?: string; // Allow this to be undefined
  numbers?: Array<Array<number | { value: number; checked: number }>>; // Allow this to be undefined
  game_prize_id: Id<'game_prize'>;
  user_id: Id<'users'>;
}

function Claims() {
  const allActiveClaims = useQuery(api.tickets.getAllActiveClaims);
  const updateWinners = useMutation(api.winners.updateWinners);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const { showNotification } = useNotification();

  const handleViewDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setModalVisible(true);
  };

  const handleWinner = async (activeClaim: Claim) => {
    try {
      await updateWinners({
        game_prize_id: activeClaim.game_prize_id,
        user_id: activeClaim.user_id,
        ticket_id: activeClaim.ticket_id,
        claim_id: activeClaim._id,
      });

      console.log('Showing notification: A winner has been declared!');
      // showNotification('A winner has been declared! 🎉');
      showNotification(`${activeClaim?.user_name} has won the ${activeClaim?.prize_name}! 🎉`);


      // Alert.alert('Success', 'The winner has been updated successfully.');
    } catch (error) {
      console.error('Failed to update winners:', error);
      Alert.alert('Error', 'Failed to update the winner.');
    }
    setModalVisible(false);
  };

  const renderClaimItem = ({ item: activeClaim }: { item: Claim }) => (
    <View key={activeClaim._id} style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.fontMedium]}>{activeClaim._id.slice(-6).toUpperCase()}</Text>
      <Text style={styles.tableCell}>{activeClaim.ticket_id.slice(-6).toUpperCase()}</Text>
      <Text style={styles.tableCell}>{activeClaim.prize_name ?? 'N/A'}</Text>
      <Text style={[styles.tableCell, styles.textRight]}>{activeClaim.status}</Text>
      <View style={styles.tableCell}>
        <TouchableOpacity onPress={() => handleViewDetails(activeClaim)}>
          <Text style={styles.linkText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (!allActiveClaims) {
    // Show loading spinner or error message
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Claims</Text>
      <Text style={styles.tableCaption}>List of all active claims at this moment.</Text>
      <FlatList
        data={allActiveClaims as Claim[]}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={() => (
          <View style={styles.tableHeader}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableHead, styles.w100]}>Claim ID</Text>
              <Text style={[styles.tableHead, styles.textRight]}>Ticket ID</Text>
              <Text style={styles.tableHead}>Prize</Text>
              <Text style={styles.tableHead}>Status</Text>
              <Text style={styles.tableHead}>Actions</Text>
            </View>
          </View>
        )}
        renderItem={renderClaimItem}
        contentContainerStyle={styles.tableBody}
      />

      {/* Modal for viewing claim details */}
      {selectedClaim && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Claim Details</Text>
            <View style={styles.separator} />
            <View style={styles.numbers}>
              {selectedClaim.numbers ? (
                selectedClaim.numbers.map((numberArray, i) => (
                  <View style={styles.flexRow} key={i}>
                    {numberArray.map((number, j) => (
                      <View
                        style={[
                          styles.numberBox,
                          typeof number === 'object' && number.checked === 1
                            ? styles.numberBoxChecked
                            : styles.numberBoxUnchecked,
                        ]}
                        key={j}
                      >
                        <Text style={styles.numberText}>
                          {typeof number === 'object' && 'value' in number ? `${number.value}` : ``}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))
              ) : (
                <Text>N/A</Text>
              )}
            </View>
            <View style={styles.numberActionsWrapper}>
              <Button onPress={() => handleWinner(selectedClaim)}>Winner</Button>
              <Button size="sm">Boggy</Button>
            </View>
            <Button onPress={() => setModalVisible(false)}>Close</Button>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
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
  w100: {
    width: 100,
  },
  linkText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    margin: 10,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  numbers: {
    marginVertical: 10,
  },
  flexRow: {
    flexDirection: 'row',
  },
  numberBox: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  numberBoxChecked: {
    backgroundColor: '#F4D35E',
    color: '#000',
  },
  numberBoxUnchecked: {
    backgroundColor: 'gray',
  },
  numberText: {
    color: 'white',
  },
  numberActionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Claims;
