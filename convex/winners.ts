import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const updateWinners = mutation({
     // Validators for arguments.
    args: {
        game_prize_id: v.id("game_prize"),
        user_id: v.optional(v.id("users")),
        ticket_id: v.optional(v.id("tickets")),
        claim_id: v.optional(v.id("claims")), 
    },

    // Mutation implementation.
    handler: async (ctx, args) => {
        // check auth
        const viewerId = await auth.getUserId(ctx);
        if (viewerId === null) {
            throw new Error("User is not authenticated");
        }

        // Find the winner entry
        const winner = await ctx.db.query("winners")
            .filter((q) => q.eq(q.field("game_prize_id"), args.game_prize_id))
            .filter((q) => q.eq(q.field("user_id"), undefined))
            .filter((q) => q.eq(q.field("ticket_id"), undefined))
            .filter((q) => q.eq(q.field("claim_id"), undefined))
            .first();

        if (winner) {
            // Update the winner
            await ctx.db.patch(winner._id, {
                user_id: args.user_id,
                ticket_id: args.ticket_id,
                claim_id: args.claim_id,
            });

            // Update the claims table
            if (args.claim_id) {
                await ctx.db.patch(args.claim_id, {
                    is_winner: true,
                    status: "Winner",
                });
                console.log("updated the document.");
            }

            // Update the Status to "Started" in games table
            const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
            await ctx.db.patch(activeGame[0]._id, { status: "Started", });

            // Decrement the remaining_quantity in game_prize table
            const gamePrize = await ctx.db.get(args.game_prize_id);
            if (gamePrize && gamePrize.remaining_quantity > 0) {
                await ctx.db.patch(args.game_prize_id, { remaining_quantity: gamePrize.remaining_quantity - 1 });
            }

            return { success: true, message: "Winner updated successfully" };
        } else {
            throw new Error("There is no prize left to set winner for!");
        }

        // Optionally, return a value from your mutation.
        return true;
    },
});
