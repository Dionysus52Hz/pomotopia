import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/profiles";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
   throw new Error("DATABASE_URL is missing!");
}

const globalClient = globalThis as unknown as {
   conn: postgres.Sql | undefined;
};

const client =
   globalClient.conn ?? postgres(connectionString, { max: 15, prepare: false });

if (process.env.NODE_ENV !== "production") {
   globalClient.conn = client;
}

export const db = drizzle(client, { schema });
