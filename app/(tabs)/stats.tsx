import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import React from 'react';
import { Text, YStack, XStack, Separator, Card } from 'tamagui';

const TambolaStatsScreen = () => {

  const numbersCount = useQuery(api.tickets.getAllNumbers, {});
  const allPrizesAndWinners = useQuery(api.prizes.getAllPrizesAndWinners, {});
  const noOfPlayers = useQuery(api.users.noOfPlayers, {});
  const noOfTickets = useQuery(api.tickets.noOfTickets, {});


  return (
    <YStack f={1} p="$4" bg="$background" space="$2">
      <Text fontSize="$6" fontWeight="bold" color="$teal10">Game Statistics</Text>

      <Card bg="$teal3" br="$4" p="$2">
        <Text fontSize="$5" color="$teal11" fontWeight="bold"> Numbers Called : </Text>
        <Text fontSize="$4" color="$teal12"> {numbersCount?.length} out of 90 </Text>
      </Card>
      <Separator />

      <XStack jc="space-between" ai="center" p="$2" bg="$accent2" br="$4">
        <Text fontSize="$5" color="$accent12" fontWeight="bold"> No. Of Prizes: </Text>
        <Text fontSize="$5" color="$accent12"> {allPrizesAndWinners?.length} </Text>
      </XStack>
      <Separator />

      <XStack jc="space-between" ai="center" p="$2" bg="$accent2" br="$4">
        <Text fontSize="$5" color="$accent12" fontWeight="bold"> No. Of Players: </Text>
        <Text fontSize="$5" color="$accent12"> {noOfPlayers} </Text>
      </XStack>
      <Separator />


      <XStack jc="space-between" ai="center" p="$2" bg="$accent2" br="$4">
        <Text fontSize="$5" color="$accent12" fontWeight="bold"> Tickets Sold: </Text>
        <Text fontSize="$5" color="$accent12"> {noOfTickets} </Text>
      </XStack>
      <Separator />

      <XStack jc="space-between" ai="center" p="$2" bg="$accent2" br="$4">
        <Text fontSize="$5" color="$accent12" fontWeight="bold"> Total Prize Amount: </Text>
        <Text fontSize="$5" color="$accent12"> ₹ {allPrizesAndWinners?.reduce((sum, prize) => sum + (prize.prize_amount ?? 0), 0).toLocaleString('en-IN')} </Text>
      </XStack>
      <Separator />


      {/* Summary */}
      <YStack space="$3" p="$4" br="$4" bg="$backgroundStrong">
        <Text fontSize="$5" fontWeight="bold" color="$color">
          Game Summary
        </Text>
        <Text fontSize="$4" color="$color">
          The game is progressing smoothly with {numbersCount?.length} numbers called so far. A total of {noOfTickets} tickets have been sold to {noOfPlayers} players.
        </Text>
      </YStack>
    </YStack>
  );
};

export default TambolaStatsScreen;


{/* 

<h5 id="count"> Numbers Count: {{ $count }}</h5>
<h5 id="count"> No. Of Prizes: {{ $noOfPrizes }}</h5>
<h5 id="count"> No. Of Players: {{ $noOfPlayers }}</h5>
<h5 id="count"> Tickets Sold: {{ $noOfTicketsSold }}</h5>


<h5 id="count"> Prize Types: {{ $noOfPrizeTypes }}</h5>
<h5 id="count"> No. Of Online Users: {{ $noOfLoggedInUsers }}</h5>
<h5 id="count"> Total Ticket Amount: {{ $noOfTicketsSold * $activeGame->ticket_price }}</h5>
<h5 id="count"> Total Prize Amount: {{ $totalPrizeAmount }}</h5> 

*/}