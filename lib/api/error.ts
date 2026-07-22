import { StatusCodes } from "http-status-codes";

export interface SerializedAppError {
   code: string;
   message: string;
   statusCode: number;
   field?: string;
}

export class AppError extends Error {
   public readonly code: string;
   public readonly statusCode: number;
   public readonly field?: string;

   constructor(
      code: string,
      message: string,
      statusCode: number = StatusCodes.BAD_REQUEST,
      field?: string
   ) {
      super(message);
      this.name = "AppError";
      this.code = code;
      this.statusCode = statusCode;
      this.field = field;

      Object.setPrototypeOf(this, AppError.prototype);
   }

   static convertToAppError(object: unknown): AppError {
      const error = (object || {}) as Partial<SerializedAppError>;

      return new AppError(
         error.code || "UNKNOWN_ERROR",
         error.message || "An unexpected error occured",
         error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
         error.field
      );
   }

   static isAppError(error: unknown): boolean {
      return error instanceof AppError;
   }
}
