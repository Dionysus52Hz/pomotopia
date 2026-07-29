import { TranslationValues } from "next-intl";
import * as z from "zod";

export const createSignUpSchema = (
   t: (key: string, values?: TranslationValues) => string
) => {
   return z
      .object({
         email: z.email({ error: t("auth.validation.INVALID_EMAIL") }),
         password: z
            .string()
            .min(6, t("auth.validation.PASSWORD_TOO_SHORT", { count: 6 })),
         confirmPassword: z
            .string()
            .min(6, t("auth.validation.PASSWORD_TOO_SHORT", { count: 6 })),
      })
      .refine((data) => data.password === data.confirmPassword, {
         message: t("auth.validation.PASSWORD_MISMATCH"),
         path: ["confirmPassword"],
      });
};

export type SignUpInput = z.infer<ReturnType<typeof createSignUpSchema>>;

export const createSignInSchema = (
   t: (key: string, values?: TranslationValues) => string
) => {
   return z.object({
      email: z
         .string(t("auth.validation.INVALID_INPUT"))
         .min(1, t("auth.validation.EMAIL_REQUIRED")),
      password: z
         .string(t("auth.validation.INVALID_INPUT"))
         .min(1, t("auth.validation.PASSWORD_REQUIRED")),
   });
};

export type SignInInput = z.infer<ReturnType<typeof createSignInSchema>>;
