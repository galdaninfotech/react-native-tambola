import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Animated } from 'react-native';

const numberArray = [4, 26, 56, 2, 39, 26, 74, 12, 6, 46, 34, 51, 80, 38, 20, 45, 3, 67, 90, 7, 47, 71, 28, 40, 89];

const NumberList: React.FC = () => {
  const allNumbers = useQuery(api.tickets.getAllNumbers, {});
  const firstItemAnimation = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView | null>(null); // Explicitly type the ref

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(firstItemAnimation, {
          toValue: 1.2,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(firstItemAnimation, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [firstItemAnimation]);

  useEffect(() => {
    // Automatically scroll to the end when numbers are updated
    if (scrollViewRef.current && allNumbers && allNumbers.length > 0) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [allNumbers]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollView}
        ref={scrollViewRef} // Attach the ref to the ScrollView
      >
        {allNumbers?.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.item,
              index === allNumbers.length - 1 && { transform: [{ scale: firstItemAnimation }] },
            ]}
          >
            <Text style={styles.text}>{item.number}</Text>
          </Animated.View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40, // Fixed height for the entire component
  },
  scrollView: {
    alignItems: 'center', // Center the items vertically in the container
  },
  item: {
    width: 32,
    height: 32,
    backgroundColor: '#d3d3d3',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 1,
    borderRadius: 3,
  },
  text: {
    fontSize: 15,
    textAlign: 'center',
  },
});

export default NumberList;
