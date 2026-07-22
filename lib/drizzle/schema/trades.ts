import { profiles } from "@/lib/drizzle/schema/profiles";
import { tradeItems } from "@/lib/drizzle/schema/trade-items";
import { relations } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   timestamp,
   uuid,
} from "drizzle-orm/pg-core";

export const trades = pgTable(
   "trades",
   {
      id: uuid().defaultRandom().primaryKey().notNull(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      updatedAt: timestamp("updated_at", {
         withTimezone: true,
         mode: "string",
      }),
      senderId: bigint("sender_id", { mode: "number" }).notNull(),
      receiverId: bigint("receiver_id", { mode: "number" }).notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.receiverId],
         foreignColumns: [profiles.id],
         name: "trades_receiver_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      foreignKey({
         columns: [table.senderId],
         foreignColumns: [profiles.id],
         name: "trades_sender_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
   ]
);

export const tradesRelations = relations(trades, ({ one, many }) => ({
   profile_receiverId: one(profiles, {
      fields: [trades.receiverId],
      references: [profiles.id],
      relationName: "trades_receiverId_profiles_id",
   }),
   profile_senderId: one(profiles, {
      fields: [trades.senderId],
      references: [profiles.id],
      relationName: "trades_senderId_profiles_id",
   }),
   tradeItems: many(tradeItems),
}));
