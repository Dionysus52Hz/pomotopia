import { profiles } from "@/lib/drizzle/schema/profiles";
import { tasks } from "@/lib/drizzle/schema/tasks";
import { relations, sql } from "drizzle-orm";
import {
   pgTable,
   bigint,
   timestamp,
   text,
   smallint,
   uuid,
   foreignKey,
   unique,
} from "drizzle-orm/pg-core";

export const projects = pgTable(
   "projects",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "projects_id_seq",
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
      name: text().notNull(),
      size: smallint()
         .default(sql`'0'`)
         .notNull(),
      publicId: uuid("public_id").defaultRandom().notNull(),
      imageUrl: text("image_url"),
      description: text(),
      userId: bigint("user_id", { mode: "number" }).notNull(),
   },
   (table) => [
      foreignKey({
         columns: [table.userId],
         foreignColumns: [profiles.id],
         name: "projects_user_id_fkey",
      })
         .onUpdate("cascade")
         .onDelete("cascade"),
      unique("projects_public_id_key").on(table.publicId),
   ]
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
   tasks: many(tasks),
   profile: one(profiles, {
      fields: [projects.userId],
      references: [profiles.id],
   }),
}));
