import React, { useEffect } from 'react';
import { SafeAreaView, View, Text, Animated } from 'react-native';


const OnboardingScreen = ({navigation}) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();


    const timeoutId = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
    
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <SafeAreaView style={{ flex: 1}}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.Text
          style={[
            {
              fontFamily: 'Inter-Bold',
              fontWeight: 'bold',
              fontSize: 30,
              color: '#000',
            },
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          TAMBOLA
        </Animated.Text>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
