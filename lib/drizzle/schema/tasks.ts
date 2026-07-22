import { pomodoroSessions } from "@/lib/drizzle/schema/pomodoro-sessions";
import { projects } from "@/lib/drizzle/schema/projects";
import { relations, sql } from "drizzle-orm";
import {
   bigint,
   boolean,
   foreignKey,
   pgTable,
   text,
   timestamp,
   unique,
   uuid,
   smallint,
} from "drizzle-orm/pg-core";

export const tasks = pgTable(
   "tasks",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "tasks_id_seq",
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
      }),
      userId: bigint("user_id", { mode: "number" }).notNull(),
      title: text().notNull(),
      targetPomodoroSessions: smallint("target_pomodoro_sessions")
         .default(sql`'1'`)
         .notNull(),
      currentPomodoroSession: smallint("current_pomodoro_session")
         .default(sql`'0'`)
         .notNull(),
      isCompleted: boolean("is_completed").default(false).notNull(),
      tags: text().array(),
      publicId: uuid("public_id").defaultRandom().notNull(),
      projectId: bigint("project_id", { mode: "number" }),
   },
   (table) => [
      foreignKey({
         columns: [table.projectId],
         foreignColumns: [projects.id],
         name: "tasks_project_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      unique("tasks_public_id_key").on(table.publicId),
   ]
);

export const tasksRelations = relations(tasks, ({ one, many }) => ({
   project: one(projects, {
      fields: [tasks.projectId],
      references: [projects.id],
   }),
   pomodoroSessions: many(pomodoroSessions),
}));
