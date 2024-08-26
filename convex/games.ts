import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

export const gameInfo = query({

	handler: async (ctx) => {
        const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
        const userId = await auth.getUserId(ctx);
        const user = userId === null ? null : await ctx.db.get(userId);

        const prizes = await ctx.db.query("prizes").collect();
        const gamePrizes = await ctx.db.query("prizes").collect();
        const drawnNumbers = await ctx.db .query("game_number") .filter((q) => q.eq(q.field("game_id"), activeGame[0]._id)) .collect();
        const ticketsSold = await ctx.db .query("tickets") .filter((q) => q.eq(q.field("game_id"), activeGame[0]._id)) .collect();

        const gameInfo = {
            activeGame: activeGame[0],
            authUser: user,
            prizes: prizes,
            gamePrizes: gamePrizes,
            drawnNumbers: drawnNumbers,
            ticketsSold: ticketsSold            
        };
        return gameInfo;
    },
});

/* 
Game Info
    noOfLoggedInUsers
    noOfTicketsSold
    totalPrizeAmount





























*/
