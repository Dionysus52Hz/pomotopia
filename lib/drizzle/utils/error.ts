import { PostgresError } from "postgres";

export const DrizzleError = {
   isPostgresError(error: unknown): error is PostgresError {
      return error instanceof Error && error.name === "PostgresError";
   },

   isUniqueViolation(error: unknown): boolean {
      return this.isPostgresError(error) && error.code === "23505";
   },

   isForeignKeyViolation(error: unknown): boolean {
      return this.isPostgresError(error) && error.code === "23503";
   },
};
