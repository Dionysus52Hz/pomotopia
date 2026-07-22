import { shopOfferRewards } from "@/lib/drizzle/schema/shop-offer-rewards";
import { userUnlocks } from "@/lib/drizzle/schema/user-unlocks";
import { relations } from "drizzle-orm";
import {
   bigint,
   boolean,
   pgTable,
   text,
   timestamp,
   unique,
   uuid,
} from "drizzle-orm/pg-core";

export const customizationsCatalog = pgTable(
   "customizations_catalog",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "customizations_catalog_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 9223372036854775807,
         cache: 1,
      }),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      publicId: uuid("public_id").defaultRandom().notNull(),
      category: text().notNull(),
      subCategory: text("sub_category"),
      code: text(),
      description: text(),
      previewUrl: text("preview_url"),
      isPremium: boolean("is_premium"),
   },
   (table) => [unique("customizations_catalog_code_key").on(table.code)]
);

export const customizationsCatalogRelations = relations(
   customizationsCatalog,
   ({ many }) => ({
      userUnlocks: many(userUnlocks),
      shopOfferRewards: many(shopOfferRewards),
   })
);
