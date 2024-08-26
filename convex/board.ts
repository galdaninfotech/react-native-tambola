import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";
import { autoCheck } from './users';


/**
 * This mutation sets the prizes for the active game by inserting winners into the database.
 * It first finds the active game, then retrieves all prizes associated with that game that have a quantity greater than 0.
 * For each of these prizes, it inserts a winner into the database, linking the prize to the active game.
 * The mutation returns the list of prizes that were awarded.
 */
export const setPrizes = mutation({
	args: {},
	handler: async (ctx) => {
		 // check auth
		 const viewerId = await auth.getUserId(ctx);
		 if (viewerId === null) {
		 throw new Error("User is not authenticated");
		 }

		 // Check if prizes are already set in the winners table
		 const winner = await ctx.db.query("winners").first();
		 if(winner) throw new Error("Prizes Alreadt Set!!");
		
		// Retrieve the active game
		const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();

		// Retrieve all prizes associated with the active game that have a quantity greater than 0
		const prizes = await ctx.db.query("game_prize")
			.filter(q => q.gt(q.field("quantity"), 0))
			.filter(q => q.eq(q.field("game_id"), activeGame[0]?._id))
			.collect();

		// For each prize, insert a dummy winner with no user_id, ticket_is and claim_id
		for (const prize of prizes) {
			if (prize.quantity > 1) {
				for (let i = 0; i < prize.quantity; i++) {
					await ctx.db.insert("winners", {
						game_prize_id: prize._id,
						game_id: activeGame[0]?._id,
					});
				}
			} else {
				await ctx.db.insert("winners", {
					game_prize_id: prize._id,
					game_id: activeGame[0]?._id,
				});
			}
		}

		return prizes;
	},
});


/**
 * A function to handle drawing a random number for a game.
 *
 * @param {Object} ctx - The context object containing the database query.
 * @param {Object} args - Additional arguments for the function.
 * @return {Object} An object containing the drawnNumber and gameNumberId.
 */
export const drawRandomNumber = mutation({

	handler: async (ctx, args) => {
		const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();

		// set the game status to "Started"
		await ctx.db.patch(activeGame[0]._id, { status: "Started", });

		// if the numbers drawn is greater than 90, throw error
		const drawnNumbers = await ctx.db .query("game_number") .filter((q) => q.eq(q.field("game_id"), activeGame[0]._id)) .collect();
		if(drawnNumbers.length > 90) throw new Error("All numbers have been drawn for this game.");

		// Get all numbers from the numbers table
		const allNumbers = await ctx.db.query("numbers")
			.filter((q) => q.gte(q.field("number"), 1))
			.filter((q) => q.lte(q.field("number"), 90))
			.collect();

		// Filter out already drawn numbers
		const availableNumbers = allNumbers.filter(
			(num) => !drawnNumbers.some((drawn) => drawn.number_id === num._id)
		);

		// Select a random number from the available numbers
		const randomIndex = Math.floor(Math.random() * availableNumbers.length);
		const selectedNumber = availableNumbers[randomIndex];

		// Insert the new random number into the game_number table
		const newGameNumber = await ctx.db.insert("game_number", {
			game_id: activeGame[0]._id,
			number_id: selectedNumber._id,
			declared_at: new Date().toISOString(),
		});

		// Get all users with autotick = true and their tickets
		const users = await ctx.db.query("extended_users").filter((q) => q.eq(q.field("autotick"), true)).collect();

		// Get all tickets for the users with autotick = true
		const ticketsNested = await Promise.all(
		users.map(async (user) => {
		return await ctx.db.query("tickets").filter((q) => q.eq(q.field("user_id"), user.user_id)).collect();
		})
		);

		// Flatten the nested array of tickets
		const tickets = ticketsNested.flat();

		// Call autoCheck internal mutation located in the users.ts
		await autoCheck(ctx, { tickets });
	  

		return {
			drawnNumber: selectedNumber.number,
			gameNumberId: newGameNumber,
		};
	},
});

export const pauseGame = mutation({

	handler: async (ctx, args) => {
		const activeGame = await ctx.db.query("games").filter(q => q.eq(q.field("active"), true)).collect();
		await ctx.db.patch(activeGame[0]._id, { status: "Paused", });
	},
});


