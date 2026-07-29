import { profiles } from "@/lib/drizzle/schema/profiles";
import { tasks } from "@/lib/drizzle/schema/tasks";
import { relations, sql } from "drizzle-orm";
import {
   bigint,
   foreignKey,
   pgTable,
   text,
   timestamp,
   unique,
   uuid,
   smallint,
} from "drizzle-orm/pg-core";

export const pomodoroSessions = pgTable(
   "pomodoro_sessions",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "pomodoro_sessions_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 1000000000000,
         cache: 1,
      }),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),

      taskId: bigint("task_id", { mode: "number" }).notNull(),

      userId: bigint("user_id", { mode: "number" }).notNull(),

      configDuration: bigint("config_duration", { mode: "number" })
         .default(sql`'0'`)
         .notNull(),
      startedAt: timestamp("started_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      completedAt: timestamp("completed_at", {
         withTimezone: true,
         mode: "string",
      }),
      status: text().notNull(),
      rewardBlocksEarned: smallint("reward_blocks_earned")
         .default(sql`'0'`)
         .notNull(),
      publicId: uuid("public_id").defaultRandom().notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.taskId],
         foreignColumns: [tasks.id],
         name: "pomodoro_sessions_task_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("set null"),
      foreignKey({
         columns: [table.userId],
         foreignColumns: [profiles.id],
         name: "pomodoro_sessions_user_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      unique("pomodoro_sessions_public_id_key").on(table.publicId),
   ]
);

export const pomodoroSessionsRelations = relations(
   pomodoroSessions,
   ({ one }) => ({
      task: one(tasks, {
         fields: [pomodoroSessions.taskId],
         references: [tasks.id],
      }),
      profile: one(profiles, {
         fields: [pomodoroSessions.userId],
         references: [profiles.id],
      }),
   })
);
