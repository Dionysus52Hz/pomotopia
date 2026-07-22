import { profiles } from "@/lib/drizzle/schema/profiles";
import { relations } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   timestamp,
   unique,
   uuid,
   jsonb,
} from "drizzle-orm/pg-core";

export const userSettings = pgTable(
   "user_settings",
   {
      appSettings: jsonb("app_settings"),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      updatedAt: timestamp("updated_at", {
         withTimezone: true,
         mode: "string",
      }),
      userId: bigint("user_id", { mode: "number" })
         .primaryKey()
         .generatedByDefaultAsIdentity({
            name: "user_settings_user_id_seq",
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
         }),
      publicId: uuid("public_id").notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.userId],
         foreignColumns: [profiles.id],
         name: "user_settings_user_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      unique("user_settings_public_id_key").on(table.publicId),
   ]
);

export const userSettingsRelations = relations(userSettings, ({ one }) => ({
   profile: one(profiles, {
      fields: [userSettings.userId],
      references: [profiles.id],
   }),
}));
