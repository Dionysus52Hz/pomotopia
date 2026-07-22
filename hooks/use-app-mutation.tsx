"use client";

import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { AppError, SerializedAppError } from "@/lib/api/error";

export function useAppMutation<
   TData,
   TErrors = SerializedAppError[],
   TVariables = void,
   TContext = unknown,
>(options: UseMutationOptions<TData, TErrors, TVariables, TContext>) {
   const t = useTranslations("errors");

   return useMutation({
      ...options,
      onError: (errors, variables, onMutateResult, context) => {
         if (Array.isArray(errors)) {
            const error: SerializedAppError = errors[0];
            if (!error.field) {
               toast.error(
                  t.has(error.code)
                     ? t(error.code)
                     : error.message || t("system.UNKNOWN_ERROR")
               );
            }
         } else if (errors instanceof AppError) {
            toast.error(t.has(errors.code) ? t(errors.code) : errors.message);
         } else if (errors instanceof Error) {
            toast.error(errors.message);
         } else {
            toast.error(t("system.UNKNOWN_ERROR"));
         }

         options.onError?.(errors, variables, onMutateResult, context);
      },
   });
}
