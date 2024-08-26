import React, { useMemo, useCallback } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { ClaimDialog } from "@/components/ClaimDialog";
import { DetailsDialog } from "./DetailsDialog";
import { SendDialog } from "./SendDialog";
import { Id } from "@/convex/_generated/dataModel";

interface Ticket {
  _id: Id<"tickets">;
  color: string;
  numbers: Array<Array<number | { checked: number; value: number }>>;
}

const TicketItem: React.FC<{ ticket: Ticket; onToggleChecked: (ticketId: Id<"tickets">, row: number, column: number) => void }> = React.memo(({ ticket, onToggleChecked }) => (
  <View key={ticket._id} style={{backgroundColor: ticket.color, padding: 6}}>
    <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 15, marginBottom: 4}}>
      <Text>No: {ticket._id.slice(-6).toUpperCase()}</Text>
      <DetailsDialog ticket={ticket} />
      <ClaimDialog ticketId={ticket._id} />
      <SendDialog ticketId={ticket._id}/>
    </View>
    <View>
      {ticket.numbers && ticket.numbers.length > 0 ? (
        <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
          {ticket.numbers.map((numberArray, i) => (
            <View key={i} style={{ flexDirection: 'row' }}>
              {numberArray.map((number, j) => (
                <TouchableOpacity
                  key={j}
                  onPress={() => onToggleChecked(ticket._id, i, j)}
                  style={{
                    width: 36.4,
                    height: 36.4,
                    borderColor: '#222',
                    borderWidth: 0.4,                                
                    backgroundColor: typeof number === 'object' && number.checked === 1 ? '#F4D35E' : 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {typeof number === 'object' && 'value' in number && (
                    <Text style={{
                      color: typeof number === 'object' && number.checked === 1 ? '#000' : '#222'
                    }}>
                      {number.value}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      ) : (
        <Text>No numbers found</Text>
      )}
    </View>
  </View>
));

export default function Tickets() {
  const tickets = useQuery(api.tickets.getTicketsByIdWithClaims);
  const toggleChecked = useMutation(api.tickets.toggleChecked);

  const handleToggleChecked = useCallback((ticketId: Id<"tickets">, row: number, column: number) => {
    toggleChecked({ ticketId, row, column });
  }, [toggleChecked]);

  const processedTickets = useMemo(() => {
    return tickets || [];
  }, [tickets]);

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false} 
      contentContainerStyle={{ paddingBottom: 260 }} 
      style={{ backgroundColor: 'transparent' }}
    >
      <View style={{marginTop: 2}}>
        {processedTickets.length > 0 ? (
          processedTickets.map((ticket) => (
            <TicketItem key={ticket._id} ticket={ticket as Ticket} onToggleChecked={handleToggleChecked} />
          ))
        ) : (
          <Text>No tickets found</Text>
        )}
      </View>
    </ScrollView>
  );
}
