import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from 'react'
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { router, useNavigation, usePathname } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Feather, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';

import { Authenticated } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { SignOut } from "@/app/SignOut";

// import "../global.css"

const CustomDrawerContent = (props: any) => {
  const user = useQuery(api.users.get);
  
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView style={{ backgroundColor: "teal" }} {...props}>
      <View style={styles.userInfoWrapper}>
        <Authenticated>
          <Image
            source={{ uri: user?.image }}
            width={80}
            height={80}
            style={styles.userImg}
          />
          <View style={styles.userDetailsWrapper}>
            <Text style={styles.userName}>{user && user?.name}</Text>
            <Text style={styles.userEmail}>{user && user?.email}</Text>
            <SignOut />
          </View>
        </Authenticated>
      </View>
      <View style={{backgroundColor: "white", flex: 1, height: 610}}>
        <DrawerItem
          icon={({ color, size }) => (
            <Feather
              name="list"
              size={size}
              color={pathname == "/feed" ? "#fff" : "#000"}
            />
          )}
          label={"Feeds"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/feed" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/feed" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/about");
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <AntDesign
              name="user"
              size={size}
              color={pathname == "/profile" ? "#fff" : "#000"}
            />
          )}
          label={"Profile"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/profile" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/profile" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/profile");
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialIcons
              name="favorite-outline"
              size={size}
              color={pathname == "/(prizes)/create" ? "#fff" : "#000"}
            />
          )}
          label={"Add Prizes"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/prizes/create" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/prizes/create" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/(prizes)/create" as never);
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialIcons
              name="favorite-outline"
              size={size}
              color={pathname == "/claims" ? "#fff" : "#000"}
            />
          )}
          label={"Claims"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/claims" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/claims" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/claims" as never);
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <MaterialIcons
              name="favorite-outline"
              size={size}
              color={pathname == "/board" ? "#fff" : "#000"}
            />
          )}
          label={"Board"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/board" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/board" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/board" as never);
          }}
        />
        <DrawerItem
          icon={({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={pathname == "/settings" ? "#fff" : "#000"}
            />
          )}
          label={"Settings"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/settings" ? "#fff" : "#000" },
          ]}
          style={{ backgroundColor: pathname == "/settings" ? "#333" : "#fff" }}
          onPress={() => {
            router.push("/settings");
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    backgroundColor: "teal",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: 'bold',
  },
  userEmail: {
    color: "white",
    fontSize: 12,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    marginBottom: 10,
  }
});