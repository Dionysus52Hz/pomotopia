import {
   pgTable,
   uuid,
   timestamp,
   text,
   bigint,
   jsonb,
} from "drizzle-orm/pg-core";

export const ranks = pgTable("ranks", {
   id: uuid().defaultRandom().primaryKey().notNull(),
   createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
   name: text().notNull(),
   minLevel: bigint("min_level", { mode: "number" }).notNull(),
   badgeUrl: text("badge_url"),
   attributes: jsonb(),
});
