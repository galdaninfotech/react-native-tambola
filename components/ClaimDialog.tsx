import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { X } from '@tamagui/lucide-icons'
import { useMutation, useQuery } from 'convex/react';
import { useState } from 'react';
import { Adapt, Button, Dialog, Fieldset, SizableText, Input, Label, Paragraph, Sheet, TooltipSimple, Unspaced, XStack, YStack, RadioGroup, SizeTokens, View, } from 'tamagui'

export function ClaimDialog({ ticketId }: { ticketId: string }) {  
    return <DialogInstance ticketId={ticketId} />
}

function DialogInstance({ticketId}: {ticketId: string}) {
    const allGamePrizes = useQuery(api.tickets.getAllGamePrizes, {});
    const newClaim = useMutation(api.tickets.newClaim);
    const [selectedGamePrizeId, setSelectedGamePrizeId] = useState("");
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <Button size="$2" style={{backgroundColor: "transparent", borderColor: "#666", color: "#000", paddingHorizontal: 16}}>Claim</Button>
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
        <Dialog.Overlay key="overlay" animation="slow" opacity={0.5} enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        <Dialog.Content bordered elevate key="content"
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
          <Dialog.Title>Claim prize</Dialog.Title>
          <Dialog.Description>Select a prize to claim:</Dialog.Description>

          <Fieldset gap="$4" horizontal>
            <RadioGroup aria-labelledby="Select one item" name="form" onValueChange={(value) => setSelectedGamePrizeId(value)}>
              <YStack width={300} alignItems="center" gap="$2">
                {allGamePrizes?.map((prize, index) => (
                  <RadioGroupItemWithLabel
                    key={index}
                    size="$4"
                    value={prize._id.toString()}
                    label={prize.prize_name}
                  />
                ))}
              </YStack>
            </RadioGroup>
          </Fieldset>

          <XStack alignSelf="flex-end" gap="$4">
            <Dialog.Close displayWhenAdapted asChild>
              <Button theme="active" size="$4">Cancel</Button>
            </Dialog.Close>
            <Button theme="active" aria-label="Claim"
              onTouchEnd={async () => {
                if (selectedGamePrizeId === "") {
                  alert("Please select a prize to claim.");
                }
                try {
                  const success = await newClaim({
                    ticketId: ticketId as Id<"tickets">,
                    gamePrizeId: selectedGamePrizeId as Id<"game_prize">,
                  });

                  if (success) {
                    // alert("Claim submitted successfully!");
                    return;
                  } else {
                    alert("You have already Claimed.");
                  }
                } catch (e) {
                  // Narrow the unknown type to something more specific
                  if (e instanceof Error) {
                    if (e.message === "A claim with the same ticketId and gamePrizeId already exists.") {
                      alert("A claim with the same ticketId and gamePrizeId already exists.");
                      alert(e.message);
                    }
                  } else {
                    console.error("Non-error thrown:", e);
                    alert("An unexpected error occurred.");
                  }
                }
              }}
            >
              <SizableText>Claim Now!</SizableText>
            </Button>
          </XStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export function RadioGroupItemWithLabel(props: {
    size: SizeTokens
    value: string
    label: string
  }) {
    const id = `radiogroup-${props.value}`
    return (
      <XStack width="100%" alignItems="center" justifyContent='center' gap="$4" >
        <View>
            <RadioGroup.Item value={props.value} id={id} size={props.size}>
              <RadioGroup.Indicator />
            </RadioGroup.Item>
            <Label size={props.size} htmlFor={id}>
              {props.label}
            </Label>
        </View>
      </XStack>
    )
  }