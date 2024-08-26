import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { auth } from "./auth";
import { Id } from "./_generated/dataModel";

export const get = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        return await ctx.db.query("users") .filter((q) => q.eq(q.field("_id"), userId )) .first();
  },
});

// Get the number of players in the game
export const noOfPlayers = query({
  args: {},
  handler: async (ctx) => {
    // Get the active game
    const activeGame = await ctx.db .query("games") .filter((q) => q.eq(q.field("active"), true)) .collect();
    if (!activeGame.length) {
      console.log("No active game found");
      return 0;
    }

    // Get all tickets for the active game with status = "Active"
    const tickets = await ctx.db .query("tickets")
      .filter((q) => q.eq(q.field("game_id"), activeGame[0]?._id))
      .filter((q) => q.eq(q.field("status"), "Active")) .collect();

    // Filter out unique user_ids
    const uniqueUserIds = Array.from(
      new Map(tickets.map((ticket) => [ticket.user_id, ticket])).values()
    );

    return uniqueUserIds.length;
  },
});

export const updateProfile = mutation({
  args: { 
    userId: v.id("users"), 
    name: v.string(), 
    image: v.string(),
    phone: v.string(),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, { 
      name: args.name,
      image: args.image,
      phone: args.phone
    });
  },
});

export const toggleAutoTick = mutation({
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) { throw new Error("Not authenticated") }

    const extendedUser = await ctx.db.query("extended_users") .filter((q) => q.eq(q.field("user_id"), userId)).first()
    const tickets = await ctx.db .query("tickets") .filter((q) => q.eq(q.field("user_id"), userId)) .collect();

    if (!extendedUser) {
      await ctx.db.insert("extended_users", { user_id: userId, autotick: true })
      // await ctx.runMutation(autoCheck, { userId })
      await autoCheck(ctx, { tickets });
      
      return { success: true }
    } else {
      await ctx.db.patch(extendedUser._id, { autotick: !extendedUser.autotick })
      // await ctx.runMutation(autoCheck, { userId })
      // await Convex.run('autoCheck', { userId });
      await autoCheck(ctx, { tickets });
              
      return { success: true }
    }

    return { success: false }
  },
});


export const autoCheck = internalMutation({
  args: {
    tickets: v.array(v.object({
      _id: v.id("tickets"),
      game_id: v.id("games"), // Reference to the game
      user_id: v.id("users"), // Reference to the user
      status: v.union(
        v.literal("Active"),
        v.literal("Disqualified"),
        v.literal("Old")
      ), // Status of the ticket
      comment: v.optional(v.string()), // Optional comment
      color: v.optional(v.string()), // Optional color
      on_color: v.optional(v.string()), // Optional on color
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
      )

    }))
  },

  handler: async (ctx, args) => {
    const activeGame = await ctx.db .query('games') .filter((q) => q.eq(q.field('active'), true)) .first();
    if (!activeGame) { throw new Error('No active game found'); }

    // 2. Get drawn numbers for the active game
    const drawnNumberIds = await ctx.db.query('game_number').filter((q) => q.eq(q.field('game_id'), activeGame._id)).collect()
      .then((docs) => docs.map((doc) => doc.number_id));

    const drawnNumbers = await ctx.db.query('numbers')
      .filter((q) => q.or(...drawnNumberIds.map((id) => q.eq(q.field('_id'), id)))).collect()
      .then((docs) => docs.map((doc) => doc.number));

    // 3. Update each ticket's numbers
    for (let ticket of args.tickets) {
      const updatedNumbers = ticket?.numbers?.map((row: any) =>
        row.map((num: any) => {
          if (typeof num === 'object' && drawnNumbers.includes(num.value)) {
            return { ...num, checked: 1 }; // Mark as checked
          }
          return num; // Return as is if not a number object or not drawn
        })
      );

      // Update the ticket with the new numbers array
      await ctx.db.patch(ticket._id, { numbers: updatedNumbers })
        .catch((err) => {
          console.error(`Failed to update ticket ${ticket._id}: ${err}`);
      });
    }
  },
});



