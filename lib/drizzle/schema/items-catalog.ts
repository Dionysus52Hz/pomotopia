import { shopOfferRewards } from "@/lib/drizzle/schema/shop-offer-rewards";
import { userInventory } from "@/lib/drizzle/schema/user-inventory";
import { relations } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   text,
   timestamp,
   unique,
   uuid,
   jsonb,
} from "drizzle-orm/pg-core";

export const itemsCatalog = pgTable(
   "items_catalog",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "items_catalog_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 9223372036854775807,
         cache: 1,
      }),
      publicId: uuid("public_id").defaultRandom().notNull(),
      category: text().notNull(),
      subCategory: text("sub_category").notNull(),
      name: text().notNull(),
      sku: text(),
      grade: text(),
      description: text(),
      imageUrl: text("image_url"),
      nextEvolutionId: bigint("next_evolution_id", { mode: "number" }),
      attributes: jsonb(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      updatedAt: timestamp("updated_at", {
         withTimezone: true,
         mode: "string",
      }),
   },
   (table) => [
      foreignKey({
         columns: [table.nextEvolutionId],
         foreignColumns: [table.id],
         name: "items_catalog_next_evolution_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("set null"),
      unique("items_catalog_public_id_key").on(table.publicId),
      unique("items_catalog_next_evolution_id_key").on(table.nextEvolutionId),
   ]
);

export const itemsCatalogRelations = relations(
   itemsCatalog,
   ({ one, many }) => ({
      itemsCatalog: one(itemsCatalog, {
         fields: [itemsCatalog.nextEvolutionId],
         references: [itemsCatalog.id],
         relationName: "itemsCatalog_nextEvolutionId_itemsCatalog_id",
      }),
      itemsCatalogs: many(itemsCatalog, {
         relationName: "itemsCatalog_nextEvolutionId_itemsCatalog_id",
      }),
      shopOfferRewards: many(shopOfferRewards),
      userInventories: many(userInventory),
   })
);
