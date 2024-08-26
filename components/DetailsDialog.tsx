import React from 'react';
import { View } from 'react-native';
import { Adapt, Button, Dialog, SizableText, Sheet, XStack, Paragraph, Text, Unspaced} from 'tamagui'
import { Bold, X } from '@tamagui/lucide-icons'

export function DetailsDialog({ ticket }: { ticket: any }) {  
    return <DialogInstance ticket={ticket} />
}

function DialogInstance({ticket}: {ticket: any}) {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button size="$2" style={{backgroundColor: "transparent", borderColor: "#666", color: "#000", paddingHorizontal: 16}}>Details</Button>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet animation="medium" zIndex={200000} modal dismissOnSnapToBottom>
          <Sheet.Frame padding="$4" gap="$4">
            <Adapt.Contents />
          </Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay key="overlay" animation="slow" opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Dialog.Content gap="$4" bordered elevate key="content" animateOnly={["transform", "opacity"]}
          animation={[ "quick", { opacity: { overshootClamping: true, }, }, ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
        >
          <Dialog.Title>Ticket Details</Dialog.Title>
          <Dialog.Description style={{overflow: "hidden"}}>
            <SizableText>All details about the selected ticket : {ticket._id.slice(-6).toUpperCase()}</SizableText>
          </Dialog.Description>

            <View style={{marginTop: 8, marginBottom: 8, overflow: "hidden"}}>           
                <Text fontSize={20} fontWeight={600}>Claims on ticket : {ticket._id.slice(-6).toUpperCase()}</Text>            
                {ticket.claims?.map((claim : any, index: number) => (
                <View key={index} style={{marginTop: 8, marginBottom: 8, overflow: "hidden"}}>
                  <View key={index} style={{marginTop: 8, marginBottom: 8}}>
                      <Text>Claim ID : {claim._id.slice(-6)}</Text>
                      <Text>Prize : {claim.prize_name}</Text>
                      <Text>Claim Status : {claim.status}</Text>
                  </View>
                </View>
                ))}
            </View>

          <XStack alignSelf="flex-end" gap="$4"><Dialog.Close displayWhenAdapted asChild><Button theme="active" aria-label="Close"><SizableText>Close</SizableText></Button></Dialog.Close></XStack>
          <Unspaced>
            <Dialog.Close asChild>
              <Button position="absolute" top="$3" right="$3" size="$2" circular icon={X} />
            </Dialog.Close>
          </Unspaced>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}