import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import bingoModule from '../../lib/bingoModule';
import { router } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function GetTickets() {
  const [noOfTickets, setNoOfTickets] = React.useState('');  
  const [newTickets, setNewTickets] = React.useState([]);
  const saveTicket = useMutation(api.tickets.saveTicket);
  const [ticketColor, setTicketColor] = React.useState('');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleGenerateTickets = async () => {
    const tickets = bingoModule.generateTicketSets(Number(noOfTickets));
    setNewTickets(tickets as any);
    const color = getRandomColor();
    if (color !== undefined) {
      setTicketColor(color.toString());
    }
  };

  const handleSaveTickets = async () => {
    if(newTickets.length === 0) {
      Alert.alert("No Tickets Generated!", "You have not generated any tickets yet! Generate at least one ticket first.");
    } else {
      for (const rawTicket of newTickets) {
        const formattedTicket = (rawTicket as any[][]).map((row : any, rowIndex: number) =>
          (row as any[]).map((cell : number, cellIndex : number) => {
            if (cell === 0) return 0;
            return {
              checked: 0,
              id: `${rowIndex}${cellIndex}`,
              value: cell
            };
          })
        );

        setIsSaving(true);
        console.log(formattedTicket);
  
        await saveTicket({ 
          numbers: formattedTicket,
          status: "Active",
          comment: "Ticket from set",
          color: ticketColor,
          on_color: "white"
        });
      }
      
      Alert.alert("Success", `${noOfTickets} ${Number(noOfTickets) === 1 ? 'ticket' : 'tickets'} saved successfully`);
      setNewTickets([]);
      setTicketColor('');
      router.push("/home");
      setIsSaving(false);
    }
  };

  function getRandomColor(): import("react-native").ColorValue | undefined {
    const colors = ["#5ABBB4", "#74BB52", "#A687BB", "#BBB769", "#9ABB96", "#F28C31", "#6291BB", "#1D5A68", "#A43A89", "#1E90FF", "#228B22", "#FFD700", "#00CED1", "#FF69B4", "#8A2BE2", "#FFA500", "#00FF7F"];
    return colors[Math.floor(Math.random() * colors.length)]
  }


return (
    <ScrollView>
      <View style={styles.container} className=''>
        <View className="flex flex-row justify-between gap-4 mb-4">
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="No. of Tickets"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            onChangeText={(text) => setNoOfTickets(text)}
            value={noOfTickets}
          />
          <TouchableOpacity style={{ ...styles.button, backgroundColor: 'teal', flex: 1 }} onPress={handleGenerateTickets}>
            <Text style={styles.buttonText}>Generate</Text>
          </TouchableOpacity>
        </View>

        <View className="flex flex-row justify-between gap-x-10">
          <TouchableOpacity 
            disabled={newTickets?.length === 0 || isSaving}
            style={[
                styles.button,
                { backgroundColor: 'teal', width: "100%" },
                (newTickets?.length === 0 || isSaving) && styles.disabledButton
            ]}
            onPress={handleSaveTickets}
          >
            <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Get Ticket'}</Text>
          </TouchableOpacity>
        </View>

        <View className="mt-2" style={{ backgroundColor: ticketColor}}>
          {newTickets.map((ticket, index) => (
            <View key={index} style={{ paddingTop: 10, width: '100%' }}>
              <Text>Ticket {index + 1}:</Text>
              {(ticket as any[][]).map((row: any, rowIndex: number) => (
                <View key={rowIndex} style={{ flexDirection: 'row' }}>
                  {row.map((cell : number, cellIndex : number) => (
                    <View key={cellIndex} style={{ borderWidth: 0.5, borderColor: '#222', marginRight: 2, marginBottom: 2, width: 35.5, height: 35.5, justifyContent: 'center', alignItems: 'center' }}>
                      <Text>{cell === 0 ? ' ' : cell}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    // justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'teal',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    // opacity: 0.3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    // width: '50%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    // marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});

