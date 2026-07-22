import { defineConfig } from "drizzle-kit";

export default defineConfig({
   schema: "./lib/drizzle/schema",
   out: "./lib/drizzle/migrations",
   dialect: "postgresql",
   dbCredentials: {
      url: process.env.DIRECT_DATABASE_URL!,
   },
   schemaFilter: ["public"],
});
