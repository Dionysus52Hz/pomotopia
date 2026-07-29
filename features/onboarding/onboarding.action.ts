"use server";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { createOnboardingSchema } from "./onboarding.schema";
import { AppResponse, MakeError, MakeSuccess } from "@/lib/api/response";
import { completeOnboarding } from "@/features/onboarding/onboarding.service";
import { UserActionDTO } from "@/features/auth/auth.dto";
import { AppError } from "@/lib/api/error";
import { ONBOARDING_ERRORS } from "@/features/onboarding/onboarding.error";
import { handleZodValidationError } from "@/lib/api/validation";
import { authenticate, authorize } from "@/features/auth/auth.helper";

export async function completeOnboardingAction(
   payload: unknown
): Promise<AppResponse<UserActionDTO>> {
   const supabase = await getSupabaseServerClient();
   const [user, authError] = await authenticate(supabase);
   if (authError) {
      return MakeError(authError);
   }

   const t = await getTranslations("errors");
   const onboardingSchema = createOnboardingSchema(t);
   const validation = onboardingSchema.safeParse(payload);

   if (!validation.success) {
      return handleZodValidationError(validation.error, {
         defaultError: AppError.convertToAppError(
            ONBOARDING_ERRORS.validation.INVALID_USERNAME
         ),
      });
   }

   const { username } = validation.data;
   const [_user, error] = await completeOnboarding(supabase, {
      publicId: user.id,
      username: username,
   });

   if (error) {
      return MakeError(error);
   }

   return MakeSuccess({ publicId: _user.publicId });
}
