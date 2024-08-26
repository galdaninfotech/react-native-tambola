import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React, { Component } from "react";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Button } from 'tamagui';


export default function Board() {
  const allNumbers = useQuery(api.tickets.getAllNumbers, {});
  const drawRandomNumber = useMutation(api.board.drawRandomNumber);
  const pauseGame = useMutation(api.board.pauseGame);
  return (
    <ScrollView style={{flex:1, marginTop: 40, paddingHorizontal: 1}}>
      <Text style={styles.header}>Board</Text>

      <View style={{flex: 1, flexDirection: "row", justifyContent: "space-around", marginBottom: 10}}>
        <Button theme="active" size="$3" onPress={async () => { void pauseGame({}); }} >Pause Game</Button> 
        <Button theme="active" size="$3" onPress={async () => { void drawRandomNumber({}); }} >Draw Number</Button>
      </View>

      <View style={{flex:1, flexDirection:"row", justifyContent: "center", flexWrap: "wrap"}}>
        {allNumbers && allNumbers.length > 0 ? (
          <>
            {Array.from({ length: 90 }, (_, i) => (
              <View
                key={i}
                style={{
                  width: 36,
                  height: 36,
                  marginLeft: 4,
                  marginBottom: 4,
                  backgroundColor: allNumbers && allNumbers.findIndex(number => number.number === i + 1) !== -1 ? '#5bdd5b' : '#d3d3d3',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: allNumbers && allNumbers.findIndex(number => number.number === i + 1) !== -1 ? 'white' : 'black' }}>
                  {i + 1}
                </Text>
              </View>
            ))}

          </>
        ) : (
          <Text>Loading numbers!</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    marginLeft:20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});