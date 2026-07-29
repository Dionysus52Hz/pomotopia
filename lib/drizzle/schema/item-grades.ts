import {
   pgTable,
   bigint,
   timestamp,
   uuid,
   smallint,
   numeric,
   unique,
} from "drizzle-orm/pg-core";

export const itemGrades = pgTable(
   "item_grades",
   {
      id: bigint({ mode: "number" }).primaryKey().generatedByDefaultAsIdentity({
         name: "item_grades_id_seq",
         startWith: 1,
         increment: 1,
         minValue: 1,
         maxValue: 1000000000000,
         cache: 1,
      }),
      publicId: uuid("public_id").defaultRandom().notNull(),
      createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
         .defaultNow()
         .notNull(),
      updatedAt: timestamp("updated_at", {
         withTimezone: true,
         mode: "string",
      }),
      maxLevel: smallint("max_level").notNull(),
      baseExp: smallint("base_exp").notNull(),
      expMultiplier: numeric("exp_multiplier").notNull(),
   },
   (table) => [unique("item_grades_public_id_key").on(table.publicId)]
);
