import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'teal',
        },
        tabBarInactiveTintColor: "#fff",
        tabBarActiveTintColor: "#F4D35E",
        headerShown: true,
        headerLeft: () => <DrawerToggleButton tintColor="#F4D35E" />,
        headerRight: () => 
          <View style={{ flexDirection: 'row', gap: 18 }}>
            <Ionicons name="settings" color="white" size={18} />
            <EntypoIcon name="video" color="white" size={18} style={{ marginRight: 10 }} />
          </View>
        ,
        headerStyle: {
          backgroundColor: 'teal', // Set the AppBar background color here
        },
        headerTintColor: '#fff', // Set the text and icon color
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      
    > 
      <Tabs.Screen
        name="home"
        options={{
          title: "Tambola",
          tabBarLabel: 'Home',
          tabBarShowLabel: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size * 0.6} />
          ),
          tabBarItemStyle: {
            paddingVertical: 8,
          },
        }}
      />

      <Tabs.Screen
        name="stats"
        options={{
          title: "Stats",
          tabBarLabel: 'Stats',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stats-chart-sharp" color={color} size={size * 0.6} />
          ),
          tabBarItemStyle: {
            paddingVertical: 8,
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size * 0.6} />
          ),
          tabBarItemStyle: {
            paddingVertical: 8,
          },
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size * 0.6} />
          ),
          tabBarItemStyle: {
            paddingVertical: 8,
          },
        }}
      />
      
    </Tabs>
  );
}
