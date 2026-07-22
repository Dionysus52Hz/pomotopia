import { AppError, SerializedAppError } from "@/lib/api/error";

export type ServiceResponse<T> = [T, null] | [null, AppError[]];
export type AppResponse<T> = [T, null] | [null, SerializedAppError[]];

export const MakeSuccess = <T>(data: T): AppResponse<T> => [data, null];

export const MakeError = (
   errors: AppError | AppError[]
): AppResponse<never> => {
   const errorList = Array.isArray(errors) ? errors : [errors];
   const serializedErrors = errorList.map((error) => {
      return {
         code: error.code,
         message: error.message,
         statusCode: error.statusCode,
         field: error.field,
      };
   });
   return [null, serializedErrors];
};
