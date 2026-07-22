import { AUTH_ERRORS } from "@/features/auth/auth.error";
import { ServiceResponse } from "@/lib/api/response";
import { logger } from "@/lib/api/logger";
import { AppError } from "@/lib/api/error";
import {
   ProfileServiceDTO,
   StatsServiceDTO,
} from "@/features/profile/profile.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { db } from "@/lib/drizzle/database";
import { profiles, SelectProfile } from "@/lib/drizzle/schema/profiles";
import { COMMON_ERRORS } from "@/constants/common-errors";
import { eq } from "drizzle-orm";
import { DrizzleError } from "@/lib/drizzle/utils/error";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";
import { profile } from "console";

export type GetUserProfilePayload = {
   publicId: string;
};
export type GetUserStatsPayload = {
   publicId: string;
};

export async function getUserProfile(
   supabase: SupabaseClient,
   payload: GetUserProfilePayload
): Promise<ServiceResponse<ProfileServiceDTO>> {
   try {
      const result: SelectProfile[] = await db
         .select()
         .from(profiles)
         .where(eq(profiles.publicId, payload.publicId));

      if (result.length === 0) {
         return [
            null,
            [
               AppError.convertToAppError(
                  PROFILE_ERRORS.business.USER_NOT_FOUND
               ),
            ],
         ];
      }

      const profileDTO: ProfileServiceDTO = {
         publicId: payload.publicId,
         avatarUrl: result[0].avatarUrl,
         username: result[0].username,
      };
      return [profileDTO, null];
   } catch (error) {
      if (DrizzleError.isPostgresError(error)) {
         return [
            null,
            [AppError.convertToAppError(COMMON_ERRORS.system.DATABASE_ERROR)],
         ];
      }

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

export async function getUserStats(
   supabase: SupabaseClient,
   payload: GetUserStatsPayload
): Promise<ServiceResponse<StatsServiceDTO>> {
   try {
      const result = await db.query.profiles.findFirst({
         where: eq(profiles.publicId, payload.publicId),
         columns: {
            publicId: true,
            level: true,
            exp: true,
            timeEssence: true,
         },
      });

      if (!result) {
         return [
            null,
            [
               AppError.convertToAppError(
                  PROFILE_ERRORS.business.USER_NOT_FOUND
               ),
            ],
         ];
      }

      return [
         {
            publicId: result.publicId,
            exp: result.exp,
            timeEssence: result.timeEssence,
            level: result.level,
         },
         null,
      ];
   } catch (error) {
      if (DrizzleError.isPostgresError(error)) {
         return [
            null,
            [AppError.convertToAppError(COMMON_ERRORS.system.DATABASE_ERROR)],
         ];
      }

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
