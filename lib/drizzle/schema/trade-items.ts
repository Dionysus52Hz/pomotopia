import { profiles } from "@/lib/drizzle/schema/profiles";
import { trades } from "@/lib/drizzle/schema/trades";
import { relations } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   timestamp,
   uuid,
} from "drizzle-orm/pg-core";

export const tradeItems = pgTable(
   "trade_items",
   {
      id: uuid().defaultRandom().primaryKey().notNull(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      tradeId: uuid("trade_id").defaultRandom().notNull(),
      ownerId: bigint("owner_id", { mode: "number" }).notNull(),
      itemId: bigint("item_id", { mode: "number" }).notNull(),
      quantity: bigint({ mode: "number" }).notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.ownerId],
         foreignColumns: [profiles.id],
         name: "trade_items_owner_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("set null"),
      foreignKey({
         columns: [table.tradeId],
         foreignColumns: [trades.id],
         name: "trade_items_trade_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
   ]
);

export const tradeItemsRelations = relations(tradeItems, ({ one }) => ({
   profile: one(profiles, {
      fields: [tradeItems.ownerId],
      references: [profiles.id],
   }),
   trade: one(trades, {
      fields: [tradeItems.tradeId],
      references: [trades.id],
   }),
}));
