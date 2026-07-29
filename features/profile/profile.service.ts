import { ServiceResponse } from "@/lib/api/response";
import { AppError } from "@/lib/api/error";
import {
   FullProfileDTO,
   StatsServiceDTO,
   UserAvatarDTO,
} from "@/features/profile/profile.dto";
import { SupabaseClient } from "@supabase/supabase-js";
import { db } from "@/lib/drizzle/database";
import {
   AvatarHistory,
   profiles,
   SelectProfile,
   UpdateProfile,
} from "@/lib/drizzle/schema/profiles";
import { COMMON_ERRORS } from "@/constants/common-errors";
import { eq } from "drizzle-orm";
import { DrizzleError } from "@/lib/drizzle/utils/error";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";
import {
   deleteFromCloudinary,
   uploadToCloudinary,
} from "@/features/upload/upload.service";
import { isSimilarImage } from "@/lib/cloudinary/utils";

export type GetUserProfilePayload = {
   publicId: string;
};
export type GetUserStatsPayload = {
   publicId: string;
};

export async function getUserProfile(
   supabase: SupabaseClient,
   payload: GetUserProfilePayload
): Promise<ServiceResponse<FullProfileDTO>> {
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
      const profile = result[0];
      const profileDTO: FullProfileDTO = {
         publicId: payload.publicId,
         avatarUrl: profile.avatarUrl,
         username: profile.username,
         level: profile.level,
         avatarHistory: profile.avatarHistory,
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

export async function updateUserInformation(
   supabase: SupabaseClient,
   payload: UpdateProfile
): Promise<ServiceResponse<FullProfileDTO>> {
   try {
      const result = await db.transaction(async (tx) => {
         const updatedProfile: FullProfileDTO[] = await tx
            .update(profiles)
            .set({ username: payload.username })
            .where(eq(profiles.publicId, payload.publicId!))
            .returning({
               publicId: profiles.publicId,
               username: profiles.username,
               avatarUrl: profiles.avatarUrl,
               level: profiles.level,
               avatarHistory: profiles.avatarHistory,
            });

         if (updatedProfile.length === 0) {
            throw AppError.convertToAppError(
               PROFILE_ERRORS.system.UPDATE_FAILED
            );
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
                  PROFILE_ERRORS.business.USERNAME_ALREADY_EXISTS
               ),
            ],
         ];
      } else if (DrizzleError.isForeignKeyViolation(error)) {
         return [
            null,
            [
               AppError.convertToAppError(
                  PROFILE_ERRORS.business.USER_NOT_FOUND
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

export async function updateUserAvatar(
   supabase: SupabaseClient,
   payload: UpdateProfile & {
      avatar: File;
   }
): Promise<ServiceResponse<UserAvatarDTO>> {
   let imagePublicIdToDestroy: string | null = null;

   try {
      const uploadPreset = process.env.CLOUDINARY_AVATAR_UPLOAD_PRESET!;
      const buffer = Buffer.from(await payload.avatar.arrayBuffer());

      const result = await db.transaction(async (tx) => {
         const uploadResult = await uploadToCloudinary(uploadPreset, buffer);

         const [currentProfile] = await tx
            .select({ avatarHistory: profiles.avatarHistory })
            .from(profiles)
            .where(eq(profiles.publicId, payload.publicId!))
            .for("update");

         if (!currentProfile) {
            throw AppError.convertToAppError(
               PROFILE_ERRORS.business.USER_NOT_FOUND
            );
         }

         const history = currentProfile.avatarHistory ?? [];

         const newEntry: AvatarHistory = {
            publicId: uploadResult.public_id,
            secureUrl: uploadResult.secure_url,
            pHash: uploadResult.phash,
            uploadedAt: new Date(),
         };

         const duplicateIndex = history.findIndex((entry) =>
            isSimilarImage(entry.pHash, uploadResult.phash)
         );

         let updatedHistory: AvatarHistory[];

         if (duplicateIndex !== -1) {
            imagePublicIdToDestroy = history[duplicateIndex].publicId;
            updatedHistory = [...history];
            updatedHistory[duplicateIndex] = newEntry;
         } else {
            updatedHistory = [...history, newEntry];
         }

         const updatedProfile: UserAvatarDTO[] = await tx
            .update(profiles)
            .set({
               avatarUrl: uploadResult.secure_url,
               avatarHistory: updatedHistory,
            })
            .where(eq(profiles.publicId, payload.publicId!))
            .returning({
               publicId: profiles.publicId,
               username: profiles.username,
               avatarUrl: profiles.avatarUrl,
               avatarHistory: profiles.avatarHistory,
            });

         if (updatedProfile.length === 0) {
            throw AppError.convertToAppError(
               PROFILE_ERRORS.system.UPDATE_FAILED
            );
         }

         return updatedProfile[0];
      });

      if (imagePublicIdToDestroy) {
         await deleteFromCloudinary(imagePublicIdToDestroy).catch((err) => {
            console.error(
               "Failed to destroy old avatar on Cloudinary:",
               imagePublicIdToDestroy,
               err
            );
         });
      }

      await supabase.auth.refreshSession();
      return [result, null];
   } catch (error) {
      console.log(error);
      if (error instanceof AppError) {
         return [null, [error]];
      } else if (DrizzleError.isUniqueViolation(error)) {
         return [
            null,
            [
               AppError.convertToAppError(
                  PROFILE_ERRORS.business.USERNAME_ALREADY_EXISTS
               ),
            ],
         ];
      } else if (DrizzleError.isForeignKeyViolation(error)) {
         return [
            null,
            [
               AppError.convertToAppError(
                  PROFILE_ERRORS.business.USER_NOT_FOUND
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
