import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const getAllPrizes = query({
    handler: async (ctx) => {
      const prizes = await ctx.db.query("prizes").collect();
      return prizes;
    },
});

export const getAllGamePrizes = query({
    handler: async (ctx) => {
      const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
      const prizes = await ctx.db.query("game_prize").filter(q => q.eq(q.field("game_id"), activeGame[0]?._id)).collect();
      return prizes;
    },
});

export const getAllPrizesAndWinners = query({
        handler: async (ctx) => {
          const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
          const prizesWinners = await ctx.db.query("winners").filter(q => q.eq(q.field("game_id"), activeGame[0]?._id)).collect();

          const gamePrizes = await ctx.db.query("game_prize").collect();
          const users = await ctx.db.query("users").collect();

          const allPrizesAndWinners = prizesWinners.map((winner) => ({
            ...winner,
            user_name: users.find((user) => user._id === winner.user_id)?.name,
            prize_name: gamePrizes.find((gamePrize) => gamePrize._id === winner.game_prize_id)?.prize_name,
            prize_amount: gamePrizes.find((gamePrize) => gamePrize._id === winner.game_prize_id)?.prize_amount,
            // Include the new fields here
            user_id: winner.user_id,
            claim_id: winner.claim_id,
            ticket_id: winner.ticket_id,
          }));
          
          // console.log(allPrizesAndWinners);

          return allPrizesAndWinners;
       },
});

export const addPrize = mutation({
     // Validators for arguments.
    args: {
        prizeId: v.id("prizes"),
        amount: v.number(),
        quantity: v.number(),
        active: v.boolean(),
        remarks: v.string(),
    },

    // Mutation implementation.
    handler: async (ctx, args) => {
        // check auth
        const viewerId = await auth.getUserId(ctx);
        if (viewerId === null) {
        throw new Error("User is not authenticated");
        }

        const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
        const prize = await ctx.db.query("prizes").filter(q => q.eq(q.field("_id"), args.prizeId)).first();

        const id = await ctx.db.insert("game_prize", { 
            game_id: activeGame[0]?._id,
            prize_id: args.prizeId,
            prize_name: prize?.name || "",
            prize_amount: args.amount,
            quantity: args.quantity,
            remaining_quantity: args.quantity,
            active: args.active,
            remarks: args.remarks
        });

        console.log("Added new document with id:");
        // Optionally, return a value from your mutation.
        return true;
    },
});
