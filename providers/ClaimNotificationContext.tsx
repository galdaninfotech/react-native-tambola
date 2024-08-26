import React, { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as SecureStore from "expo-secure-store";

interface ClaimNotificationContextType {
    latestClaim: any | null;
    notifyNewClaim: (claim: any) => void;
}

const ClaimNotificationContext = createContext<ClaimNotificationContextType | null>(null);

export const ClaimNotificationProvider = ({ children }: { children: ReactNode }) => {
    const allClaims = useQuery(api.tickets.getAllActiveClaims, {});
    const [latestClaim, setLatestClaim] = useState<any | null>(null);
    const [lastNotifiedClaimId, setLastNotifiedClaimId] = useState<string | null>(null);

    useEffect(() => {
        const loadLastNotifiedClaimId = async () => {
            const storedId = await SecureStore.getItemAsync('lastNotifiedClaimId');
            setLastNotifiedClaimId(storedId);
        };
        loadLastNotifiedClaimId();
    }, []);

    useEffect(() => {
        if (allClaims && allClaims.length > 0) {
            const newLatestClaim = allClaims[allClaims.length - 1];

            if (newLatestClaim && newLatestClaim._id !== lastNotifiedClaimId) {
                setLatestClaim(newLatestClaim);
                notifyNewClaim(newLatestClaim);
                setLastNotifiedClaimId(newLatestClaim._id);
                SecureStore.setItemAsync('lastNotifiedClaimId', newLatestClaim._id);
            }
        }
    }, [allClaims, lastNotifiedClaimId]);

    const notifyNewClaim = (claim: any) => {
        Toast.show({
            type: 'info',
            text1: 'New Claim Received',
            text2: `Claim by ${claim.user_name} for ${claim.prize_name}`,
            visibilityTime: 10000,
        });
    };

    return (
        <ClaimNotificationContext.Provider value={{ latestClaim, notifyNewClaim }}>
            {children}
        </ClaimNotificationContext.Provider>
    );
};

export const useClaimNotification = () => {
    const context = useContext(ClaimNotificationContext);
    if (!context) {
        throw new Error('useClaimNotification must be used within a ClaimNotificationProvider');
    }
    return context;
};
