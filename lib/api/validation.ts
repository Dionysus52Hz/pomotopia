import { AppError } from "@/lib/api/error";
import { AppResponse, MakeError } from "@/lib/api/response";
import z from "zod";

interface ValidationErrorOptions {
   defaultError: ReturnType<typeof AppError.convertToAppError>;
   fieldErrors: Record<string, ReturnType<typeof AppError.convertToAppError>>;
}

export function handleZodValidationError<
   Schema extends z.ZodObject<z.ZodRawShape>,
>(
   zodError: z.ZodError<z.infer<Schema>>,
   options: ValidationErrorOptions
): AppResponse<never> {
   const errors: AppError[] = [];
   const tree = z.treeifyError(zodError);

   for (const field of Object.keys(options.fieldErrors) as Array<
      keyof z.infer<Schema>
   >) {
      if (
         tree.properties?.[field]?.errors &&
         tree.properties?.[field]?.errors.length > 0
      ) {
         errors.push(options.fieldErrors[field as string]);
      }
   }
   if (errors.length > 0) {
      return MakeError(errors);
   }

   return MakeError(AppError.convertToAppError(options.defaultError));
}
