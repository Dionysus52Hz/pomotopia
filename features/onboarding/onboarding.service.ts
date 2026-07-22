import { ServiceResponse } from "@/lib/api/response";
import { UserServiceDTO } from "@/features/auth/auth.dto";
import { AppError } from "@/lib/api/error";
import { ONBOARDING_ERRORS } from "@/features/onboarding/onboarding.error";
import { COMMON_ERRORS } from "@/constants/common-errors";
import { db } from "@/lib/drizzle/database";
import { profiles, UpdateProfile } from "@/lib/drizzle/schema/profiles";
import { eq } from "drizzle-orm";
import { SupabaseClient } from "@supabase/supabase-js";
import { DrizzleError } from "@/lib/drizzle/utils/error";
import { AUTH_ERRORS } from "@/features/auth/auth.error";
import { handleAuthError } from "@/features/auth/auth.helper";

export async function completeOnboarding(
   supabase: SupabaseClient,
   payload: UpdateProfile
): Promise<ServiceResponse<UserServiceDTO>> {
   try {
      const result = await db.transaction(async (tx) => {
         const updatedProfile: UserServiceDTO[] = await tx
            .update(profiles)
            .set({ username: payload.username, onboardingCompleted: true })
            .where(eq(profiles.publicId, payload.publicId!))
            .returning({ publicId: profiles.publicId });

         if (updatedProfile.length === 0) {
            throw AppError.convertToAppError(
               ONBOARDING_ERRORS.system.UPDATE_FAILED
            );
         }

         const { data, error } = await supabase.auth.updateUser({
            data: { onboarding_completed: true },
         });

         if (!data || !data.user) {
            throw AppError.convertToAppError(
               AUTH_ERRORS.business.USER_NOT_FOUND
            );
         }

         if (error) {
            throw AppError.convertToAppError(handleAuthError(error));
         }

         return updatedProfile[0];
      });

      await supabase.auth.refreshSession();
      return [result, null];
   } catch (error) {
      if (error instanceof AppError) {
         return [null, [error]];
      } else if (DrizzleError.isUniqueViolation(error)) {
         return [
            null,
            [
               AppError.convertToAppError(
                  ONBOARDING_ERRORS.business.USERNAME_ALREADY_EXISTS
               ),
            ],
         ];
      } else if (DrizzleError.isForeignKeyViolation(error)) {
         return [
            null,
            [
               AppError.convertToAppError(
                  ONBOARDING_ERRORS.business.USER_NOT_FOUND
               ),
            ],
         ];
      } else {
         return [
            null,
            [
               AppError.convertToAppError(
                  COMMON_ERRORS.system.INTERNAL_SERVER_ERROR
               ),
            ],
         ];
      }
   }
}
