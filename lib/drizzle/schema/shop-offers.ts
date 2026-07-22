import {
   bigint,
   boolean,
   pgTable,
   text,
   timestamp,
   uuid,
} from "drizzle-orm/pg-core";

export const shopOffers = pgTable("shop_offers", {
   id: uuid().defaultRandom().primaryKey().notNull(),
   createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
   name: text().notNull(),
   price: bigint({ mode: "number" }).notNull(),
   description: text(),
   label: text(),
   isActive: boolean("is_active").notNull(),
});
