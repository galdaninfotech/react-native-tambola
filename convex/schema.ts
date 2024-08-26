import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";
 
const schema = defineSchema({
  ...authTables,


  // Your other tables...
  /**
   * The `games` table stores information about games.
   */
  games: defineTable({
    name: v.string(), // Name of the game
    start: v.optional(v.string()), // Optional start time
    end: v.optional(v.string()), // Optional end time
    ticket_price: v.number(), // Price of the ticket
    active: v.boolean(), // Active status
    status: v.union(
      v.literal("Starting Shortly"),
      v.literal("Started"),
      v.literal("On"),
      v.literal("Paused"),
      v.literal("End")
    ), // Status of the game
    comment: v.optional(v.string()), // Optional comment field
  }),

  tickets: defineTable({
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
    ), // Optional nested array of numbers
  }),

  /**
   * The `prizes` table stores information about prizes.
   */
  prizes: defineTable({
    name: v.string(), // Name of the prize
    description: v.optional(v.string()), // Optional description
  }),

  /**
   * The `claims` table stores information about claims.
   */
  claims: defineTable({
    ticket_id: v.id("tickets"), // Reference to the ticket
    game_prize_id: v.id("game_prize"), // Reference to the game prize
    status: v.union(
      v.literal("Open"),
      v.literal("Winner"),
      v.literal("boggy")
    ), // Status of the claim
    is_winner: v.boolean(), // Winner status
    is_boogy: v.boolean(), // Boogy status
    remarks: v.optional(v.string()), // Optional remarks
  }),

  /**
   * The `numbers` table stores information about numbers.
   */
  numbers: defineTable({
    number: v.number(), // The number
    tagline: v.string(), // Tagline for the number
  }),

  /**
   * The `winners` table stores information about winners.
   */
  winners: defineTable({
    game_prize_id: v.id("game_prize"), // Reference to the game prize
    game_id: v.id("games"), // Reference to the game
    user_id: v.optional(v.id("users")), // Reference to the user
    ticket_id: v.optional(v.id("tickets")), // Reference to the ticket
    claim_id: v.optional(v.id("claims")), // Reference to the claim
  }),

  /**
   * The `game_number` table stores information about game numbers.
   */
  game_number: defineTable({
    game_id: v.id("games"), // Reference to the game
    number_id: v.id("numbers"), // Reference to the number
    declared_at: v.string(), // Declaration time
  }),

  /**
   * The `game_prize` table stores information about game prizes.
   */
  game_prize: defineTable({
    prize_id: v.id("prizes"), // Reference to the prize
    game_id: v.id("games"), // Reference to the game
    prize_name: v.string(), // Name of the prize
    prize_amount: v.number(), // Amount of the prize
    quantity: v.number(), // Quantity of the prize
    remaining_quantity: v.number(), // Quantity of the prize
    active: v.boolean(), // Active status
    remarks: v.optional(v.string()), // Optional remarks
  }),

  /**
   * The `game_user` table stores information about game users.
   */
  game_user: defineTable({
    game_id: v.id("games"), // Reference to the game
    user_id: v.id("users"), // Reference to the user
  }),

  /**
   * The `payments` table stores information about payments.
   */
  payments: defineTable({
    payer_id: v.id("users"), // Reference to the payer (user)
    payer_email: v.optional(v.string()), // Optional email of the payer
    amount: v.number(), // Amount of the payment
    currency: v.string(), // Currency of the payment
    payment_status: v.string(), // Status of the payment
  }),
  
  // Extend the users table to add extra field
  extended_users: defineTable({
    user_id: v.id("users"), // Reference to the payer (user)
    autotick: v.optional(v.boolean()),
    autoclaim: v.optional(v.boolean()),
  }),


  
});
 
export default schema;