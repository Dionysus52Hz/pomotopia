import { itemsCatalog } from "@/lib/drizzle/schema/items-catalog";
import { profiles } from "@/lib/drizzle/schema/profiles";
import { relations, sql } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   timestamp,
   smallint,
   jsonb,
} from "drizzle-orm/pg-core";

export const userInventory = pgTable(
   "user_inventory",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "user_inventory_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 1000000000000,
         cache: 1,
      }),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      updatedAt: timestamp("updated_at", {
         withTimezone: true,
         mode: "string",
      }).defaultNow(),
      itemId: bigint("item_id", { mode: "number" }).notNull(),
      userId: bigint("user_id", { mode: "number" }).notNull(),
      currentLevel: smallint("current_level"),
      currentExp: bigint("current_exp", { mode: "number" }),
      quantity: bigint({ mode: "number" })
         .default(sql`'1'`)
         .notNull(),
      acquiredAt: timestamp("acquired_at", {
         withTimezone: true,
         mode: "string",
      }).notNull(),
      expiredAt: timestamp("expired_at", {
         withTimezone: true,
         mode: "string",
      }),
      instanceStates: jsonb("instance_states"),
   },
   (table) => [
      foreignKey({
         columns: [table.itemId],
         foreignColumns: [itemsCatalog.id],
         name: "user_inventory_item_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("set null"),
      foreignKey({
         columns: [table.userId],
         foreignColumns: [profiles.id],
         name: "user_inventory_user_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
   ]
);

export const userInventoryRelations = relations(userInventory, ({ one }) => ({
   itemsCatalog: one(itemsCatalog, {
      fields: [userInventory.itemId],
      references: [itemsCatalog.id],
   }),
   profile: one(profiles, {
      fields: [userInventory.userId],
      references: [profiles.id],
   }),
}));
