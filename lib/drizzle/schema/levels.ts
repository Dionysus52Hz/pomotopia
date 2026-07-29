import { pgTable, bigint, timestamp, unique } from "drizzle-orm/pg-core";

export const levels = pgTable(
   "levels",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "levels_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 1000000000000,
         cache: 1,
      }),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),

      level: bigint({ mode: "number" }).notNull(),

      requiredExp: bigint("required_exp", { mode: "number" }).notNull(),
   },
   (table) => [unique("levels_level_key").on(table.level)]
);
