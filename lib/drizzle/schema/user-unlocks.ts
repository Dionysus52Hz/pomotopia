import { customizationsCatalog } from "@/lib/drizzle/schema/customizations-catalog";
import { profiles } from "@/lib/drizzle/schema/profiles";
import { relations } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   timestamp,
   uuid,
} from "drizzle-orm/pg-core";

export const userUnlocks = pgTable(
   "user_unlocks",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "user_unlocks_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 1000000000000,
         cache: 1,
      }),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      publicId: uuid("public_id").defaultRandom().notNull(),
      userId: bigint("user_id", { mode: "number" }).notNull(),
      customizationId: bigint("customization_id", { mode: "number" }).notNull(),
      unlockedAt: timestamp("unlocked_at", {
         withTimezone: true,
         mode: "string",
      })
         .defaultNow()
         .notNull(),
      expiresAt: timestamp("expires_at", {
         withTimezone: true,
         mode: "string",
      }),
   },
   (table) => [
      foreignKey({
         columns: [table.customizationId],
         foreignColumns: [customizationsCatalog.id],
         name: "user_unlocks_customization_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      foreignKey({
         columns: [table.userId],
         foreignColumns: [profiles.id],
         name: "user_unlocks_user_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
   ]
);

export const userUnlocksRelations = relations(userUnlocks, ({ one }) => ({
   customizationsCatalog: one(customizationsCatalog, {
      fields: [userUnlocks.customizationId],
      references: [customizationsCatalog.id],
   }),
   profile: one(profiles, {
      fields: [userUnlocks.userId],
      references: [profiles.id],
   }),
}));
