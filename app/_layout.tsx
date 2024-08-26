import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnboardingScreen from './OnboardingScreen';
import Login from './Login';

import { useColorScheme } from '@/hooks/useColorScheme';

import {ActivityIndicator, Button, StyleSheet, Text} from 'react-native';

import { Drawer } from 'expo-router/drawer';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import CustomDrawerContent from '@/components/CustomDrawerContent';

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { TamaguiProvider, createTamagui, View } from 'tamagui'
import defaultConfig from '@tamagui/config/v3'
// import "../global.css"
import { NumberProvider } from '@/providers/NumberProvider';
import { WinnerProvider } from '@/providers/WinnerProvider';
import { ClaimNotificationProvider } from '@/providers/ClaimNotificationContext';
import Toast from 'react-native-toast-message';

const config = createTamagui(defaultConfig)

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('../assets/fonts/Inter-Regular.ttf'),
    InterBold: require('../assets/fonts/InterBold.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  return (
    <ConvexAuthProvider client={convex} storage={secureStorage}>
      <NumberProvider>
        <ClaimNotificationProvider>
          <WinnerProvider>
            <TamaguiProvider config={config}>
              <Toast />
              <AuthLoading>
                <View style={{ flex:1, justifyContent: "center", alignItems: "center" }}>
                  <ActivityIndicator size="large" color="#00ff00" />
                  <Text>Loading..</Text>
                </View>
              </AuthLoading>

              <Authenticated>
                <Drawer
                  drawerContent={(props) => <CustomDrawerContent {...props} />} screenOptions={{headerShown: false}}>
                </Drawer>
              </Authenticated>
              
              <Unauthenticated>
                <Stack.Navigator screenOptions={{headerShown: false}}>
                  <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
                  <Stack.Screen name="Login" component={Login} />
                </Stack.Navigator>
            </Unauthenticated>
            
            </TamaguiProvider>
          </WinnerProvider>
        </ClaimNotificationProvider>
      </NumberProvider>
    </ConvexAuthProvider>
  );
}
