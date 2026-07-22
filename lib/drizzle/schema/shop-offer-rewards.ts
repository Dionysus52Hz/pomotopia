import { customizationsCatalog } from "@/lib/drizzle/schema/customizations-catalog";
import { itemsCatalog } from "@/lib/drizzle/schema/items-catalog";
import { relations, sql } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   text,
   timestamp,
   uuid,
   smallint,
} from "drizzle-orm/pg-core";

export const shopOfferRewards = pgTable(
   "shop_offer_rewards",
   {
      id: uuid().defaultRandom().primaryKey().notNull(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      offerId: uuid("offer_id").defaultRandom().notNull(),
      category: text().notNull(),
      itemId: bigint("item_id", { mode: "number" }),
      customizationId: bigint("customization_id", { mode: "number" }),
      durationDays: smallint("duration_days"),
      quantity: smallint()
         .default(sql`'1'`)
         .notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.customizationId],
         foreignColumns: [customizationsCatalog.id],
         name: "shop_offer_rewards_customization_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      foreignKey({
         columns: [table.itemId],
         foreignColumns: [itemsCatalog.id],
         name: "shop_offer_rewards_item_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
   ]
);

export const shopOfferRewardsRelations = relations(
   shopOfferRewards,
   ({ one }) => ({
      customizationsCatalog: one(customizationsCatalog, {
         fields: [shopOfferRewards.customizationId],
         references: [customizationsCatalog.id],
      }),
      itemsCatalog: one(itemsCatalog, {
         fields: [shopOfferRewards.itemId],
         references: [itemsCatalog.id],
      }),
   })
);
