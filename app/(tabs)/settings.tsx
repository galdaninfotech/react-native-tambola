import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, YStack, XStack, Switch, Separator, Button, ScrollView } from 'tamagui';

const SettingsScreen = () => {
  const [isAutoTickEnabled, setIsAutoTickEnabled] = useState(false);
  const toggleAutoTick = useMutation(api.users.toggleAutoTick);
  const handleAutoTickToggle = (checked: boolean) => {
    setIsAutoTickEnabled(checked);
    toggleAutoTick({});
  };
  
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const toggleNotifications = () => setIsNotificationsEnabled(!isNotificationsEnabled);
  
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);
  const toggleDarkMode = () => setIsDarkModeEnabled(!isDarkModeEnabled);


  return (
    <ScrollView>
      <YStack f={1} p="$4" bg="$background" space="$4">

        {/* Automatic Section */}
        <Text fontSize="$5" fontWeight="bold" color="$color">Auto</Text>
        <YStack gap="$3" px="$3" pb="$4">
          <XStack jc="space-between" ai="center">
            <Text fontSize="$4" color="$color">Auto Tick</Text>
            <Switch size="$3" 
              checked={isAutoTickEnabled}
              onCheckedChange={handleAutoTickToggle}
            >
              <Switch.Thumb animation="bouncy" />
            </Switch>
          </XStack>
        </YStack>

        <YStack gap="$3" px="$3" pb="$4">
          <XStack jc="space-between" ai="center">
            <Text fontSize="$4" color="$color">Auto Claim</Text>
            <Switch size="$3" 
              checked={isNotificationsEnabled}
              onCheckedChange={toggleNotifications}>
              <Switch.Thumb animation="bouncy" />
            </Switch>
          </XStack>
        </YStack>

        <Separator />

        {/* Account Section */}
        <Text fontSize="$5" fontWeight="bold" color="$color">Account</Text>
        <YStack space="$3" px="$3" pb="$4">
          <XStack jc="space-between" ai="center">
            <Text fontSize="$4" color="$color">Update Profile</Text>
            <Button size="$4" bg="teal" color="white">
              Edit
            </Button>
          </XStack>
          <Separator />
          <XStack jc="space-between" ai="center">
            <Text fontSize="$4" color="$color">Change Password</Text>
            <Button size="$4" bg="teal" color="white">
              Change
            </Button>
          </XStack>
        </YStack>

        <Separator />

        {/* Notifications Section */}
        <Text fontSize="$5" fontWeight="bold" color="$color">Notifications</Text>
        <YStack space="$3" px="$3" pb="$4">
          <XStack jc="space-between" ai="center">
            <Text fontSize="$4" color="$color">Enable Notifications</Text>
            <Switch
              size="$3"
              checked={isNotificationsEnabled}
              onCheckedChange={toggleNotifications}
            />
          </XStack>
        </YStack>

        <Separator />

        {/* Preferences Section */}
        <Text fontSize="$5" fontWeight="bold" color="$color">Preferences</Text>
        <YStack space="$3" px="$3" pb="$4">
          <XStack jc="space-between" ai="center">
            <Text fontSize="$3" color="$color">Dark Mode</Text>
            <Switch
              size="$4"
              checked={isDarkModeEnabled}
              onCheckedChange={toggleDarkMode}
            />
          </XStack>
        </YStack>

        <Separator />

        {/* Sign Out Section */}
        <YStack px="$3" pt="$4">
          <Button size="$5" bg="teal" color="white">
            Sign Out
          </Button>
        </YStack>

      </YStack>
    </ScrollView>
  );
};

export default SettingsScreen;
