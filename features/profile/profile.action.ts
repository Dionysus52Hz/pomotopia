"use server";

import { AppResponse, MakeError, MakeSuccess } from "@/lib/api/response";
import {
   getUserProfile,
   GetUserProfilePayload,
   getUserStats,
   GetUserStatsPayload,
} from "@/features/profile/profile.service";
import {
   ProfileActionDTO,
   StatsActionDTO,
} from "@/features/profile/profile.dto";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { AppError } from "@/lib/api/error";
import { AUTH_ERRORS } from "@/features/auth/auth.error";
import { authenticate, authorize } from "@/features/auth/auth.helper";

export async function getProfileAction(
   payload: GetUserProfilePayload
): Promise<AppResponse<ProfileActionDTO>> {
   const supabase = await getSupabaseServerClient();
   const [user, authError] = await authenticate(supabase);
   if (authError) {
      return MakeError(authError);
   }

   const [profile, error] = await getUserProfile(supabase, payload);
   if (error) {
      return MakeError(error);
   }

   const profileDTO: ProfileActionDTO = {
      publicId: profile.publicId,
      username: profile.username,
      avatarUrl: profile.avatarUrl,
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
