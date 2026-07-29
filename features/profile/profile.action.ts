"use server";

import { AppResponse, MakeError, MakeSuccess } from "@/lib/api/response";
import {
   getUserProfile,
   GetUserProfilePayload,
   getUserStats,
   GetUserStatsPayload,
   updateUserAvatar,
   updateUserInformation,
} from "@/features/profile/profile.service";
import {
   FullProfileDTO,
   StatsActionDTO,
   UserAvatarDTO,
} from "@/features/profile/profile.dto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/error";
import { authenticate } from "@/features/auth/auth.helper";
import { getTranslations } from "next-intl/server";
import {
   createUserAvatarSchema,
   createUserInformationSchema,
} from "@/features/profile/profile.schema";
import { handleZodValidationError } from "@/lib/api/validation";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";

export async function getProfileAction(
   payload: GetUserProfilePayload
): Promise<AppResponse<FullProfileDTO>> {
   const supabase = await getSupabaseServerClient();
   const [user, authError] = await authenticate(supabase);
   if (authError) {
      return MakeError(authError);
   }

   const [profile, error] = await getUserProfile(supabase, payload);
   if (error) {
      return MakeError(error);
   }

   const profileDTO: FullProfileDTO = {
      publicId: profile.publicId,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      level: profile.level,
      avatarHistory: profile.avatarHistory,
   };

   return MakeSuccess(profileDTO);
}

export async function getStatsAction(
   payload: GetUserStatsPayload
): Promise<AppResponse<StatsActionDTO>> {
   const supabase = await getSupabaseServerClient();
   const [user, authError] = await authenticate(supabase);
   if (authError) {
      return MakeError(authError);
   }

   const [stats, error] = await getUserStats(supabase, payload);
   if (error) {
      return MakeError(error);
   }

   const statsDTO: StatsActionDTO = {
      publicId: stats.publicId,
      level: stats.level,
      exp: stats.exp,
      timeEssence: stats.timeEssence,
   };

   return MakeSuccess(statsDTO);
}

export async function updateUserInformationAction(
   payload: unknown
): Promise<AppResponse<FullProfileDTO>> {
   const supabase = await getSupabaseServerClient();
   const [user, authError] = await authenticate(supabase);
   if (authError) {
      return MakeError(authError);
   }

   const t = await getTranslations("errors");
   const informationSchema = createUserInformationSchema(t);
   const validation = informationSchema.safeParse(payload);

   if (!validation.success) {
      return handleZodValidationError(validation.error, {
         defaultError: AppError.convertToAppError(
            PROFILE_ERRORS.validation.INVALID_USERNAME
         ),
      });
   }

   const { username } = validation.data;
   const [_user, error] = await updateUserInformation(supabase, {
      publicId: user.id,
      username: username,
   });

   if (error) {
      return MakeError(error);
   }

   return MakeSuccess({
      publicId: _user.publicId,
      avatarUrl: _user.avatarUrl,
      username: _user.username,
      level: _user.level,
      avatarHistory: _user.avatarHistory,
   });
}

export async function updateUserAvatarAction(
   payload: unknown
): Promise<AppResponse<UserAvatarDTO>> {
   const supabase = await getSupabaseServerClient();
   const [user, authError] = await authenticate(supabase);
   if (authError) {
      return MakeError(authError);
   }

   const t = await getTranslations("errors");
   const avatarSchema = createUserAvatarSchema(t);
   const validation = avatarSchema.safeParse(payload);

   if (!validation.success) {
      return handleZodValidationError(validation.error, {
         defaultError: AppError.convertToAppError(
            PROFILE_ERRORS.validation.INVALID_USERNAME
         ),
      });
   }

   const { file } = validation.data;
   const [_user, error] = await updateUserAvatar(supabase, {
      publicId: user.id,
      avatar: file,
   });

   if (error) {
      return MakeError(error);
   }

   return MakeSuccess({
      publicId: _user.publicId,
      avatarUrl: _user.avatarUrl,
      username: _user.username,
      avatarHistory: _user.avatarHistory,
   });
}
