import * as React from "react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

import { Button, H5, XStack, YStack } from "tamagui";
import { SizableText, Tabs } from "tamagui";
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import Tickets from "@/components/Tickets";
import Numbers from "@/components/Numbers";
import Claims from "@/components/Claims";
// import Video from "@/components/Video";
import PrizesAndWinners from "@/components/PrizesAndWinners";
import { router } from "expo-router";
import RecentNumbers from "@/components/RecentNumbers";
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { Suspense, useState } from "react";

const LazyTickets = React.lazy(() => import('@/components/Tickets'));

import { useNotification } from '@/providers/WinnerProvider';

export default function Index() {
    const user = useQuery(api.users.get);
    const tickets = useQuery(api.tickets.getTicketsByIdWithClaims);

    const [activeTab, setActiveTab] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const handleTabChange = (newTab: number) => {
        setIsLoading(true);
        setActiveTab(newTab);
        // Simulate async loading
        setTimeout(() => setIsLoading(false), 100);
    };

    const [value, setValue] = React.useState("account");

    const { showNotification } = useNotification();

    return (
        <View style={{ alignItems: "center", padding: 10, }} >
            <Authenticated>
                <View style={{ flexDirection: "row", gap: 4, marginTop: 8 }}>
                    <Button
                        theme="active"
                        size="$3"
                        disabled={tickets?.length !== 0}
                        style={[ tickets?.length !== 0 && styles.disabledButton ]}
                        onPress={() => {
                            router.push("/(prizes)/GetTickets" as never);
                        }}
                    >
                        {" "}
                        Get Tickets
                    </Button>
                </View>

                <RecentNumbers />

                <Tabs
                    defaultValue="tab1"
                    orientation="horizontal"
                    size="$4"
                    // padding="$2"
                    flexDirection="column"
                    activationMode="manual"
                    backgroundColor="$background"
                    borderRadius="$4"
                    position="relative"
                    style={{ width: "100%" }}
                    value={`tab${activeTab + 1}`}
                    onValueChange={(value) => handleTabChange(parseInt(value.slice(3)) - 1)}
                >
                    <Tabs.List style={{marginTop: 2, marginLeft: 2}}>
                        <Tabs.Tab 
                            value="tab1" padding="$2"
                            backgroundColor={activeTab === 0 ? 'teal' : '$background'}
                            borderRadius="$2"
                            pressStyle={{ backgroundColor: 'teal'}}
                            onPress={() => setActiveTab(0)}
                        >
                            <IoniconsIcon name="ticket" size={18} 
                                style={{ transform: [{ rotate: '135deg' }] }} 
                                color={activeTab === 0 ? '#F4D35E' : 'teal'}
                            />
                            <SizableText 
                                style={{ marginLeft: -4 }}
                                color={activeTab === 0 ? '#F4D35E' : '#000'}
                            > Tickets </SizableText>
                        </Tabs.Tab>

                        <Tabs.Tab 
                            value="tab2" padding="$2"
                            backgroundColor={activeTab === 1 ? 'teal' : '$background'}
                            borderRadius="$2"
                            pressStyle={{ backgroundColor: 'teal' }}
                            onPress={() => setActiveTab(1)}
                        >
                            <FontAwesome5Icon 
                                name="th" size={18} 
                                style={{ transform: [{ rotate: '90deg' }] }} 
                                color={activeTab === 1 ? '#F4D35E' : 'teal'} 
                            />
                            <SizableText 
                                style={{ marginLeft: 5 }} 
                                color={activeTab === 1 ? '#F4D35E' : '#000'}
                            >Numbers</SizableText>
                        </Tabs.Tab>

                        <Tabs.Tab 
                            value="tab3" padding="$2"
                            backgroundColor={activeTab === 2 ? 'teal' : '$background'}
                            borderRadius="$2"
                            pressStyle={{ backgroundColor: 'teal' }}
                            onPress={() => setActiveTab(2)}
                        >
                            <IoniconsIcon 
                                name="trophy" size={18}
                                color={activeTab === 2 ? '#F4D35E' : 'teal'}
                            />
                            <SizableText 
                                style={{ marginLeft: 5 }} 
                                color={activeTab === 2 ? '#F4D35E' : '#000'}
                            >Prizes</SizableText>
                        </Tabs.Tab>

                        <Tabs.Tab 
                            value="tab4" padding="$2"
                            backgroundColor={activeTab === 3 ? 'teal' : '$background'}
                            borderRadius="$2"
                            pressStyle={{ backgroundColor: 'teal' }}
                            onPress={() => setActiveTab(3)}
                        >
                            <FontAwesome5Icon 
                                name="tasks" size={18} 
                                style={{marginRight: 4}} 
                                color={activeTab === 3 ? '#F4D35E' : 'teal'}
                            />
                            <SizableText 
                                style={{ marginLeft: 5 }} 
                                color={activeTab === 3 ? '#F4D35E' : '#000'}
                            >Claims</SizableText>
                        </Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Content value="tab1">
                        {isLoading && activeTab === 0 ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                            <LazyTickets />
                            </Suspense>
                        )}
                    </Tabs.Content>

                    <Tabs.Content value="tab2">
                        <Numbers />
                    </Tabs.Content>

                    <Tabs.Content value="tab3">
                        <PrizesAndWinners />
                    </Tabs.Content>

                    <Tabs.Content value="tab4">
                        <Claims />
                        {/* <Video /> */}
                    </Tabs.Content>
                </Tabs>
            </Authenticated>
        </View>
    );
}

const styles = StyleSheet.create({
    welcomeUser: {
        marginBottom: 10,
        marginTop: 10,
    },
    navItemLabel: {
        marginLeft: -20,
        fontSize: 18,
    },
    userInfoWrapper: {
        // flexDirection: "row",
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        // borderBottomColor: "#ccc",
        // borderBottomWidth: 1,
        // marginBottom: 10,
    },
    userImg: {
        borderRadius: 40,
    },
    userDetailsWrapper: {
        marginTop: 25,
        marginLeft: 10,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    userEmail: {
        fontSize: 12,
        fontStyle: "italic",
        textDecorationLine: "underline",
    },

    disabledButton: {
        display: 'none',
        backgroundColor: '#ccc',
        opacity: 0.3,
      },
      buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
      },
});
