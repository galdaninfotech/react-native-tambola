import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Button } from 'tamagui';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export default function EditProfile() {
    const user = useQuery(api.users.get);
    const updateProfile = useMutation(api.users.updateProfile);
    const [name, setName] = React.useState('');
    const [image, setImage] = React.useState('');
    const [phone, setPhone] = React.useState('');

    useEffect(() => {
        if (user) {
            if (user.name) setName(user.name);
            if (user.image) setImage(user.image);
            if (user.phone) setPhone(user.phone);
        }
    }, [user]);

    const handleEditProfile = async () => {
        if (user?._id) {
            updateProfile({ userId: user._id, name, image, phone });
        } else {
            console.error('User ID is undefined');
        }
    };

    return (
        <ScrollView>
            <View style={{ padding: 10 }}>
                {user && (
                    <View>
                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={name}
                            onChangeText={setName}
                            placeholderTextColor="#666"
                            keyboardType="numbers-and-punctuation"
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={image}
                            onChangeText={setImage}
                            placeholderTextColor="#666"
                            keyboardType="numbers-and-punctuation"
                            autoCapitalize="none"
                        />

                        <TextInput
                            style={[styles.input, { flex: 1 }]}
                            value={phone}
                            onChangeText={setPhone}
                            placeholderTextColor="#666"
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>
                )}

                <View>
                    <Button size="$5" bg="teal" color="white" onPress={handleEditProfile} >
                        Save Profile
                    </Button>
                </View>
            </View>
        </ScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 12,
      // justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    button: {
      backgroundColor: '#1E90FF',
      paddingVertical: 12,
      paddingHorizontal: 18,
      borderRadius: 5,
    },
    disabledButton: {
      backgroundColor: '#ccc',
      // opacity: 0.3,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      textAlign: 'center',
    },
    input: {
      height: 50,
      backgroundColor: '#fff',
      borderRadius: 5,
      paddingHorizontal: 15,
      fontSize: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 5,
      elevation: 3,
    },
  });