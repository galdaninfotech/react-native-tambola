import { Drawer } from 'expo-router/drawer';
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";
import Create from '../(prizes)/create';

import { TamaguiProvider, createTamagui, View } from 'tamagui'
import defaultConfig from '@tamagui/config/v3'
import { router, Stack } from 'expo-router';
import { Button, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const config = createTamagui(defaultConfig)

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

export default function RootLayout() {
  return (
    <ConvexAuthProvider client={convex} storage={secureStorage}>
      <TamaguiProvider config={config}>
        <Stack 
          screenOptions={{
            headerShown: true,
            headerStyle: {
              backgroundColor: 'teal',
            },
            headerTintColor: 'white',
          }}>
            
          <Stack.Screen
            name="create"
            options={{
              title: "Add Prizes",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.back()} style={{paddingLeft: 10, marginRight: 10}}>
                  <Icon name="arrow-back" size={24} color="pink" />
                </TouchableOpacity>
              ),
            }}
          />

          <Stack.Screen
            name="GetTickets"
            options={{
              title: "Get Tickets",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push("/home")} style={{paddingLeft: 10, marginRight: 10}}>
                  <Icon name="arrow-back" size={24} color="#007bff" />
                </TouchableOpacity>
              ),
            }}
          />

        <Stack.Screen
            name="EditProfile"
            options={{
              title: "Edit Profile",
              headerLeft: () => (
                <TouchableOpacity onPress={() => router.push("/profile")} style={{paddingLeft: 10, marginRight: 10}}>
                  <Icon name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ),
            }}
          />
        </Stack>
        
      </TamaguiProvider>
    </ConvexAuthProvider>
  );
}
