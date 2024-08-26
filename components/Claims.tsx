import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useClaimNotification } from '@/providers/ClaimNotificationContext'; // Import the hook

const Claims = () => {
    const user = useQuery(api.users.get);
    const allActiveClaims = useQuery(api.tickets.getAllActiveClaims, {});

    // Optional: Use the context if needed
    const { latestClaim } = useClaimNotification();

    return (
        <ScrollView>
            <View style={styles.table}>
                <Text style={styles.tableCaption}>List of all prizes and winners.</Text>
                <View style={styles.tableHeader}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableHead}>Claim Id</Text>
                        <Text style={styles.tableHead}>Prize</Text>
                        <Text style={styles.tableHead}>Status</Text>
                        <Text style={styles.tableHead}>Player</Text>
                    </View>
                </View>
                <View style={styles.tableBody}>
                    {allActiveClaims?.map((activeClaim) => (
                        <View key={activeClaim._id} style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.fontMedium]}>{activeClaim._id.slice(-6).toUpperCase()}</Text>
                            <Text style={styles.tableCell}>{activeClaim.prize_name}</Text>
                            <Text style={styles.tableCell}>{activeClaim.status}</Text>
                            <Text>{activeClaim.user_name}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    table: {
        flex: 1,
        padding: 10,
    },
    tableCaption: {
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
        fontSize: 16,
    },
    tableHeader: {
        backgroundColor: '#f0f0f0',
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    tableHead: {
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'left',
    },
    tableBody: {
        backgroundColor: '#fff',
    },
    tableCell: {
        flex: 1,
        textAlign: 'left',
    },
    fontMedium: {
        fontWeight: '500',
    },
    textRight: {
        textAlign: 'right',
    },
});

export default Claims;
