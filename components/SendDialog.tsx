import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { Adapt, Button, Dialog, SizableText, Sheet, XStack,} from 'tamagui'

export function SendDialog({ ticketId }: { ticketId: string }) {  
    return <DialogInstance ticketId={ticketId} />
}

function DialogInstance({ticketId}: {ticketId: string}) {
  const sendTicket = useMutation(api.tickets.sendTicket);
  const [friendsEmailID, setFriendsEmailID] = useState("");

  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button size="$2" style={{backgroundColor: "transparent", borderColor: "#666", color: "#000", paddingHorizontal: 16}}>Send</Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay
          key="overlay"
          animation="slow"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />
        <Dialog.Content
          bordered
          elevate
          key="content"
          animateOnly={["transform", "opacity"]}
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          gap="$4"
        >
          <Dialog.Title>Send To Friend</Dialog.Title>
          <Dialog.Description>
            <SizableText>Send the selected ticket : {ticketId.slice(-8).toUpperCase()}</SizableText>
          </Dialog.Description>        
            <View className="flex flex-row justify-between gap-4 mb-4">
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Type Your Friend's Email ID"
                placeholderTextColor="#666"
                keyboardType="email-address"
                autoCapitalize="none"
                value={friendsEmailID}
                onChangeText={setFriendsEmailID}
              />
            </View>

          {/* send & close button */}
          <XStack alignSelf="flex-end" gap="$4">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="active" aria-label="Close"
                onTouchEnd={() => {
                  if (!friendsEmailID) { 
                    alert("Please Enter Your Friend's Email ID!");
                  }
                  try {
                    const success = void sendTicket({
                      ticketId: ticketId as Id<"tickets">,
                      friendsEmailID
                    });
                    if (success) {
                      alert("Ticket Sent Successfully!");
                    }
                  } catch (error) {
                    console.error(error);
                  }
                  
                }}
              >
                <SizableText>Send Ticket</SizableText>
              </Button>
            </Dialog.Close>
          </XStack>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
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
    // width: '50%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 15,
    // marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});
