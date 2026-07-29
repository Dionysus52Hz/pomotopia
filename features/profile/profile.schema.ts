import { VARIABLES } from "@/constants/variables";
import { PROFILE_ERRORS } from "@/features/profile/profile.error";
import { TranslationValues } from "next-intl";
import * as z from "zod";

export const createUserInformationSchema = (
   t: (key: string, values?: TranslationValues) => string
) => {
   return z.object({
      username: z
         .string(t("profile.validation.INVALID_INPUT"))
         .min(1, t("profile.validation.USERNAME_REQUIRED"))
         .max(20, t("profile.validation.USERNAME_TOO_LONG", { count: 20 })),
   });
};

export type UserInformationInput = z.infer<
   ReturnType<typeof createUserInformationSchema>
>;

export const createUserAvatarSchema = (
   t: (key: string, values?: TranslationValues) => string
) => {
   const v = VARIABLES.FILES.USER_AVATAR;
   return z.object({
      file: z
         .custom<File>((value) => value instanceof File, {
            message: t("profile.validation.INVALID_INPUT"),
            params: {
               error: PROFILE_ERRORS.validation.INVALID_INPUT,
            },
         })
         .refine(
            (file) =>
               (v.ACCEPTED_FILE_TYPES as readonly string[]).includes(file.type),
            {
               message: t("profile.validation.UNACCEPTED_AVATAR_FILE_TYPES"),
               params: {
                  error: PROFILE_ERRORS.validation.UNACCEPTED_AVATAR_FILE_TYPES,
               },
            }
         )
         .refine((file) => file.size <= v.MAX_FILE_SIZE_B, {
            message: t("profile.validation.AVATAR_TOO_LARGE", {
               size: v.MAX_FILE_SIZE_MB,
            }),
            params: {
               error: PROFILE_ERRORS.validation.AVATAR_TOO_LARGE,
            },
         }),
   });
};

export type UserAvatarInput = z.infer<
   ReturnType<typeof createUserAvatarSchema>
>;
