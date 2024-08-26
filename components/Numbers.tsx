import { Text, View } from "react-native";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { useNumber } from "@/providers/NumberProvider"; // Import the useNumber hook

export default function Numbers() {
  const allNumbers = useQuery(api.tickets.getAllNumbers, {});
  const { latestNumber } = useNumber(); // Use the hook to get the latest number

  return (
    <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
      {allNumbers && allNumbers.length > 0 ? (
        Array.from({ length: 90 }, (_, i) => (
          <View
            key={i}
            style={{
              width: 37,
              height: 37,
              marginLeft: 4,
              marginBottom: 4,
              backgroundColor: allNumbers.findIndex(number => number.number === i + 1) !== -1 ? '#F4D35E' : '#d3d3d3',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text style={{ 
              color: allNumbers.findIndex(number => number.number === i + 1) !== -1 ? 'white' : 'black',
              fontWeight: latestNumber === i + 1 ? 'bold' : 'normal' // Highlight the latest number
            }}>
              {i + 1}
            </Text>
          </View>
        ))
      ) : (
        <Text>Loading numbers!</Text>
      )}
    </View>
  );
}
