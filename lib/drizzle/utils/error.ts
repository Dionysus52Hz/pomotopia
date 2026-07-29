import { DrizzleQueryError } from "drizzle-orm";
import {} from "drizzle-orm/postgres-js";

type PostgresError = {
   code: string;
   severity?: string;
   detail?: string;
   constraint_name?: string;
   table_name?: string;
};

export const DrizzleError = {
   isPostgresError(error: unknown): error is DrizzleQueryError & {
      cause: PostgresError;
   } {
      return (
         error instanceof DrizzleQueryError &&
         error.cause?.name === "PostgresError"
      );
   },

   isUniqueViolation(error: unknown): boolean {
      return this.isPostgresError(error) && error.cause.code === "23505";
   },

   isForeignKeyViolation(error: unknown): boolean {
      return this.isPostgresError(error) && error.cause.code === "23503";
   },
};
