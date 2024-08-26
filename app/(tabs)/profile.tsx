import React from 'react';
import { Avatar, Button, Text, YStack, XStack, Separator, Card } from 'tamagui';
import { View, ScrollView } from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { router } from 'expo-router';

const UserProfileScreen = () => {
  const user = useQuery(api.users.get);

  return (
    <ScrollView>
      <YStack f={1} jc="center" ai="center" p="$4" bg="$background" space>
        {/* Profile Picture and Name */}
        <Avatar circular size="$8">
          <Avatar.Image src={user?.image} />
        </Avatar>
        <XStack mt="$4" alignItems="center" space="$2">
          <Text fontSize="$6" fontWeight="bold" color="$color">
            {user?.name}
          </Text>
          <Button size="$2" circular onPress={() => {/* Add edit name logic here */}}>
            ✏️
          </Button>
        </XStack>        
        
        <Text fontSize="$4" color="$colorMuted">
          {user?.email}
        </Text>
        <Separator />

        {/* Action Buttons */}
        <XStack space="$3" mt="$6">
          <Button size="$5" bg="teal" color="white">
            Follow
          </Button>
          <Button size="$5" bg="$green10" color="white">
            Message
          </Button>
        </XStack>

        <XStack space="$3" mt="$6">
          <Button size="$5" bg="teal" color="white" paddingHorizontal="$11"
            onPress={() => { router.push("/(prizes)/EditProfile" as never) }}
          >
            Edit Profile
          </Button>
        </XStack>

        <Separator />

        {/* Additional Info */}
        <YStack mt="$6" w="100%" px="$6">
          <Card bg="$backgroundStrong" p="$4" br="$4">
            <Text fontSize="$4" color="$color" fontWeight="bold">
              Recent Activity
            </Text>
            <Text mt="$2" color="$colorMuted">
              - Commented on a post: "Great article on React Native!"
            </Text>
            <Text mt="$2" color="$colorMuted">
              - Liked a photo: "Beautiful sunset view."
            </Text>
          </Card>
        </YStack>
      </YStack>
    </ScrollView>
  );
};

export default UserProfileScreen;
