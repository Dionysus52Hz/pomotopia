import { TranslationValues } from "next-intl";
import * as z from "zod";

export const createOnboardingSchema = (
   t: (key: string, values?: TranslationValues) => string
) => {
   return z.object({
      username: z
         .string(t("onboarding.validation.USERNAME_REQUIRED"))
         .min(3, t("onboarding.validation.USERNAME_TOO_SHORT", { count: 3 }))
         .max(20, t("onboarding.validation.USERNAME_TOO_LONG", { count: 20 }))
         .regex(/^[a-zA-Z0-9_]+$/, t("onboarding.validation.INVALID_USERNAME")),
   });
};

export type OnboardingInput = z.infer<
   ReturnType<typeof createOnboardingSchema>
>;
