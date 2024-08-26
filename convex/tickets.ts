import { query, mutation  } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const getTicketsById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.query("tickets")
    .filter((q) => q.eq(q.field("user_id"), args.userId ))
      .collect();
    return ticket;
  },
});



export const getTicketsByIdWithClaims = query({
  args: {},
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    const tickets = await ctx.db.query("tickets")
      .filter((q) => q.eq(q.field("user_id"), userId))
      .collect();

    const ticketIds = tickets.map(ticket => ticket._id);

    const claims = await ctx.db.query("claims")
      .filter((q) => q.or(...ticketIds.map(id => q.eq(q.field("ticket_id"), id))))
      .collect();

    const gamePrizes = await ctx.db.query("game_prize").collect();

    const ticketsWithClaims = tickets.map(ticket => ({
      ...ticket,
      claims: claims
        .filter(claim => claim.ticket_id === ticket._id)
        .map(claim => ({
          ...claim,
          prize_name: gamePrizes.find(prize => prize._id === claim.game_prize_id)?.prize_name || ''
        }))
    }));

    return ticketsWithClaims;
  },
});


export const getAllGamePrizes = query({
  handler: async (ctx) => {
    const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
    const gamePrizes = await ctx.db.query("game_prize")
      .filter(q => q.eq(q.field("game_id"), activeGame[0]?._id))
      .filter(q => q.gt(q.field("remaining_quantity"), 0))
      .collect();
    return gamePrizes;
  },
});

export const getAllActiveClaims = query({
  handler: async (ctx) => {
    const activeClaims = await ctx.db.query("claims").filter(q => q.eq(q.field("status"), "Open")).collect();

    const claimsWithPrizeName = await Promise.all(activeClaims.map(async (claim) => {
      const prize = await ctx.db.query("game_prize")
        .filter(q => q.eq(q.field("_id"), claim.game_prize_id)).first();
      return { ...claim, prize_name: prize?.prize_name };
    }));

    const claimsWithPrizeNameAndTicketNumbers = await Promise.all(claimsWithPrizeName.map(async (claim) => {
      const ticket = await ctx.db.query("tickets")
        .filter(q => q.eq(q.field("_id"), claim.ticket_id)).first();
      return { ...claim, numbers: ticket?.numbers, user_id: ticket?.user_id };
    }));

    const claimsWithPrizeNameAndTicketNumbersAndUserName = await Promise.all(claimsWithPrizeNameAndTicketNumbers.map(async (claim) => {
      const user = await ctx.db.query("users")
        .filter(q => q.eq(q.field("_id"), claim.user_id)).first();
      return { ...claim, user_name: user?.name };
    }));

    return claimsWithPrizeNameAndTicketNumbersAndUserName;
  },
});



export const getAllNumbers = query({
  handler: async (ctx) => {
    const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
    const allGameNumbers = await ctx.db.query("game_number").filter(q => q.eq(q.field("game_id"), activeGame[0]?._id)).collect();
    const allNumbers = await Promise.all(allGameNumbers.map(async (gameNumber) => {
      const number = await ctx.db.get(gameNumber.number_id);
      return { ...gameNumber, number: number?.number };
    }));
    return allNumbers;
  },
});

export const getActiveGame = query({
  handler: async (ctx) => {
    const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
    return activeGame;
  },
});

export const toggleChecked = mutation({
  args: { 
    ticketId: v.id("tickets"), 
    row: v.number(),
    column: v.number(),
  },

  handler: async (ctx, args) => {
    const { ticketId, row, column } = args;
    const ticket = await ctx.db.get(ticketId);
    const oldNumbers = ticket?.numbers;
    // console.log(typeof(oldNumbers));
    
    const updatedNumbers = oldNumbers?.map((numberArray, rowIndex) => 
      rowIndex === row ? 
        numberArray.map((number, colIndex) => 
          colIndex === column ? (typeof number === 'object' ? { ...number, checked: number.checked === 0 ? 1 : 0 } : number) : number
        ) : 
        numberArray
    );
    // console.log(updatedNumbers)
    await ctx.db.patch(ticketId, { numbers: updatedNumbers});
  },
});

export const newClaim = mutation({
  args: {
    ticketId: v.id("tickets"),
    gamePrizeId: v.id("game_prize"),
  },
  handler: async (ctx, args) => {
    // Check if a claim with the same ticketId and gamePrizeId already exists
    const existingClaim = await ctx.db.query("claims")
      .filter(q => q.eq(q.field("ticket_id"), args.ticketId))
      .filter(q => q.eq(q.field("game_prize_id"), args.gamePrizeId))
      .first();

    // If an existing claim is found, stop further execution
    if (existingClaim) {
      throw new Error("A claim with the same ticketId and gamePrizeId already exists.");
    }

    // If no existing claim, proceed with the insertion
    const claimId = await ctx.db.insert("claims", {
      ticket_id: args.ticketId,
      game_prize_id: args.gamePrizeId,
      is_boogy: false,
      is_winner: false,
      remarks: "ggggggg",
      status: "Open"
    });

    // Update the Status in games table
    const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
    await ctx.db.patch(activeGame[0]._id, { status: "Paused", });

    return { success: true }
  },
});


export const saveTicket = mutation({
  args: {
    numbers: v.optional(
      v.array(
        v.array(
          v.union(
            v.object({
              checked: v.float64(), // Checked status
              id: v.string(), // ID of the number
              value: v.float64(), // Value of the number
            }),
            v.number()
          )
        )
      )
    ), 
    status: v.union(v.literal("Active"), v.literal("Disqualified"), v.literal("Old")),
    comment: v.optional(v.string()),
    color: v.optional(v.string()),
    on_color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
    const viewerId = await auth.getUserId(ctx);

    if (viewerId === null) {
      throw new Error("User is not authenticated");
    }

    const ticketId = await ctx.db.insert("tickets", {
      game_id: activeGame[0]._id,
      user_id: viewerId,
      numbers: args.numbers,
      status: args.status,
      comment: args.comment,
      color: args.color,
      on_color: args.on_color,
    });

    return ticketId;
  },
});


export const searchFriends = query({
  args: {
    searchString: v.string()
  },
  handler: async (ctx, args) => {
    const viewerId = await auth.getUserId(ctx);
    if (viewerId === null) {
      throw new Error("User is not authenticated");
    }

    const searchResult = await ctx.db.query("users")
      .filter(q => q.eq(q.field("email"), args.searchString))
      .collect();

    if (searchResult)
      return searchResult;
    else
      return [];
  },
});


export const sendTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    friendsEmailID: v.string(),
  },
  handler: async (ctx, args) => {
    const friend = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.friendsEmailID))
      .unique()

    if (!friend) {
      throw new Error("User with provided email not found")
    }

    // Update the ticket's user_id in users table with friend's id
    const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
    await ctx.db.patch(args.ticketId, { user_id: friend._id })

    return { success: true }

  },
});


// Total number of tickets sold in the game
export const noOfTickets = query({
  args: {},
  handler: async (ctx) => {
    // Get the active game
    const activeGame = await ctx.db .query("games") .filter((q) => q.eq(q.field("active"), true)) .collect();
    if (!activeGame.length) {
      console.log("No active game found");
      return 0;
    }

    // Get all tickets for the active game
    const tickets = await ctx.db
      .query("tickets")
      .filter((q) => q.eq(q.field("game_id"), activeGame[0]?._id))
      .collect();

    return tickets.length;
  },
});