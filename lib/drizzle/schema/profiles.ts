import { pomodoroSessions } from "@/lib/drizzle/schema/pomodoro-sessions";
import { projects } from "@/lib/drizzle/schema/projects";
import { tradeItems } from "@/lib/drizzle/schema/trade-items";
import { trades } from "@/lib/drizzle/schema/trades";
import { userInventory } from "@/lib/drizzle/schema/user-inventory";
import { userSettings } from "@/lib/drizzle/schema/user-settings";
import { userUnlocks } from "@/lib/drizzle/schema/user-unlocks";
import { usersInAuth } from "@/lib/drizzle/schema/users";
import { relations, sql } from "drizzle-orm";
import {
   bigint,
   boolean,
   foreignKey,
   pgPolicy,
   pgTable,
   text,
   timestamp,
   unique,
   uuid,
} from "drizzle-orm/pg-core";

export const profiles = pgTable(
   "profiles",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "profiles_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 9223372036854775807,
         cache: 1,
      }),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      updatedAt: timestamp("updated_at", {
         withTimezone: true,
         mode: "string",
      }).defaultNow(),
      username: text(),
      avatarUrl: text("avatar_url"),

      level: bigint({ mode: "number" })
         .default(sql`'1'`)
         .notNull(),

      exp: bigint({ mode: "number" })
         .default(sql`'0'`)
         .notNull(),

      timeEssence: bigint("time_essence", { mode: "number" })
         .default(sql`'0'`)
         .notNull(),

      unclaimedExp: bigint("unclaimed_exp", { mode: "number" })
         .default(sql`'0'`)
         .notNull(),

      unclaimedTimeEssence: bigint("unclaimed_time_essence", { mode: "number" })
         .default(sql`'0'`)
         .notNull(),

      accumulatedMinutes: bigint("accumulated_minutes", { mode: "number" })
         .default(sql`'0'`)
         .notNull(),
      lastDailyClaims: timestamp("last_daily_claims", {
         withTimezone: true,
         mode: "string",
      }),
      publicId: uuid("public_id").defaultRandom().notNull(),
      onboardingCompleted: boolean("onboarding_completed").notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.publicId],
         foreignColumns: [usersInAuth.id],
         name: "profiles_public_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      unique("profiles_username_key").on(table.username),
      unique("profiles_public_id_key").on(table.publicId),
      pgPolicy("Enable insert for users based on user_id", {
         as: "permissive",
         for: "insert",
         to: ["public"],
         withCheck: sql`(( SELECT auth.uid() AS uid) = public_id)`,
      }),
      pgPolicy("Enable users to view their own data only", {
         as: "permissive",
         for: "select",
         to: ["authenticated"],
      }),
   ]
);

export const profilesRelations = relations(profiles, ({ one, many }) => ({
   usersInAuth: one(usersInAuth, {
      fields: [profiles.publicId],
      references: [usersInAuth.id],
   }),
   userUnlocks: many(userUnlocks),
   trades_receiverId: many(trades, {
      relationName: "trades_receiverId_profiles_id",
   }),
   trades_senderId: many(trades, {
      relationName: "trades_senderId_profiles_id",
   }),
   tradeItems: many(tradeItems),
   userSettings: one(userSettings),
   userInventories: one(userInventory),
   pomodoroSessions: many(pomodoroSessions),
   projects: many(projects),
}));

export type SelectProfile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;
export type UpdateProfile = Partial<typeof profiles.$inferInsert>;
