import { AppError } from "@/lib/api/error";
import { AppResponse, MakeError } from "@/lib/api/response";
import { error } from "console";
import { StatusCodes } from "http-status-codes";
import z from "zod";

interface FieldErrorMatcher {
   match: (issue: z.core.$ZodIssue) => boolean;
   error: ReturnType<typeof AppError.convertToAppError>;
}

interface ValidationErrorOptions<Schema extends z.ZodObject<z.ZodRawShape>> {
   defaultError: ReturnType<typeof AppError.convertToAppError>;
   // fieldErrors: Partial<Record<keyof z.infer<Schema>, FieldErrorMatcher[]>>;
}

interface FieldCustomError {
   code: string;
   statusCode: number;
   message: string;
}

export function handleZodValidationError<
   Schema extends z.ZodObject<z.ZodRawShape>,
>(
   zodError: z.ZodError<z.infer<Schema>>,
   options: ValidationErrorOptions<Schema>
): AppResponse<never> {
   const errors: AppError[] = [];
   const seen = new Set<string>();

   for (const issue of zodError.issues) {
      let fieldError: FieldCustomError | string;
      // if (typeof field !== "string") continue;

      // const matchers = options.fieldErrors[field as keyof z.infer<Schema>];
      // if (!matchers) continue;

      // const matched = matchers.find((m) => m.match(issue));
      // if (matched && !seen.has(matched.error.code)) {
      //    errors.push(matched.error);
      //    seen.add(matched.error.code);
      // }
      const field = issue.path.length > 0 ? issue.path.join(".") : undefined;
      if (issue.code === "custom") {
         fieldError =
            (issue.params as FieldCustomError | undefined) ??
            options.defaultError;
      } else fieldError = issue.code;

      const uniqueKey =
         typeof fieldError !== "string"
            ? `${fieldError.code}:${field}`
            : `${fieldError}:${field}`;
      if (!seen.has(uniqueKey)) {
         if (typeof fieldError !== "string") {
            errors.push(
               AppError.convertToAppError({
                  ...fieldError,
                  message: issue.message,
                  field: field,
               })
            );
         } else {
            errors.push(
               AppError.convertToAppError({
                  code: fieldError,
                  field: field,
                  message: issue.message,
                  statusCode: StatusCodes.UNPROCESSABLE_ENTITY,
               })
            );
         }

         seen.add(uniqueKey);
      }
   }

   if (errors.length > 0) {
      return MakeError(errors);
   }

   return MakeError(AppError.convertToAppError(options.defaultError));
}

export function customCode(code: string) {
   return (issue: z.core.$ZodIssue) =>
      issue.code === "custom" &&
      (issue.params as { code?: string } | undefined)?.code === code;
}
